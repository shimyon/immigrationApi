const CronLoad = require('./Cron');

const loadCronJob = () => {
    try {
        CronLoad();

    } catch (error) {
        console.log("Cron job error: " + error);
        console.error(error);
    }
}

module.exports = loadCronJob;