const express = require('express')
const router = express.Router()
const { uploadFile } = require('../middleware/uploadFileMiddleware');
const {
    tenantadd, tenantcheck,tenantById
} = require('../controllers/TenantController')
router.post('/add',uploadFile.single("file"), tenantadd)
router.get('/getbyid/:id', tenantById)
router.post('/check', tenantcheck)

module.exports = router
