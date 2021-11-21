const express = require('express');
// const csrf = require('./middlewares/csrf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const openapiSpecification = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middllewares
if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
    app.use(
        require('cors')({ origin: 'http://localhost:3000', credentials: true })
    );
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(openapiSpecification)
    );
}
app.set('trust proxy', 'loopback');
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());
app.use(cookieParser());
// csrf(app);

// Routes
// app.get('/api/csrf', (req, res) => res.json({ csrfToken: req.csrfToken() })); // Header 'csrf-token'
app.use('/api/user', require('./routes/user'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/category', require('./routes/category'));
app.use('/api/organization/events', require('./routes/organization/events'));
app.use('/api/student/events', require('./routes/student/events'));
app.use('/api/admin/events', require('./routes/admin/events'));
app.use('/api/admin/site', require('./routes/admin/site'));

// Start server
app.listen(port, () => console.log('Running on port ' + port));
