import { Response, Request } from 'express';
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const workMonthRouter = require('./routes/Month.route');

const app = express();
const port = process.env.PORT || 4444;

app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', workMonthRouter);

app.use(express.static('../../client/build'));
app.get('/', (req: Request, res: Response) => res.sendFile(path.join(__dirname, '../../client/build/index.html')));

app.listen(port, () => console.log(`The server is listening on port: ${port}`));
