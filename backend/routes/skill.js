const express = require('express');
const {
  getAllSkills,
  getSkillById,
  createSkill,
  requestSkill,
  requestSkillExchange,
  updateRequestStatus,
  getMySkills,
  getMyRequests
} = require('../controllers/skillController');
const auth = require('../middleware/auth');
const router = express.Router();



router.post('/create', auth, createSkill);
router.put('/requests/:requestId/status', auth, updateRequestStatus);
router.get('/myskills', auth, getMySkills);
router.get('/myrequests', auth, getMyRequests); 
router.post('/:id/request', auth, requestSkill);
router.post('/:id/exchange', auth, requestSkillExchange);

router.get('/', getAllSkills);
router.get('/:id', getSkillById);

module.exports = router;
