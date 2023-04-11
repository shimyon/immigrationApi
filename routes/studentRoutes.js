const express = require('express')
const router = express.Router();



const { addStudent, getStudentById, getStudents, assignedManager} = require('../controllers/studentController')
const { protect } = require('../middleware/authMiddleware');

/* Upload Files */
const { uploadFile } = require('../middleware/uploadFileMiddleware');

router.post('/save', uploadFile.single("file"), addStudent);
router.post('/assignedManager', protect, assignedManager)
router.get('/get',protect, getStudents)
router.get('/:id',protect, getStudentById)

module.exports = router
