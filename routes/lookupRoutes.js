const express = require('express')
const router = express.Router();

const { addLookup ,getAllLookupData,editLookup,getLookupById} = require('../controllers/lookupController')

const { protect } = require('../middleware/authMiddleware')
router.post('/save', addLookup);
router.get('/getAllLookup', protect, getAllLookupData)
router.post('/editLookup', protect, editLookup)
router.get('/getLookupById/:id', protect, getLookupById)
module.exports = router