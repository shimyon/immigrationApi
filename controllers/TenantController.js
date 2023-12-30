const asyncHandler = require('express-async-handler')
const { JsonResult } = require("../utility/jsonResult");
const tenantModel = require("../models/tenantModel");
const locationModel = require("../models/locationModel");
const useraddModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const { sendMail } = require('../middleware/sendMail');

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
        location: location.id,
        name: req.body.name,
        email: req.body.email,
        phoneNumber: '1111111111',
        password: hashedPassword,
        role: 'Admin',
        is_active: true,
    })
    let html = `
    Dear Customer,

Welcome to Emoiss! We are thrilled to have you on board. As a valued member of our community, you now have access to a world of Immigration Portal at your fingertips.

Your Account Information:

User ID: ${req.body.email}
Password: 12345678
For security reasons, we recommend changing your password as soon as you log in. 

If you have any questions or encounter any issues during the login process, our support team is here to help. You can reach them at admin@emoiss.in or by replying to this email.

Thank you for choosing Emoiss. We look forward to serving you and ensuring your experience with us is nothing short of exceptional.

Best regards,
Team Emoiss
    `

    if (useradd) {
        sendMail(req.body.email, 'Welcome to Emoiss! Your Account Information Inside.', html)
    }

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