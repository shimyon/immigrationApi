const asyncHandler = require('express-async-handler')
const { JsonResult } = require("../utility/jsonResult");
const tenantModel = require("../models/tenantModel");

const tenantadd = asyncHandler(async (req, res) => {
    const tenantExists = await tenantModel.findOne({name:req.body.name})
    if (tenantExists) {
        res.status(200).json({
            success: false,
            msg: "Tenant Already Exists!",
            data:"",
        }).end();
    }
    const tenant = await tenantModel.create({
        name:req.body.name,
        logo:req.file?.filename,
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
            data:"",
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
    else {
        res.status(400).json({
            success: false,
            msg: "Invalid Tenant Name!",
            data:"",
        }).end();
    }
})
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
module.exports = { tenantadd ,tenantcheck,tenantById};