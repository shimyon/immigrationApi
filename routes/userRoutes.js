const express = require('express')
const router = express.Router()

const {
    registerUser, loginUser, getUserById, 
    updateUser, updateUserProfile,
    changePassword, forgotPassword, 
    getManager, getAllUser
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
router.post('/add', registerUser)
router.post('/updateUserProfile', protect, updateUserProfile)
router.post('/updateUser', protect, updateUser)
router.post('/changePassword', protect, changePassword)
router.post('/forgotPassword', protect, forgotPassword)
router.post('/login', loginUser)
router.post('/getManagers', protect, getManager)
router.post('/getAllUser', protect, getAllUser)
router.get('/:id', protect, getUserById)

module.exports = router
