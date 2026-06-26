const express = require('express');
const authMiddleware = require('../middleware/auth');
const { suggestTaskEstimate } = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);
router.post('/suggest-estimate', suggestTaskEstimate);

module.exports = router;
