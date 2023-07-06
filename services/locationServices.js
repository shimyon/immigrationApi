const locationModel = require("../models/locationModel");
const { JsonResult } = require("../utility/jsonResult");

const LocationSerEdit = async (val) => {
    let returnval = JsonResult();
    await locationModel.findByIdAndUpdate(val.id, {
        name: val.name,
        is_active: val.is_active
    }).then(s => {
        returnval.data = s;
    })
        .catch(err => {
            returnval.success = false;
            returnval.data = err;
            returnval.msg = err.message;
        })
    return returnval;
}

module.exports = { LocationSerAdd, LocationSerEdit, };