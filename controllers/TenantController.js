const asyncHandler = require('express-async-handler')
const { JsonResult } = require("../utility/jsonResult");
const tenantModel = require("../models/tenantModel");
const locationModel = require("../models/locationModel");
const useraddModel = require("../models/userModel");
const bcrypt = require('bcryptjs')

const tenantadd = asyncHandler(async (req, res) => {
    const tenantExists = await tenantModel.findOne({ name: req.body.name })
    if (tenantExists) {
        res.status(200).json({
            success: false,
            msg: "Tenant Already Exists!",
            data: "",
        }).end();
    }
    
    const tenant = await tenantModel.create({
        name: req.body.name,
        logo: req.file?.filename,
    })
    
    const location = await locationModel.create({
        name: 'Default',
        TenantId: tenant.id,
        is_active: true,
    })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('12345678', salt)


    const useradd = await useraddModel.create({
        TenantId: tenant.id,
        location:  location.id,
        name:  req.body.name,
        email: req.body.email,
        phoneNumber: '11111111',
        password: hashedPassword,
        role: 'Admin',
        is_active: true, 
    })
          

    if (tenant) {
        res.status(201).json({
            success: true,
            _id: tenant.id,
            name: tenant.name,
        })
    }
    else {
        res.status(400).json({
            success: false,
            msg: "Invalid data!",
            data: "",
        }).end();
    }
})
const tenantcheck = asyncHandler(async (req, res) => {
    const { name } = req.body
    const tenantExists = await tenantModel.findOne({ name })

    if (tenantExists) {
        res.status(200).json({
            success: true,
            _id: tenantExists.id,
            name: tenantExists.name,
            logo: tenantExists.logo,
        }).end();
    }
    else 
        res.status(400).json({
            success: false,
            msg: "Invalid Tenant Name!",
            data: "",
        }).end();
    }
)
const tenantById = asyncHandler(async (req, res) => {
    try {
        const returnval = await tenantModel.findById(req.params.id).lean();

        res.status(200).json(returnval).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
});
module.exports = { tenantadd, tenantcheck, tenantById };