const asyncHandler = require('express-async-handler')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;
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

const getStudentById = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("education").populate("workExperience").populate("language").populate("assignedManager")

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
        const student = await Student.find().populate("education").populate("workExperience").populate("language").populate("assignedManager");

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
        const student = await Student.findByIdAndUpdate(req.body.studentId,{
            assignedManager: req.body.manager,
            updatedBy: req.body.userId
        });
        res.status(200).json({message:"Manager assigned successfully."}).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating manager. " + err.message,
            data: null,
        });

    }
})

module.exports = { saveStudent, getStudentById, getStudents,assignedManager }