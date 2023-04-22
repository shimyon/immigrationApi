const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { addNotification,editNotification,deleteNotification ,getAllNotification,getAllNotificationByUId,setmarkasread,getMostRecentById} = require('../controllers/notificationController')

router.post('/save', addNotification);
router.post('/edit', protect, editNotification)
router.post('/delete', protect, deleteNotification)
router.get('/getAllNotification', protect, getAllNotification)
router.get('/getAllNotificationByUId', protect, getAllNotificationByUId)
router.get('/markasread', protect, setmarkasread)
router.get('/getMostRecentById', protect, getMostRecentById)


module.exports = router