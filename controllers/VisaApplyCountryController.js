const asyncHandler = require('express-async-handler')
const VisaApplyCountry = require('../models/VisaApplyCountryModel')

const createVisaApplyCountry = asyncHandler(async (req, res) => {
    try {

        let name = req.body.name;
        let TenantId = req.body.TenantId;

        if (!name || !TenantId) {
            res.status(400)
            throw new Error('Name or TenantId not found');
        }
        const VisaCountry = await VisaApplyCountry.create({
            name,
            TenantId
        })
        if (VisaCountry) {
            res.status(201).json({
                name: name,
                TenantId: TenantId
            })
        }
        else {
            res.status(400)
            throw new Error("Invalid VisaApplyCountry data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating VisaApplyCountry. " + err.message,
            data: null,
        });
    }
})

const editVisaApplyCountry = asyncHandler(async (req, res) => {
    try {
        let name = req.body.name;

        if (!name) {
            res.status(400)
            throw new Error('Name or TenantId not found');
        }

        const VisaCountry = await VisaApplyCountry.findOne({ _id: req.body.id });

        if (!VisaCountry) {
            res.status(400)
            throw new Error("VisaApplyCountry not found!")
        }

        let updatecount = await VisaApplyCountry.findByIdAndUpdate(req.body.id, {
            name: name,
        });
        res.status(200).json({
            success: true,
            msg: "VisaApplyCountry updated successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating VisaApplyCountry. " + err.message,
            data: null,
        });
    }
})

const getAllVisaApplyCountry = asyncHandler(async (req, res) => {
    try {
        const VisaCountry = await VisaApplyCountry.find({ TenantId: req.params.id });

        res.status(200).json(VisaCountry).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting VisaApplyCountry. " + err.message,
            data: null,
        });

    }
})
const getVisaApplyCountryById = asyncHandler(async (req, res) => {
    try {
        const VisaCountry = await VisaApplyCountry.findOne({ _id: req.params.id });

        res.status(200).json(VisaCountry).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting VisaApplyCountry. " + err.message,
            data: null,
        });
    }
})

const deleteVisaApplyCountryById = asyncHandler(async (req, res) => {
    try {
        const VisaCountry = await VisaApplyCountry.findByIdAndDelete(req.params.id);

        res.status(200).json(VisaCountry).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting VisaApplyCountry. " + err.message,
            data: null,
        });
    }
})

module.exports = {
    createVisaApplyCountry, 
    editVisaApplyCountry, 
    getAllVisaApplyCountry, 
    getVisaApplyCountryById,
    deleteVisaApplyCountryById,
}
