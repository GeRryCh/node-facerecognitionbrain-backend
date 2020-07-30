const handleRegister = (req, res, db, bcrypt) => {
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
    .catch(err => res.status(400).json('unable to register'));
};

module.exports = {
  handleRegister: handleRegister
};