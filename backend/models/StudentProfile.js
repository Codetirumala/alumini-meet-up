const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    rollNumber: {
      type: String,
    },

    department: {
      type: String,
    },

    year: {
      type: Number
    },

    degree: {
      type: String
    },

    skills: {
      type: [String]
    },

    tools: {
      type: [String]
    },

    interests: {
      type: [String]
    },

    careerGoals: {
      type: String
    },

    graduationYear: {
      type: Number
    },

    resumeLink: {
      type: String
    },

    profilePhoto: {
      type: String
    },

    bannerPhoto: {
      type: String
    },

    githubLink: {
      type: String
    },

    linkedinLink: {
      type: String
    },

    portfolioLink: {
      type: String
    },

    bio: {
      type: String
    },

    displayName: {
      type: String
    },

    collegeName: {
      type: String
    },

    experience: [{
      company: String,
      role: String,
      duration: String,
      description: String
    }],

    projects: [{
      title: String,
      description: String,
      technologies: [String],
      link: String
    }],

    certifications: [{
      title: String,
      issuer: String,
      date: String,
      credentialLink: String
    }],

    achievements: [{
      title: String,
      description: String,
      date: String
    }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
