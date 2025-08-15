const User = require('../models/User');
const Skill = require('../models/Skill');


const createConnection = async (req, res) => {
  try {
    const { requestId, skillOffered, skillReceived } = req.body;
    const userId = req.user._id;

    const skill = await Skill.findOne({
      'requests._id': requestId,
      author: userId
    }).populate('requests.user', 'name email');

    if (!skill) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const request = skill.requests.id(requestId);
    const otherUserId = request.user._id;

    request.status = 'connected';
    await skill.save();

    const currentUser = await User.findById(userId);
    currentUser.connections.push({
      user: otherUserId,
      skillOffered: skillOffered,
      skillReceived: skillReceived
    });
    await currentUser.save();


    const otherUser = await User.findById(otherUserId);
    otherUser.connections.push({
      user: userId,
      skillOffered: skillReceived,
      skillReceived: skillOffered  
    });
    await otherUser.save();

    res.json({ message: 'Connection created successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getMyConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('connections.user', 'name email')
      .sort({ 'connections.connectedAt': -1 });
    
    res.json(user.connections || []);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateConnectionStatus = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;

    const user = await User.findById(req.user._id);
    const connection = user.connections.id(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    connection.status = status;
    await user.save();

    res.json({ message: 'Connection status updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const connection = user.connections.id(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const otherUserId = connection.user;

    user.connections.pull(connectionId);
    await user.save();

    const otherUser = await User.findById(otherUserId);
    const otherConnection = otherUser.connections.find(
      conn => conn.user.toString() === userId.toString()
    );
    
    if (otherConnection) {
      otherUser.connections.pull(otherConnection._id);
      await otherUser.save();
    }

    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
    createConnection,
    getMyConnections,
    updateConnectionStatus,
    removeConnection
};
