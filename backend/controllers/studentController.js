const StudentProfile = require('../models/StudentProfile');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// CREATE or UPDATE profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = {
      user: req.user._id,
      ...req.body
    };

    const profile = await StudentProfile.findOneAndUpdate(
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
    const profile = await StudentProfile.findOne({ user: req.user._id })
      .populate('user', 'name email');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload profile asset (image or resume) to Cloudinary
exports.uploadProfileAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded', details: { type: req.query.type } });
    }

    const folder = `students/${req.user._id}`;
    const resource_type = req.query.type === 'image' ? 'image' : 'raw';

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        // Optionally persist URLs in profile based on type
        if (req.query.type === 'image') {
          await StudentProfile.findOneAndUpdate(
            { user: req.user._id },
            { profilePhoto: result.secure_url },
            { upsert: true }
          );
        } else if (req.query.type === 'banner') {
          await StudentProfile.findOneAndUpdate(
            { user: req.user._id },
            { bannerPhoto: result.secure_url },
            { upsert: true }
          );
        } else if (req.query.type === 'resume') {
          await StudentProfile.findOneAndUpdate(
            { user: req.user._id },
            { resumeLink: result.secure_url },
            { upsert: true }
          );
        }

        return res.json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
