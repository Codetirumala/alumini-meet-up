const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE alumni
exports.approveAlumni = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'alumni') {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Alumni approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
