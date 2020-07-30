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

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      return bcrypt.compare(req.body.password, data[0].hash);
    })
    .then(isValid => {
      if (isValid) {
        return db.select('*').from('users').where('email', '=', req.body.email);
      } else {
        throw new Error();
      }
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to get user'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      console.log(hash);
      return db.transaction(trx => {
        return trx('login')
          .insert({ hash, email })
          .returning('email')
          .then(loginEmail => {
            return trx('users')
              .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
              })
              .returning('*');
          });
      });
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));;
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => res.status(400).json('error getting user'));
});

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