const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getMe ,updateUser,changePassword,getManager } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
router.post('/add', registerUser)
router.post('/updateUser', protect, updateUser)
router.post('/changePassword', protect, changePassword)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/getManagers', protect, getManager)

module.exports = router
