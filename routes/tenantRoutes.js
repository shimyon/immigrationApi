const express = require('express')
const router = express.Router()
const { uploadFile } = require('../middleware/uploadFileMiddleware');
const {
    tenantadd, tenantcheck
} = require('../controllers/TenantController')
router.post('/add',uploadFile.single("file"), tenantadd)
router.post('/check', tenantcheck)

module.exports = router
