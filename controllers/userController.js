const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const { json } = require('express')
const { resolveHostname } = require('nodemailer/lib/shared')
const tenantModel = require('../models/tenantModel')

//@desc Register New User
//@route POST api/user
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, TenantId, role, phoneNumber, is_active, location } = req.body

    if (!name || !email || !password || !role) {
        res.status(400)
        throw new Error('Name, Email, Password and Role  fields are required!')
    }

    //check if user exist
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User Already Exists!')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name,
        email,
        role,
        location,
        TenantId,
        phoneNumber,
        password: hashedPassword,
        is_active: is_active
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            TenantId: user.TenantId,
            location: user.location,
            role: user.role,
            phoneNumber: phoneNumber,
            is_active: is_active,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, id, phoneNumber, email } = req.body

    if (!name) {
        res.status(400)
        throw new Error('Name fields are required!')
    }

    if (!id) {
        res.status(400)
        throw new Error('User id not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await User.findByIdAndUpdate(id, {
        name: name,
        email: email,
        phoneNumber: phoneNumber
    });
    user = await User.findOne({ _id: id });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: phoneNumber
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})


const updateUser = asyncHandler(async (req, res) => {
    const { name, id, role, phoneNumber, email, is_active, location } = req.body

    if (!name || !role) {
        res.status(400)
        throw new Error('Name and Role  fields are required!')
    }
    if (!id) {
        res.status(400)
        throw new Error('User id not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await User.findByIdAndUpdate(id, {
        name: name,
        role: role,
        email: email,
        phoneNumber: phoneNumber,
        location: location,
        is_active: is_active
    });
    user = await User.findOne({ _id: id });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location,
            phoneNumber: phoneNumber,
            is_active: is_active,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const { id, currentPassword, newPassword } = req.body

    if (!id || !currentPassword || !newPassword) {
        res.status(400)
        throw new Error('id, current password and new password field not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await User.findOne({ _id: id });
    if (user) {
        if ((await bcrypt.compare(currentPassword, user.password))) {
            //Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await User.findByIdAndUpdate(id, {
                password: hashedPassword
            });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            })
        }
        else {
            res.status(400)
            throw new Error("Wrong Current Password!")
        }
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { id, newPassword } = req.body

    if (!id || !newPassword) {
        res.status(400)
        throw new Error('id or new password field not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await User.findOne({ _id: id });
    if (user) {
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(id, {
            password: hashedPassword
        });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})


//@desc Authenticate a User
//@route POST api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, TenantId, location } = req.body

    const tenant = await tenantModel.findById(TenantId);
    if (tenant) {
        if (!tenant.is_active) {
            res.status(200)
            throw new Error("Company is not active, please contact the administrator.");
        }
    } else {
        res.status(200)
        throw new Error("Invalid company name");

    }

    const user = await User.findOne({ TenantId: TenantId, email: email, location: location, is_active: true })
    if (!user) {
        res.status(200)
        throw new Error("User Not Found!")
    }

    if ((await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            TenantId: TenantId,
            location: location,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(401)
        throw new Error("Invalid credentials!")
    }
})


//@desc Get User Data
//@route POST api/users/me
//@access Private
const getUserById = asyncHandler(async (req, res) => {
    const { _id, name, email, role, location, is_active, phoneNumber } = await User.findById(req.params.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        role,
        location,
        is_active,
        phoneNumber
    })
})

//@desc Get User Data
//@route POST api/users/me
//@access Private
const getManager = asyncHandler(async (req, res) => {
    try {
        let filter = {};
        if (req.user.role == 'Admin') {
            filter = { role: new RegExp("manager", 'i') }
        }
        else if (req.user.role == 'Manager') {
            filter = { role: new RegExp("manager", 'i'), TenantId: req.body.TenantId, location: req.body.location, ...filter };
        }
        else if (req.user.role == 'Receptionist') {
            filter = { role: new RegExp("manager", 'i'), TenantId: req.body.TenantId, location: req.body.location, ...filter };
        }
        const user = await User.find(filter, { _id: 1, email: 1, name: 1, role: 1, phoneNumber: 1, TenantId: 1, location: 1 });
        res.status(200).json(user).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting manager. " + err.message,
            data: null,
        });
    }
})

//@desc Get User Data
//@route POST api/users/me
//@access Private
const getAllUser = asyncHandler(async (req, res) => {
    try {
        var fillter = {};
        if (req.body.role) {
            fillter.role = req.body.role;
        }
        if (req.body.location) {
            fillter.location = req.body.location;
        }
        if (req.body.TenantId) {
            fillter.TenantId = req.body.TenantId;
        }
        const user = await User.find(fillter, { _id: 1, email: 1, name: 1, role: 1, is_active: 1, phoneNumber: 1, location: 1, TenantId: 1 }).sort({ 'is_active': -1, name: 1 });
        res.status(200).json(user).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting USER. " + err.message,
            data: null,
        });
    }
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUserProfile,
    updateUser,
    changePassword,
    forgotPassword,
    getManager,
    getAllUser
}