const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { addFollowUp,editFollowUp ,deleteFollowUp} = require('../controllers/followUpController')

router.post('/save', addFollowUp);
router.post('/edit', protect, editFollowUp)
router.post('/delete', protect, deleteFollowUp)

module.exports = router