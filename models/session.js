const mongoose = require('mongoose')
const validator = require('validator')

const MessageSchema = new mongoose.Schema({
	name: String,
	message: String,
	timeStamp: String
})

const SessionSchema = new mongoose.Schema({
	roomID: {
		type: Number,
		unique: true
	},
	name:{
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: false
	},
	playerCap:{
		type: Number,
		required: true,
	},
	numPlayers:{
		type:Number,
		required: true
	},
	privacy: {
		type: Boolean,
		required: true,
	},
	password: {
		type: String,
		required: false
	},
	dm: {
		type: String,
		required: true,
		unique: true
	},
	players: [String],
	messages: [MessageSchema]
})

const Session = mongoose.model('Session',SessionSchema)

module.exports = { Session }