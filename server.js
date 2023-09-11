const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.port || 5000
const mongoose = require('mongoose');
var cors = require('cors');
const path = require('path')
const loadCronJob = require('./cron-job')

let databasestatus = "In-Progress";

const app = express()

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.options("*", cors());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => {
            databasestatus = "DB connected";

            //Load Cron Jobs
            loadCronJob();
        }).catch((err) => {
            databasestatus = err;
        });
    } catch (error) {
        databasestatus = error;
    }
}
connectDB();

app.get("/api", (req, res) => {
    res.json({
        version: "v1.4-7.13.23.",
        dbstatus: databasestatus,
        rand: new Date()
    });
});
app.use('/static', express.static("public/uploads"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/lookup', require('./routes/lookupRoutes'));
app.use('/api/followUp', require('./routes/followUpRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));
app.use('/api/notification', require('./routes/notificationRoute'));
app.use('/api/location', require('./routes/locationRoute'));
app.use('/api/tenant', require('./routes/tenantRoutes'));
app.use('/api/VisaApplyCountry', require('./routes/VisaApplyCountryRoutes'));

app.use(errorHandler)
app.listen(port, () => console.log(`Listening at port ${port}`))
