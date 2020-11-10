const express = require('express');
const app = express();
const compression = require('compression');
const port = process.env.PORT || 4444;
const data = require('./models/data');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const workMonthRouter = require('./routes/Month.route');

app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/api', workMonthRouter);

app.use(express.static('../client/build/static'));
app.use(express.static('../client/build'));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build', 'index.html')));

app.listen(port, () => console.log(`Server is listening at port: ${port}`));

