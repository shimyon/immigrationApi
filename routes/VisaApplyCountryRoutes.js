const express = require('express')
const router = express.Router();


const {createVisaApplyCountry, editVisaApplyCountry,getAllVisaApplyCountry, deleteVisaApplyCountryById,getVisaApplyCountryById} = require('../controllers/VisaApplyCountryController')
const { protect } = require('../middleware/authMiddleware')


router.post('/createVisaApplyCountry', createVisaApplyCountry)
router.post('/editVisaApplyCountry', protect, editVisaApplyCountry)
router.get('/getAllVisaApplyCountry/:id', getAllVisaApplyCountry)
router.get('/deleteVisaApplyCountryById/:id', protect, deleteVisaApplyCountryById)
router.get('/getVisaApplyCountryById/:id', protect, getVisaApplyCountryById)

module.exports = router
