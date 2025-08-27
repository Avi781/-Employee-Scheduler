const log = require("../util/log");

function requestResponseLogger(req, res, next) {
    const start = Date.now();
    log.info(`Incoming Request: ${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body)} - Query: ${JSON.stringify(req.query)}`);
    const oldSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - start;
        log.info(`Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        res.send = oldSend; 
        return res.send(data);
    };

    next();
}

module.exports = requestResponseLogger;
