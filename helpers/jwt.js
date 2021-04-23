const expressjwt = require('express-jwt');
const { secret } = require('../config/config');

function authJwt() {
    return expressjwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: ['/api/login', '/api/signup'],
    });
}

// async function isRevoked(req, payload, done) {
//     if (!payload.isAdmin) {
//         done(null, true);
//     }

//     done();
// }

module.exports = authJwt;
