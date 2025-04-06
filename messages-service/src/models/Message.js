const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'El mensaje no puede exceder los 1000 caracteres']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  attachments: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'file', 'audio']
    }
  }]
}, {
  timestamps: true
});

// Índices para mejor rendimiento
messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;