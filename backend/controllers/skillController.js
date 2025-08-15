const Skill = require('../models/Skill');

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('author', 'name email')
      .populate('requests.user', 'name email');
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const createSkill = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;
    
    const skill = new Skill({
      title,
      description,
      category,
      level,
      author: req.user._id
    });
    
    await skill.save();
    await skill.populate('author', 'name email');
    
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const requestSkill = async (req, res) => {
  try {
    const { message } = req.body;
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
 
    const existingRequest = skill.requests.find(
      request => request.user.toString() === req.user._id.toString()
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Already requested' });
    }
    
    skill.requests.push({
      user: req.user._id,
      type: 'learn',
      message
    });
    
    await skill.save();
    res.json({ message: 'Learning request sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const requestSkillExchange = async (req, res) => {
  try {
    const { message, offeredSkill } = req.body;
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (!offeredSkill || !offeredSkill.title || !offeredSkill.description || !offeredSkill.category) {
      return res.status(400).json({ message: 'Offered skill details are required' });
    }
    
   
    const existingRequest = skill.requests.find(
      request => request.user.toString() === req.user._id.toString()
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Already requested' });
    }
    
    skill.requests.push({
      user: req.user._id,
      type: 'exchange',
      message,
      offeredSkill: {
        title: offeredSkill.title,
        description: offeredSkill.description,
        category: offeredSkill.category,
        level: offeredSkill.level || 'Beginner'
      }
    });
    
    await skill.save();
    res.json({ message: 'Exchange request sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const skill = await Skill.findOne({
      author: req.user._id,
      'requests._id': requestId
    });
    
    if (!skill) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }
    
    const request = skill.requests.id(requestId);
    request.status = status;
    
    await skill.save();
    res.json({ message: `Request ${status} successfully` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ author: req.user._id })
      .populate('requests.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const skills = await Skill.find({ author: req.user._id })
      .populate('requests.user', 'name email')
      .sort({ createdAt: -1 });
    
    const allRequests = [];
    skills.forEach(skill => {
      skill.requests.forEach(request => {
        allRequests.push({
          ...request.toObject(),
          skillTitle: skill.title,
          skillId: skill._id,
          skillCategory: skill.category
        });
      });
    });
    
  
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allRequests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
getAllSkills,
getSkillById,
createSkill,
requestSkill,
requestSkillExchange,
updateRequestStatus,
getMySkills,
getMyRequests,
}
