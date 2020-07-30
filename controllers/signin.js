const handleSignin = (db, bcrypt) => (req, res) => {
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
};

module.exports = {
  handleSignin: handleSignin
};