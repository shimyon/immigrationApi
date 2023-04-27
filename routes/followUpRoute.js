const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { addFollowUp,editFollowUp ,deleteFollowUp, getFollowupList, getFollowupById} = require('../controllers/followUpController')

router.post('/save', addFollowUp);
router.post('/edit', protect, editFollowUp)
router.post('/delete', protect, deleteFollowUp)
router.get('/getall', protect, getFollowupList)
router.get('/get/:id', protect, getFollowupById)

module.exports = router