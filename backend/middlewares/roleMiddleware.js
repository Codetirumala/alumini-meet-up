const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If user is alumni, check if they are approved
    if (req.user.role === 'alumni' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval by admin' });
    }

    next();
  };
};

module.exports = authorizeRoles;
