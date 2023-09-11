const followUpModel = require('../models/followUpModel')
const followUp = followUpModel.followUpModel;
const moment = require('moment')

const getAction = async () => {
    const next = await followUpModel.find({
        date:moment(new Date()).format("YYYY-MM-DD")
    }).populate("userId").populate("studentId").lean();

    return next;
}

module.exports = {
    getAction
}