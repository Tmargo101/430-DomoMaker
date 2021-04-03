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
    return response.render('app', { domos: docs });
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

  const domoPromise = newDomo.save();

  domoPromise.then(() => response.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return response.status(400).json({ error: 'Domo already exists.' });
    }
    return response.status(400).json({ error: 'An error occurred.' });
  });

  return domoPromise;
};

module.exports = {
  makerPage,
  make: makeDomo,
};
