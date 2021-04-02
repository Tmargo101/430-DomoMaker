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
  
};

const signup = (request, response) => {
  
};

module.exports = {
  loginPage: loginPage,
  login: login,
  logout: logout,
  signupPage: signupPage,
  signup: signup,
}
