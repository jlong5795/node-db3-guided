const express = require('express');

const db = require('../data/db-config.js');
const Users = require('./user-model.js');

const router = express.Router();

router.get('/', (req, res) => {
  db('users')
  .then(users => {
    res.json(users);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to get users' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db('users').where({ id })
  .then(users => {
    const user = users[0];

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Could not find user with given id.' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get user' });
  });
});

router.post('/', (req, res) => {
  const userData = req.body;

  addUser(userData)
  .then(ids => {
    res.status(201).json({ created: ids[0] });
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to create new user' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Users.updateUser(id, changes)
  .then(count => {
    if (count) {
      res.json({ update: count });
    } else {
      res.status(404).json({ message: 'Could not find user with given id' });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to update user' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db('users').where({ id }).del()
  .then(count => {
    if (count) {
      res.json({ removed: count });
    } else {
      res.status(404).json({ message: 'Could not find user with given id' });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete user' });
  });
});

// list all posts for a user
router.get('/:id/posts', (req, res) => {
  /**
    select p.contents, u.username as saidBy
    from posts as p
    join users as u on p.contents = u.id
    
  */
  db('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .select('p.contents', 'u.username as saidBy')
    .where({user_id: req.params.id})
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error:'Server let you down.'})
    });
});

module.exports = router;



// separation of concerns principle
// connected to the 'single responsibility principle
// a unit should only have one reason to change