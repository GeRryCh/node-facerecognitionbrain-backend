const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '1233',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  console.log(req);

  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    // bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
    //   // result == true
    // });
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    console.log(hash);
  });

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(user);
    }
  });
});

app.put('/image', (req, res) => {
  database.users.forEach(user => {
    if (user.id === id) {
      user.entries++;
      return res.json(user.entries);
    }
  });
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});