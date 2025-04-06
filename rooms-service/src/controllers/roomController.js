const Room = require('../models/Room');
const createError = require('http-errors');

// Crear una nueva sala
exports.createRoom = async (req, res, next) => {
  try {
    const { name, description, isPrivate } = req.body;
    const userId = req.user.id;

    const newRoom = new Room({
      name,
      description,
      isPrivate,
      createdBy: userId,
      members: [{
        user: userId,
        role: 'admin'
      }]
    });

    const savedRoom = await newRoom.save();
    
    res.status(201).json({
      success: true,
      data: savedRoom
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las salas públicas o las del usuario
exports.getAllRooms = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const rooms = await Room.find({
      $or: [
        { isPrivate: false },
        { 'members.user': userId }
      ]
    }).populate('createdBy', 'name email')
      .populate('members.user', 'name email');
    
    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalles de una sala específica
exports.getRoomDetails = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email');
    
    if (!room) {
      throw createError(404, 'Sala no encontrada');
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una sala (solo admin)
exports.updateRoom = async (req, res, next) => {
  try {
    const { name, description, isPrivate } = req.body;
    
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { name, description, isPrivate, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!updatedRoom) {
      throw createError(404, 'Sala no encontrada');
    }
    
    res.json({
      success: true,
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una sala (solo admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    
    if (!deletedRoom) {
      throw createError(404, 'Sala no encontrada');
    }
    
    res.json({
      success: true,
      data: deletedRoom
    });
  } catch (error) {
    next(error);
  }
};

// Unirse a una sala
exports.joinRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;
    
    const room = await Room.findById(roomId);
    if (!room) {
      throw createError(404, 'Sala no encontrada');
    }
    
    // Verificar si ya es miembro
    const isMember = room.members.some(m => m.user.toString() === userId);
    if (isMember) {
      throw createError(400, 'Ya eres miembro de esta sala');
    }
    
    // Si la sala es privada, solo puede unirse por invitación (aquí podrías añadir lógica adicional)
    if (room.isPrivate) {
      throw createError(403, 'Esta sala es privada. Necesitas una invitación para unirte');
    }
    
    room.members.push({
      user: userId,
      role: 'member'
    });
    
    const updatedRoom = await room.save();
    
    res.json({
      success: true,
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// Abandonar una sala
exports.leaveRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;
    
    const room = await Room.findById(roomId);
    if (!room) {
      throw createError(404, 'Sala no encontrada');
    }
    
    // Verificar si es miembro
    const memberIndex = room.members.findIndex(m => m.user.toString() === userId);
    if (memberIndex === -1) {
      throw createError(400, 'No eres miembro de esta sala');
    }
    
    // Si es el creador, no puede abandonar (debería transferir admin o eliminar sala)
    if (room.createdBy.toString() === userId) {
      throw createError(400, 'El creador no puede abandonar la sala. Transfiere la administración o elimina la sala');
    }
    
    room.members.splice(memberIndex, 1);
    await room.save();
    
    res.json({
      success: true,
      data: { message: 'Has abandonado la sala exitosamente' }
    });
  } catch (error) {
    next(error);
  }
};