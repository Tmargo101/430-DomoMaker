const models = require('../models');

const Account = models.Account;

const loginPage = (request, response) => {
  response.render('login');
};

const signupPage = (request, response) => {
  response.render('signup');
};

const logout = (request, response) => {
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
    return response.json({ redirect: '/maker' });
  })
};

const signup = (request, response) => {
  request.body.username = `${request.body.username}`;
  request.body.pass = `${request.body.pass}`;
  request.body.pass2 = `${request.body.pass2}`;
  
  if (!request.body.username || !request.body.pass || !request.body.pass2) {
    return response.status(400).json({ error: 'All fields are required'});
  }
  
  if (request.body.pass !== request.body.pass2) {
    return response.status(400).json({ error: 'Passwords do not match'});
  }
  
  return Account.AccountModel.generateHash(request.body.pass, (salt, hash) => {
    const accountData = {
      username: request.body.username,
      salt,
      password: hash,
    };
    
    const newAccount = new Account.AccountModel(accountData);
    
    const savePromise = newAccount.save();
    
    savePromise.then(() => response.json({ redirect: '/maker' }));
    
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return response.status(400).json({ error: 'Username already in use' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

module.exports = {
  loginPage: loginPage,
  login: login,
  logout: logout,
  signupPage: signupPage,
  signup: signup,
}
