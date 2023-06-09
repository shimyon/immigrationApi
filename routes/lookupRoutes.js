const express = require('express')
const router = express.Router();

const { addLookup ,getAllLookupData,editLookup,getLookupById, getLookupByGroup} = require('../controllers/lookupController')

const { protect } = require('../middleware/authMiddleware')
router.post('/save', addLookup);
router.get('/getAllLookup', getAllLookupData)
router.post('/editLookup', protect, editLookup)
router.get('/getLookupById/:id', getLookupById)
router.get('/getLookupByGroup', getLookupByGroup)
module.exports = router