const express = require('express')
const router = express.Router();

/* Upload Files */
const { uploadFile } = require('../middleware/uploadFileMiddleware');

const { addStudent, getStudentById, getStudents, assignedManager, createStatus, editStatus, getAllStatus, getStatusById, changeStatus, editStudent } = require('../controllers/studentController')
const { protect } = require('../middleware/authMiddleware')


router.post('/save', uploadFile.single("file"), addStudent);
router.post('/edit', protect, editStudent)
router.post('/assignedManager', protect, assignedManager)
router.get('/get', protect, getStudents)
router.post('/createStatus', createStatus)
router.post('/editStatus', protect, editStatus)
router.get('/getAllStatus', protect, getAllStatus)
router.post('/changeStatus', protect, changeStatus)
router.get('/getStatusById/:id', protect, getStatusById)
router.get('/:id', protect, getStudentById)

module.exports = router
