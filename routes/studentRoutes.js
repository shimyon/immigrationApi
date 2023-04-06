const express = require('express')
const router = express.Router()

const { saveStudent, getStudentById, getStudents, assignedManager} = require('../controllers/studentController')
const { protect } = require('../middleware/authMiddleware')


router.post('/save', saveStudent)
router.post('/assignedManager', protect, assignedManager)
router.get('/get',protect, getStudents)
router.get('/:id',protect, getStudentById)

module.exports = router
