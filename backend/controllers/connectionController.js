const Connection = require('../models/Connection');
const StudentProfile = require('../models/StudentProfile');

// Send connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId
    });

    const populatedConnection = await Connection.findById(connection._id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email');

    res.status(201).json(populatedConnection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get connection status with a user
exports.getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: userId },
        { requester: userId, recipient: req.user._id }
      ]
    });

    if (!connection) {
      return res.json({ status: 'none' });
    }

    // Determine if current user is requester or recipient
    const isRequester = connection.requester.toString() === req.user._id.toString();

    res.json({
      status: connection.status,
      isRequester,
      connectionId: connection._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept connection request
exports.acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Only recipient can accept
    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.json({ message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject or remove connection
exports.removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    await Connection.findByIdAndDelete(connectionId);

    res.json({ message: 'Connection removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all connections for a user
exports.getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.user._id, status: 'accepted' },
        { recipient: req.user._id, status: 'accepted' }
      ]
    })
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    // Format to return the other user
    const formattedConnections = connections.map(conn => {
      const otherUser = conn.requester._id.toString() === req.user._id.toString()
        ? conn.recipient
        : conn.requester;
      
      return {
        _id: conn._id,
        user: otherUser,
        connectedAt: conn.updatedAt
      };
    });

    // Attach student profiles where available
    const userIds = formattedConnections.map(c => c.user?._id).filter(Boolean);
    const profiles = await StudentProfile.find({ user: { $in: userIds } });
    const profileMap = new Map(profiles.map(p => [p.user.toString(), p]));

    const withProfiles = formattedConnections.map(conn => ({
      ...conn,
      user: {
        ...conn.user.toObject ? conn.user.toObject() : conn.user,
        studentProfile: profileMap.get(conn.user._id.toString()) || null
      }
    }));

    res.json(withProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending connection requests (received)
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.user._id,
      status: 'pending'
    })
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });

    const requesterIds = requests.map(r => r.requester?._id).filter(Boolean);
    const profiles = await StudentProfile.find({ user: { $in: requesterIds } });
    const profileMap = new Map(profiles.map(p => [p.user.toString(), p]));

    const withProfiles = requests.map(r => ({
      ...r.toObject(),
      requester: {
        ...r.requester.toObject ? r.requester.toObject() : r.requester,
        studentProfile: profileMap.get(r.requester._id.toString()) || null
      }
    }));

    res.json(withProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
