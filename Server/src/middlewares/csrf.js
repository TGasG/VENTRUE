const csrf = require('csurf');

module.exports = (app) => {
    // CSURF Middleware
    app.use(csrf({ cookie: true }));

    // error handler
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);

        // handle CSRF token errors here
        return res.status(403).json({ message: 'CSRF Token Invalid!' });
    });
};
