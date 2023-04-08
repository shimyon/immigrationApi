const asyncHandler = require('express-async-handler')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;
const Status = StudentModal.StautsModal;
const uploadFile = require("../middleware/uploadFileMiddleware");

const saveStudent = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                addStudent(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})
const addStudent = asyncHandler(async (req, res, imageName) => {
    try {
        var existStudent = await Student.findOne({ mobileNumber: req.body.mobileNumber });
        if (existStudent) {
            res.status(400)
            throw new Error('Mobile number already exist')
        }
        const savedStudent = await Student.create({
            visaType: req.body.visaType,
            name: req.body.studentName,
            address: req.body.address,
            gender: req.body.gender,
            martialStatus: req.body.martialStatus,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            nationality: req.body.nationality,
            citizen: req.body.citizen,
            photo: imageName.replace(",", ""),
            spouseName: req.body.spouseName,
            spouseRelation: req.body.spouseRelation,
            spouseCountry: req.body.spouseCountry,
            spouseState: req.body.spouseState,
            spouseCity: req.body.spouseCity,
            spouseCountryStatus: req.body.spouseCountryStatus,
            education: req.body.education,
            workExperience: req.body.workExperience,
            language: req.body.language,
            status: req.body.status,
        });
        if (savedStudent) {
            res.status(201).json({
                message: "Student added successfully."
            }).end()
        }
        else {
            res.status(400)
            throw new Error("Invalid student data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
});

const editStudent = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                saveEditStudent(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})
const saveEditStudent = asyncHandler(async (req, res, imageName) => {
    try {

        if(imageName!="")
        {
            req.body.imageName=imageName;
        }
        var savedStudent = await Student.findOneAndUpdate( req.body.id,{
            visaType: req.body.visaType,
            name: req.body.studentName,
            address: req.body.address,
            gender: req.body.gender,
            martialStatus: req.body.martialStatus,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            nationality: req.body.nationality,
            citizen: req.body.citizen,
            photo: req.body.imageName.replace(",", ""),
            spouseName: req.body.spouseName,
            spouseRelation: req.body.spouseRelation,
            spouseCountry: req.body.spouseCountry,
            spouseState: req.body.spouseState,
            spouseCity: req.body.spouseCity,
            spouseCountryStatus: req.body.spouseCountryStatus,
            education: req.body.education,
            workExperience: req.body.workExperience,
            language: req.body.language,
            status: req.body.status,
        });
        if (savedStudent) {
            res.status(201).json({
                message: "Student saved successfully."
            }).end()
        }
        else {
            res.status(400)
            throw new Error("Invalid student data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
});

const getStudentById = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("education").populate("workExperience").populate("language").populate("assignedManager").populate("status")

        res.status(200).json(student).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
})

const getStudents = asyncHandler(async (req, res) => {
    try {
        const student = await Student.find().populate("education").populate("workExperience").populate("language").populate("assignedManager").populate("status");

        res.status(200).json(student).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
})

const assignedManager = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            assignedManager: req.body.manager,
            updatedBy: req.body.userId
        });
        res.status(200).json({ message: "Manager assigned successfully." }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating manager. " + err.message,
            data: null,
        });

    }
})

const createStatus = asyncHandler(async (req, res) => {
    try {

        let statusName = req.body.name;
        let step = req.body.step;

        if (!statusName || !step) {
            res.status(400)
            throw new Error('Name or step not found');
        }
        //create status
        const status = await Status.create({
            statusName,
            step
        })
        if (status) {
            res.status(201).json({
                name: statusName,
                step: step
            })
        }
        else {
            res.status(400)
            throw new Error("Invalid status data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating status. " + err.message,
            data: null,
        });
    }
})

const editStatus = asyncHandler(async (req, res) => {
    try {
        let statusName = req.body.name;
        let step = req.body.step;

        if (!statusName || !step) {
            res.status(400)
            throw new Error('Name or step not found');
        }

        //create status
        const status = await Status.findOne({_id:req.body.id});

        if (!status) {
            res.status(400)
            throw new Error("Status not found!")
        }

        await Status.findOneAndUpdate(req.body.id,{
            statusName: statusName,
            step: step
        });
        res.status(200).json({
            success: true,
            msg: "Status updated successfully",

        }).end();

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating status. " + err.message,
            data: null,
        });
    }
})

const getAllStatus = asyncHandler(async (req, res) => {
    try {
        const status = await Status.find();

        res.status(200).json(status).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

const getStatusById = asyncHandler(async (req, res) => {
    try {
        const status = await Status.findOne({ _id: req.params.id });

        res.status(200).json(status).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

const changeStatus = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(req.body.studentId, {
            status: req.body.status
        })
        return res.status(200).json({
            success: true,
            msg: "Status changed successfully. " 
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in changing status. " + err.message,
            data: null,
        });

    }
})
module.exports = { saveStudent, getStudentById, getStudents, assignedManager, createStatus, editStatus, getAllStatus, getStatusById,changeStatus,editStudent }