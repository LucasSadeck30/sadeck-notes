let express = require('express');
let path = require('path');
let cors = require('cors');
let logger = require('morgan');

let usersRouter = require('./app/routes/users.js');
let notesRouter = require('./app/routes/notes.js');

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// DEPOIS
app.use(cors({
  origin: [
      'http://localhost:3000',
    'http://localhost:3001', // desenvolvimento
    'https://sadeck-notes.vercel.app', // produção (substitua pela sua URL)
    'https://sadeck-notes-*.vercel.app' // previews
  ],
  credentials: true
}))


app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/notes', notesRouter);

module.exports = app;
