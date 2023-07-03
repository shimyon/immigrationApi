const locationModel = require("../models/locationModel");
const { JsonResult } = require("../utility/jsonResult");

const LocationSerAdd = async (TenantId, val) => {
    return new Promise(async (resolve, reject) => {
        let returnval = JsonResult();
        await locationModel.create({
            TenantId: TenantId,
            name: val.name,
            is_active: val.is_active
        })
            .then(s => {
                returnval.data = s;
                resolve(returnval);
            })
            .catch(err => {
                returnval.success = false;
                returnval.data = err;
                returnval.msg = err.message;
                reject(returnval);
            })
        
    })

}

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


const LocationSerGetById = async (val) => {
    let returnval = JsonResult();
    await locationModel.findById(val.id).then(s => {
        returnval.data = s;
    })
        .catch(err => {
            returnval.success = false;
            returnval.data = err;
            returnval.msg = err.message;
        })
    return returnval;
}

module.exports = { LocationSerAdd, LocationSerEdit, LocationSerGetById, };