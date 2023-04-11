const asyncHandler = require('express-async-handler')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;
const uploadFile = require("../middleware/uploadFileMiddleware");
const { EducationModal, ExpeirenceModal, LanguageModal } = require('../models/studentModel');

const addStudent = asyncHandler(async (req, res) => {
    try {
        const imageName = req.file?.filename;
        var existStudent = await Student.findOne({ mobileNumber: req.body.mobileNumber });
        if (existStudent) {
            return res.status(400).json({
                success: false,
                msg: 'Mobile number already exist'
            });
        }
        let education = [];
        let workExperience = [];
        let language = [];

        if (req.body.education) {
            if (Array.isArray(req.body.education)) {
                for (const key in req.body.education) {
                    const element = req.body.education[key];
                    let ejson = JSON.parse(element);
                    let addnew = await EducationModal.create(ejson);
                    education.push(addnew._id)
                }
            } else {
                let ejson = JSON.parse(req.body.education);
                let educationAdd = await EducationModal.create(ejson);
                education.push(educationAdd._id);
            }
        }

        if (req.body.workExperience) {
            if (Array.isArray(req.body.workExperience)) {
                for (const key in req.body.workExperience) {
                    const element = req.body.workExperience[key];
                    let ejson = JSON.parse(element);
                    let addnew = await ExpeirenceModal.create(ejson);
                    workExperience.push(addnew._id)
                }
            } else {
                let ejson = JSON.parse(req.body.workExperience);
                let addnew = await ExpeirenceModal.create(ejson);
                workExperience.push(addnew._id)
            }
        }

        if (req.body.language) {
            if (Array.isArray(req.body.language)) {
                for (const key in req.body.language) {
                    const element = req.body.language[key];
                    let ejson = JSON.parse(element);
                    let addnew = await LanguageModal.create(ejson);
                    language.push(addnew._id)
                }
            } else {
                let ejson = JSON.parse(req.body.language);
                let addnew = await LanguageModal.create(ejson);
                language.push(addnew._id)
            }
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
            photo: imageName,
            spouseName: req.body.spouseName,
            spouseRelation: req.body.spouseRelation,
            spouseCountry: req.body.spouseCountry,
            spouseState: req.body.spouseState,
            spouseCity: req.body.spouseCity,
            spouseCountryStatus: req.body.spouseCountryStatus,
            education: education,
            workExperience: workExperience,
            language: language,

        });
        if (savedStudent) {
            res.status(201).json({
                success: true,
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

module.exports = { addStudent, getStudentById, getStudents, assignedManager }