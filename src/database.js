// const mongoose = require('mongoose')
// require('dotenv').config()

// // Debug: process.env.MONGO_URI throwing error
// class Database {
//   constructor() {
//     this._connect()
//   }
  
// _connect() {
//      mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000
//     })
//        .then(() => {
//          console.log('Database connection successful')
//        })
//        .catch(err => {
//          console.error('Database connection error')
//        })
//   }
// }

// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', () => {
//   console.log('Connected to MongoDB')
// })

// module.exports = new Database()