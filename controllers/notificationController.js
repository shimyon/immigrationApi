const asyncHandler = require('express-async-handler')
const notificationModel = require('../models/notificationModel')
const addLookup = asyncHandler(async (req, res) => {
    try {
        // const imageName = req.file?.filename;
        // var existLookupGroup = await LookupModal.findOne({ lookupGroupName: req.body.lookupGroupName, name: req.body.name });
        // if (existLookupGroup) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: 'Lookup Group Namealready exist'
        //     });
        // }
        const savedLookup = await notificationModel.create({
            description: req.body.description,
            date: req.body.date,
            Isread:req.body.Isread
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
module.exports = { }



