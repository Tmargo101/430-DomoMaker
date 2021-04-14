const models = require('../models');

const { Domo } = models;

const makerPage = (request, response) => {
  // Prevents error if the session is not available (if the server has been restarted)

  Domo.DomoModel.findByOwner(request.session.account._id, (err, docs) => {
    if (!request.session.account) {
      return response.redirect('/');
    }
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occurred.' });
    }
    return response.render('app', { csrfToken: request.csrfToken(), domos: docs });
  });
};

const makeDomo = (request, response) => {
  if (!request.body.name || !request.body.age) {
    return response.status(400).json({ error: 'Name and Age are both required.' });
  }

  if (request.body.age < 0) {
    return response.status(400).json({ error: 'Age must be greater than 0.' });
  }

  if (!Number.isInteger(parseInt(request.body.age, 10))) {
    return response.status(400).json({ error: 'Age must be a number.' });
  }

  const domoData = {
    name: request.body.name,
    age: request.body.age,
    owner: request.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  newDomo.save().then(() => {
    response.json({ redirect: '/maker' });
  }).catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return response.status(400).json({ error: 'Domo already exists.' });
    }
    return response.status(400).json({ error: 'An error occurred.' });
  });
  return newDomo;
};

const getDomos = (request, response) => {
  console.log('GetDomo');
  return Domo.DomoModel.findByOwner(request.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occurred' });
    }
    return response.json({ domos: docs });
  });
};

module.exports = {
  makerPage,
  make: makeDomo,
  getDomos,
};
