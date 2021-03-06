const models = require('../models');

const { Account } = models;

const loginPage = (request, response) => {
  response.render('login', { csrfToken: request.csrfToken() });
};

const logout = (request, response) => {
  request.session.destroy();
  response.redirect('/');
};

const login = (request, response) => {
  const username = `${request.body.username}`;
  const password = `${request.body.pass}`;

  if (!username || !password) {
    return response.status(400).json({ error: 'All fields are requred' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return response.status(401).json({ error: 'Wrong username or password' });
    }
    request.session.account = Account.AccountModel.toAPI(account);
    return response.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  request.body.username = `${request.body.username}`;
  request.body.pass = `${request.body.pass}`;
  request.body.pass2 = `${request.body.pass2}`;

  if (!request.body.username || !request.body.pass || !request.body.pass2) {
    return response.status(400).json({ error: 'All fields are required' });
  }

  if (request.body.pass !== request.body.pass2) {
    return response.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(request.body.pass, (salt, hash) => {
    const accountData = {
      username: request.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    newAccount.save().then(() => {
      request.session.account = Account.AccountModel.toAPI(newAccount);
      return response.json({ redirect: '/maker' });
    }).catch((err) => {
      // console.log(err);
      if (err.code === 11000) {
        return response.status(400).json({ error: 'Username already in use' });
      }
      return response.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const csrfJSON = {
    csrfToken: request.csrfToken(),
  };
  response.json(csrfJSON);
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
};
