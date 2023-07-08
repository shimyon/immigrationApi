const asyncHandler = require('express-async-handler')
const { JsonResult } = require("../utility/jsonResult");
const locationModel = require("../models/locationModel");
const LocationById = asyncHandler(async (req, res) => {
    try {
        const returnval = await locationModel.findById(req.params.id).populate("TenantId", '_id name logo').lean();

        res.status(200).json(returnval).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
});

const LocationEdit = asyncHandler(async (req, res) => {
    const locationExists = await locationModel.findOne({ _id: req.body.id });
    if (!locationExists) {
        res.status(400).json({
            success: false,
            msg: 'Location Not Found',
            data: "",
        })
        throw new Error('Location Not Found')
    }

    let location = await locationModel.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        is_active: req.body.is_active
    });
    location = await locationModel.findOne({ _id: req.body.id });
    if (location) {
        res.status(201).json({
            _id: location.id,
            name: location.name,
            is_active: location.is_active,
            success: true,
        })
    }
    else {
        res.status(400).json({
            success: false,
            msg: "Invalid location data!",
            data: "",
        })
    }
});

const LocationsAll = asyncHandler(async (req, res) => {
    try {
        const { TenantId } = req.body;
        const Locations = await locationModel.find({ TenantId, Isread: false }).limit(3).sort({ createdAt: -1 })
        .populate("TenantId", '_id name logo');
        res.status(200).json({
            success: true,
            msg: "",
            data: Locations,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
});

const LocationAdd = asyncHandler(async (req, res) => {
    const locationExists = await locationModel.findOne({ name: req.body.name, TenantId: req.body.TenantId })
    if (locationExists) {
        res.status(200).json({
            success: false,
            msg: "Location Already Exists!",
            data: "",
        }).end();
    }
    const location = await locationModel.create({
        name: req.body.name,
        TenantId: req.body.TenantId,
        is_active: req.body.is_active
    })
    if (location) {
        res.status(201).json({
            success: true,
            _id: location.id,
            name: location.name,
        })
    }
    else {
        res.status(400).json({
            success: false,
            msg: "Invalid data!",
            data:"",
        }).end();
    }
});

module.exports = { LocationAdd, LocationEdit, LocationById, LocationsAll };