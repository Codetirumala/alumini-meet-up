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

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin or self optionally (basic guard)
    // If needed, uncomment below
    // if (user.role === 'admin') {
    //   const adminCount = await User.countDocuments({ role: 'admin' });
    //   if (adminCount <= 1) {
    //     return res.status(400).json({ message: 'Cannot delete the last admin' });
    //   }
    // }

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
