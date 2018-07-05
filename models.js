const debug = require('debug')('webmaster-tools:db');
const mongoose = require('mongoose');
const mongodbUri = process.env['MONGODB_URI'] ? process.env['MONGODB_URI'] : 'mongodb://localhost:27017/adflow';

//////////////////////////
// DB connection
mongoose.connect(mongodbUri);

const db = mongoose.connection;
db.on('error', err => {
  console.error('Connection error', err);
});
db.once('open', () => {
  start();
});

//////////////////////////
// Models
const models = {};
function start() {

  const userSchema = mongoose.Schema({
    userId: String,
    accessToken: String,
    expiresIn: String,
  });
  Object.assign(userSchema.methods, UserMethods);
  models.User = mongoose.model('User', userSchema);

  const flowSchema = mongoose.Schema({
    name: String,
    accessToken: String,
    userId: String,
    accountId: String,
    page: Object,
    webhookToken: String,
    parentId: String,
    paused: Boolean,
  });
  Object.assign(flowSchema.methods, FlowMethods);
  models.Flow = mongoose.model('Flow', flowSchema);
}

const UserMethods = {}
const FlowMethods = {}

//////////////////////////
// Exports
module.exports = models;
