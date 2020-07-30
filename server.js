const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'german',
    password: '',
    database: 'smart-brain'
  }
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt); });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt); });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db); });

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});