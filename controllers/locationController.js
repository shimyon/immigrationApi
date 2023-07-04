const { LocationSerAdd, LocationSerEdit } = require('../services/locationServices');

const asyncHandler = require('express-async-handler')
const { JsonResult } = require("../utility/jsonResult");
const locationModel = require("../models/locationModel");
const LocationById = asyncHandler(async (req, res) => {
    let returnval = JsonResult();
    try {
        let TenantId = req.user.TenantId;
        returnval = LocationById(req.body.id);
        res.status(201).json(returnval).end();
    } catch (err) {
        returnval.data = err;
        returnval.msg = err.message;
        returnval.success = false;
        res.status(400).json(returnval);
    }
});

const LocationEdit = asyncHandler(async (req, res) => {
    let returnval = JsonResult();
    try {
        let TenantId = req.user.TenantId;
        returnval = LocationSerEdit(TenantId, {
            name: req.body.name,
            is_active: req.body.is_active
        })
        res.status(201).json(returnval).end();
    } catch (err) {
        returnval.data = err;
        returnval.msg = err.message;
        returnval.success = false;
        res.status(400).json(returnval);
    }
});

const LocationsAll = asyncHandler(async (req, res) => {
    try {
        const { TenantId } = req.body;
        const Locations = await locationModel.find({ TenantId, Isread: false }).limit(3).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            msg: "",
            data:Locations,
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
    let returnval = JsonResult();
    try {
        let TenantId = req.user.TenantId;
        await LocationSerAdd(TenantId, {
            name: req.body.name,
            is_active: req.body.is_active
        })
            .then(res => {
                returnval = res
            })
            .catch(err => {
                returnval = err
            });
        res.status(201).json(returnval).end();
    } catch (err) {
        returnval.data = err;
        returnval.msg = err.message;
        returnval.success = false;
        res.status(400).json(returnval);
    }
});

module.exports = { LocationAdd, LocationEdit, LocationById, LocationsAll };