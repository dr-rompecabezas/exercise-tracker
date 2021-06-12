const UserModel = require('../models/user.model.js')
const express = require('express')
const { response } = require('express')
const router = express.Router()


// POST to /api/users/:_id/exercises user's exercise description, duration, and optionally date
router.post('/api/users/:_id/exercises', (req, res) => {
  if (!req.params._id || !req.body.description || !req.body.duration) {
    return res.status(400).send('Either _id parameter, body.description or body.duration is missing')
  }

  const _id = req.params._id
  const { description, duration } = req.body
  let date = req.body.date ? req.body.date : Date.now()

  UserModel.findById(_id, (err, doc) => {
    if (err) return console.log(err)

    doc.log.push({
      description: description,
      duration: duration,
      date: date
    })

    doc.save().then(doc => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc)
      }

      let len = doc.log.length
      let i = len - 1

      res.status(200).json({
        _id: doc._id,
        username: doc.username,
        date: doc.log[i].date.toDateString(),
        description: doc.log[i].description,
        duration: doc.log[i].duration,
        createdAt: doc.createdAt.toDateString(),
        updatedAt: doc.updatedAt.toDateString()
      })
    })
      .catch(err => {
        res.status(500).json(err)
      })
  })
})


// GET from /api/users/:_id/logs user's full exercise log
// GET from /api/users/:_id/logs an object with number of exercises
// GET from /api/users/:_id/logs a user's logs filtered by date and count limit
// GET /api/users/:_id/logs?[from][&to][&limit]
router.get('/api/users/:_id/logs', (req, res) => {
  if (!req.params._id) {
    return res.status(400).send('User _id parameter is missing')
  }
  const _id = req.params._id
  const { from, to, limit } = req.query

  UserModel.findById(_id, async (err, doc) => {
    if (err) return console.log(err)

    let response = {
      _id: doc._id,
      username: doc.username,
      count: doc.log.length,
      log: doc.log,
      createdAt: doc.createdAt.toDateString(),
      updatedAt: doc.updatedAt.toDateString()
    }

    if (from || to) {
      let fromDate = new Date(0)
      let toDate = new Date()

      if (from) {
        fromDate = new Date(from)
      }

      if (to) {
        toDate = new Date(to)
      }

      fromDate = fromDate.getTime()
      toDate = toDate.getTime()

      response.log = response.log.filter(log => {
        let logDate = new Date(log.date).getTime()
        return logDate >= fromDate && logDate <= toDate
      })
    }

    if (limit) {
      response.log = response.log.slice(0, limit)
      response.count = response.log.length
    }

    res.status(200).send(response)
  })
    .catch(err => {
      res.status(500).json(err)
    })
})


module.exports = router