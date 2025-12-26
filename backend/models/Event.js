const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    locationMode: {
      type: String,
      enum: ['College Auditorium', 'Online (Google Meet)', 'Online (Zoom)', 'Other'],
      required: true
    },

    meetLink: {
      type: String
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
