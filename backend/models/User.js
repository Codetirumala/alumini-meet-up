const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['admin', 'alumni', 'student'],
      default: 'student'
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    resetOTP: {
      type: String,
      default: null
    },

    resetOTPExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Add indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });

// Virtual populate for alumniProfile
userSchema.virtual('alumniProfile', {
  ref: 'AlumniProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

module.exports = mongoose.model('User', userSchema);
