const UserModel = require('../models/user.model.js')
const express = require('express')
const router = express.Router()


// POST to /api/users to create a new user
router.post('/api/users', (req, res) => {
  if (!req.body.username) {
    return res.status(400).send('Request body is missing')
  }
  const user = new UserModel({ username: req.body.username })
  user.save().then(doc => {
    if (!doc || doc.length === 0) {
      return res.status(500).send(doc)
    }

    res.status(200).json({
      _id: doc._id,
      username: doc.username,
      createdAt: doc.createdAt.toDateString(),
      updatedAt: doc.updatedAt.toDateString()
    })
  })
    .catch(err => {
      res.status(500).json(err)
    })
})

// GET from /api/users an array of all users
router.get('/api/users', (req, res) => {
  UserModel.find({}, (err, docs) => {
    if (!docs || docs.length === 0) {
      return res.status(500).send(docs)
    }

    let allUsers = []
    docs.forEach(doc => allUsers.push({
      _id: doc._id, 
      username: doc.username, 
      createdAt: doc.createdAt.toDateString(),
      updatedAt: doc.updatedAt.toDateString()
    }))

    res.status(200).send(allUsers)
  })
    .catch(err => {
      res.status(500).json(err)
    })
})


module.exports = router