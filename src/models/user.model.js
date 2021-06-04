const mongoose = require('mongoose')
const timestampPlugin = require('./plugins/timestamp')

// Usernames can contain characters a-z, 0-9, underscores and periods. 
// The username cannot start with a period nor end with a period. 
// It must also not have more than one period sequentially. Max length is 30 chars.
const usernameRegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/

// Dates must be in yyyy-mm-dd format.
const dateRegExp = /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/

// Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, match: usernameRegExp },
  log: [{
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, match: dateRegExp, default: Date.now }
  }]
})

// Add timestamp from pre-save plugin
UserSchema.plugin(timestampPlugin)

// Export Model Constructor
module.exports = mongoose.model('User', UserSchema)