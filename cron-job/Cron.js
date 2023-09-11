var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getAction } = require('./cronService');

const CronLoad = () => {
    cron.schedule('0 9 * * *', async () => {
        let nexts = await getAction();
        nexts.forEach(async (element) =>  {
            sendMail(element.userId.email,`Today Follow up`, `${element.studentId.name} Apply for ${element.studentId.visaType} - ${element.studentId.visaApplyCountry} Remark:${element.remark}`);
            console.log(`Followup element ${element._id}`);
        });
    });
}

module.exports = CronLoad;