const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.port || 5000
var cors = require('cors');
var cron = require('node-cron');

const path = require('path')
const swaggerUi = require('swagger-ui-express')
swaggerDocument = require('./swagger.json');
connectDB()

const app = express()

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options("*", cors());

app.use('/static', express.static("public/uploads"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/lookup', require('./routes/lookupRoutes'));
app.use('/api/followUp', require('./routes/followUpRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));
app.use('/api/notification', require('./routes/notificationRoute'));
app.use('/api/location', require('./routes/locationRoute'));
app.use('/api/tenant', require('./routes/tenantRoutes'));

app.use(errorHandler)


cron.schedule('1 0-23 * * *', () => {
    console.log('running a task every hours - ' + new Date());
});

app.listen(port, () => console.log(`Listening at port ${port}`))
