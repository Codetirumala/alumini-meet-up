const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    // Basic Info
    fullName: String,
    profilePhoto: String,
    batchYear: Number,

    // Academic
    degree: String,
    department: String,
    collegeName: String,

    // Professional
    currentCompany: String,
    designation: String,
    industry: String,
    totalExperience: String,
    currentLocation: String,

    // Skills & Expertise
    technicalSkills: [String],
    tools: [String],
    areasOfExpertise: [String],

    // Mentorship
    openToMentorship: { type: Boolean, default: false },
    mentorshipAreas: [String],
    preferredMode: [String],
    availability: String,

    // Social Links
    linkedinLink: String,
    githubLink: String,
    portfolioLink: String,

    // Bio & Career
    bio: String,
    careerJourney: String,
    adviceToJuniors: String,
    interests: [String],

    // Contributions
    willingPostJobs: { type: Boolean, default: false },
    willingHostEvents: { type: Boolean, default: false },
    willingCampusTalks: { type: Boolean, default: false },

    // Privacy
    profileVisibility: { type: String, enum: ['students-only', 'admin-students'], default: 'students-only' },
    showEmail: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);
