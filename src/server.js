import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

import db from './db';
import createEmployee from './controllers/employee_controller';

console.log(`db imported successfully! ${db}`);
// db.query('INSERT INTO Employees VALUES(UUID_TO_BIN(UUID(), true), \'asdf\', \'asdf\', CURRENT_DATE(), 2, true, \'a\');', (error, results, fields) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   console.log('results:');
//   console.log(results);
//   console.log('fields:');
//   console.log(fields);
// });

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

app.post('/employees', createEmployee);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 3000;
app.listen(port);

console.log(`listening on: ${port}`);
