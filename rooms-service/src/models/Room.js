const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede exceder los 200 caracteres']
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Actualizar la fecha de modificación al guardar
roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para mejor rendimiento
roomSchema.index({ name: 'text', description: 'text' });
roomSchema.index({ createdBy: 1 });
roomSchema.index({ 'members.user': 1 });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;