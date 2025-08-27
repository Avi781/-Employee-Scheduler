require('dotenv').config();
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const requestResponseLogger = require("./middleware/loggerInterceptor");
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const shiftRoutes = require('./routes/shifts');
const timeoffRoutes = require('./routes/timeoff');
const scheduleRoutes = require('./routes/schedule');
const analyticsRoutes = require('./routes/analytics');
const log = require("../src/util/log");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(requestResponseLogger);

const swaggerDoc = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/shifts', shiftRoutes);
app.use('/api/v1/timeoff', timeoffRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'Employee Scheduler API' }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    log.info('Mongo connected');
    app.listen(PORT, () => log.info(`Server running on ${PORT}`));
  })
  .catch(err => {
    log.error('Mongo connection error', err);
    process.exit(1);
  });
