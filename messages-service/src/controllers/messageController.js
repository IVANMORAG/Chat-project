const Message = require('../models/Message');
const createError = require('http-errors');
const { getIO } = require('../utils/socketManager');

// Enviar mensaje a una sala
exports.sendMessage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user.id;

    const newMessage = new Message({
      room: roomId,
      sender: senderId,
      content,
      attachments
    });

    const savedMessage = await newMessage.save()
      .then(msg => msg.populate('sender', 'name email'));

    // Emitir el mensaje a través de Socket.IO
    const io = getIO();
    io.to(roomId).emit('newMessage', savedMessage);

    res.status(201).json({
      success: true,
      data: savedMessage
    });
  } catch (error) {
    next(error);
  }
};

// Obtener historial de mensajes de una sala
exports.getRoomMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;

    let query = { room: roomId };
    
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('sender', 'name email');

    res.json({
      success: true,
      count: messages.length,
      data: messages.reverse() // Ordenar de más antiguo a más reciente
    });
  } catch (error) {
    next(error);
  }
};

// Editar mensaje
exports.editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      throw createError(404, 'Mensaje no encontrado');
    }

    // Solo el remitente puede editar el mensaje
    if (message.sender.toString() !== userId) {
      throw createError(403, 'Solo el remitente puede editar este mensaje');
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = Date.now();

    const updatedMessage = await message.save()
      .then(msg => msg.populate('sender', 'name email'));

    // Notificar a los clientes sobre la edición
    const io = getIO();
    io.to(message.room.toString()).emit('messageEdited', updatedMessage);

    res.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar mensaje
exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      throw createError(404, 'Mensaje no encontrado');
    }

    // Solo el remitente o un admin puede eliminar el mensaje
    const isSender = message.sender.toString() === userId;
    const isAdmin = req.room.members.some(
      m => m.user._id === userId && m.role === 'admin'
    );

    if (!isSender && !isAdmin) {
      throw createError(403, 'No tienes permiso para eliminar este mensaje');
    }

    await Message.findByIdAndDelete(messageId);

    // Notificar a los clientes sobre la eliminación
    const io = getIO();
    io.to(message.room.toString()).emit('messageDeleted', messageId);

    res.json({
      success: true,
      data: { message: 'Mensaje eliminado correctamente' }
    });
  } catch (error) {
    next(error);
  }
};