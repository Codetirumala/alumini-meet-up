const AlumniProfile = require('../models/AlumniProfile');
const Connection = require('../models/Connection');
const Job = require('../models/Job');
const Event = require('../models/Event');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// CREATE or UPDATE profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = {
      user: req.user._id,
      ...req.body
    };

    const profile = await AlumniProfile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET own profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ user: req.user._id })
      .populate('user', 'name email');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPLOAD profile asset (photo/resume)
exports.uploadProfileAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const fileType = req.query.type || 'image';
    const userId = req.user._id;

    if (!['image', 'resume'].includes(fileType)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `alumni/${userId}`,
        resource_type: fileType === 'resume' ? 'raw' : 'image',
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        const updateField = fileType === 'resume' ? 'resumeLink' : 'profilePhoto';
        const profile = await AlumniProfile.findOneAndUpdate(
          { user: userId },
          { [updateField]: result.secure_url },
          { new: true }
        );

        res.json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all alumni profiles (students & admin)
exports.getAllAlumni = async (req, res) => {
  try {
    const profiles = await AlumniProfile.find()
      .populate('user', 'name email');

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET alumni dashboard stats
exports.getAlumniStats = async (req, res) => {
  try {
    const alumniId = req.user._id;

    // Count accepted connections (students connected)
    const studentsConnected = await Connection.countDocuments({
      recipient: alumniId,
      status: 'accepted'
    });

    // Count jobs posted by this alumni
    const jobsPosted = await Job.countDocuments({
      postedBy: alumniId
    });

    // Count events created by this alumni
    const eventsHosted = await Event.countDocuments({
      createdBy: alumniId
    });

    // Calculate profile strength
    const profile = await AlumniProfile.findOne({ user: alumniId });
    let profileStrength = 0;
    
    if (profile) {
      const fields = [
        profile.fullName,
        profile.currentCompany,
        profile.currentPosition,
        profile.workExperience?.length > 0,
        profile.education?.length > 0,
        profile.technicalSkills?.length > 0,
        profile.bio,
        profile.linkedIn,
        profile.github,
        profile.profilePhoto
      ];
      
      const filledFields = fields.filter(field => field).length;
      profileStrength = Math.round((filledFields / fields.length) * 100);
    }

    res.json({
      studentsConnected,
      jobsPosted,
      eventsHosted,
      profileStrength
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
