const express = require('express');
const {
  createConnection,
  getMyConnections,
  updateConnectionStatus,
  removeConnection
} = require('../controllers/connectionController');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/', auth, createConnection);
router.get('/my', auth, getMyConnections);
router.put('/:connectionId/status', auth, updateConnectionStatus);
router.delete('/:connectionId', auth, removeConnection);

module.exports = router;
