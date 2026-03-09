let express = require('express');
let path = require('path');

let logger = require('morgan');
let cors = require('cors');

let usersRouter = require('./app/routes/users.js');
let notesRouter = require('./app/routes/notes.js');

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/notes', notesRouter);

module.exports = app;
