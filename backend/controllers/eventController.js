const Event = require('../models/Event');

// Create event (Admin / Alumni)
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      createdBy: req.user._id,
      ...req.body
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register for event
exports.registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.participants.push(req.user._id);
    await event.save();

    res.json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get alumni's own created events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate('participants', 'name email')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event (alumni/admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the event belongs to the logged-in user
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
