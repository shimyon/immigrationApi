const asyncHandler = require('express-async-handler')
const LookupModal = require('../models/lookupModel')
const Lookup = LookupModal.LookupModal;

const addLookup = asyncHandler(async (req, res) => {
    try {
        // const imageName = req.file?.filename;
        var existLookupGroup = await LookupModal.findOne({ lookupGroupName: req.body.lookupGroupName, name: req.body.name });
        if (existLookupGroup) {
            return res.status(400).json({
                success: false,
                msg: 'Lookup Group Namealready exist'
            });
        }
        const savedLookup = await LookupModal.create({
            lookupGroupName: req.body.lookupGroupName,
            name: req.body.name,
        });
        if (savedLookup) {
            res.status(201).json({
                success: true,
                message: "Data added successfully."
            }).end()
        }
        else {
            res.status(400)
            throw new Error("Invalid data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
});

const getAllLookupData = asyncHandler(async (req, res) => {
    try {
        const Lookup = await LookupModal.find({}, { _id: 1, lookupGroupName: 1, name: 1 }).sort({ lookupGroupName: 1 });
        res.status(200).json(Lookup).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting USER. " + err.message,
            data: null,
        });
    }
})

const editLookup = asyncHandler(async (req, res) => {
    try {
        let lookupGroupName = req.body.lookupGroupName;
        let name = req.body.name;

        if (!lookupGroupName || !name) {
            res.status(400)
            throw new Error('LookupGroupName or Name not found');
        }

        //create status
        const lookupName = await LookupModal.findOne({ _id: req.body.id });

        if (!lookupName) {
            res.status(400)
            throw new Error("Value not found!")
        }

        let updatecount = await LookupModal.findByIdAndUpdate(req.body.id, {
            lookupGroupName: lookupGroupName,
            name: name
        });
        res.status(200).json({
            success: true,
            msg: "Lookup Data updated successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating LookupData. " + err.message,
            data: null,
        });
    }
})

const getLookupById = asyncHandler(async (req, res) => {
    try {
        const Lookup = await LookupModal.findOne({ _id: req.params.id });

        res.status(200).json(Lookup).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting LookupData. " + err.message,
            data: null,
        });

    }
})

const getLookupByGroup = asyncHandler(async (req, res) => {
    try {
        const Lookup = await LookupModal.aggregate([
            {
                $group: {
                    _id: "$lookupGroupName",
                    obj: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $replaceRoot:
                {
                    newRoot: {
                        $let: {
                            vars: {
                                obj: [
                                    {
                                        k: {
                                            $substr: ["$_id", 0, -1],
                                        },
                                        v: "$obj",
                                    },
                                ],
                            },
                            in: {
                                $arrayToObject: "$$obj",
                            },
                        },
                    },
                },
            }
        ]);
        let result = {};
        Lookup.forEach((val, i) => {
            let key = Object.keys(val)[0];
            result[key] = val[key];
        });
        res.status(200).json(result).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting LookupData. " + err.message,
            data: null,
        });

    }
})
module.exports = { addLookup, getAllLookupData, editLookup, getLookupById, getLookupByGroup }