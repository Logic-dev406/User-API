require('dotenv').config();

module.exports = {
    connectionString: process.env.CONNECTION_STRING,
    secret: process.env.SECRET,
};
