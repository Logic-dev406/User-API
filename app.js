const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('./db/mongoose');

const userRouter = require('./routers/user');

//middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/api', userRouter);

//port
const port = process.env.PORT || 3030;

app.get('/', (req, res) => {
    res.send('WELCOM ');
});

app.listen(port, () => {
    console.log(`Server is up and running on localhost ${port}.`);
});
