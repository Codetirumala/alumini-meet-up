const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$lastMessage' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiverInfo'
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              { $arrayElemAt: ['$receiverInfo', 0] },
              { $arrayElemAt: ['$senderInfo', 0] }
            ]
          }
        }
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          read: 1,
          'otherUser._id': 1,
          'otherUser.name': 1,
          'otherUser.email': 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete conversation between two users
exports.deleteConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Message.deleteMany({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    });

    res.json({ 
      message: 'Conversation deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
