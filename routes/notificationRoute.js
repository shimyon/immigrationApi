const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const {
    addNotification, editNotification, deleteNotification,
    getAllNotification, getAllNotificationByUId,
    setmarkasread, getMostRecentById } = require('../controllers/notificationController')

router.post('/save', addNotification);
router.post('/edit', protect, editNotification)
router.post('/delete', protect, deleteNotification)
router.get('/getAllNotification', protect, getAllNotification)
router.post('/getAllNotificationByUId', protect, getAllNotificationByUId)
router.post('/markasread', protect, setmarkasread)
router.post('/getMostRecentById', protect, getMostRecentById)


module.exports = router