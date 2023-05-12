const express = require('express')
const router = express.Router();

/* Upload Files */
const { uploadFile } = require('../middleware/uploadFileMiddleware');


const { addStudent, getStudentById, getStudents, assignedManager, createStatus, editStatus, getAllStatus, getStatusById, changeStatus, editStudent,updateStatus,editPirsonalInfo,editEducation,addEducation,addLanguage ,editlanguage,addWorkExperiance,editWorkExperiance,deleteWorkExperiance,deleteLanguage,deleteEducation,getallEducation, getStudentEducation, getStudentworkExperience, getStudentlanguages,MobileVerify,EmailVerify} = require('../controllers/studentController')
const { protect } = require('../middleware/authMiddleware')


router.post('/save', uploadFile.single("file"), addStudent);
router.post('/edit', protect, editStudent)
router.post('/assignedManager', protect, assignedManager)
router.post('/updateStatus', protect, updateStatus)
router.get('/get', protect, getStudents)
router.post('/createStatus', createStatus)
router.post('/editStatus', protect, editStatus)
router.get('/getAllStatus', protect, getAllStatus)
router.post('/changeStatus', protect, changeStatus)
router.get('/getStatusById/:id', protect, getStatusById)
router.get('/:id', protect, getStudentById)
router.post('/editPirsonalInfo', protect, editPirsonalInfo)
router.post('/editEducation', protect, editEducation)
router.post('/editlanguage', protect, editlanguage)
router.post('/addEducation/:id', protect, addEducation)
router.get('/getallEducation/:id', protect, getallEducation)
router.post('/addLanguage/:id', protect, addLanguage)
router.post('/addWorkExperiance/:id', protect, addWorkExperiance)
router.post('/editWorkExperiance', protect, editWorkExperiance)
router.post('/deleteWorkExperiance', protect, deleteWorkExperiance)
router.post('/deleteLanguage', protect, deleteLanguage)
router.post('/deleteEducation', protect, deleteEducation)
router.get('/getStudentEducation/:studentid', protect, getStudentEducation)
router.get('/getStudentworkExperience/:studentid', protect, getStudentworkExperience)
router.get('/getStudentlanguages/:studentid', protect, getStudentlanguages)
router.post('/MobileVerify', protect, MobileVerify)
router.post('/EmailVerify', protect, EmailVerify)

module.exports = router
