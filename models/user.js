/* Users model */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const CharacterSchema = new mongoose.Schema({
	charID: Number,
	charName: String,
	charClass: String,
	charRace: String,
	charAlign: String,
	charBackground: String,
	charLanguages: String,
	charExp: Number,
	charSex: String,
	charSize: String,
	charHeight: String,
	charWeight: String,
	charSpeed: String,
	charSTR: Number,
	charDEX: Number,
	charCON: Number,
	charINT: Number,
	charWIS: Number,
	charCHA: Number,
	saveSTR: Boolean,
	saveDEX: Boolean,
	saveCON: Boolean,
	saveINT: Boolean,
	saveWIS: Boolean,
	saveCHA: Boolean,
	athletics: Boolean,
	acrobatics: Boolean,
	sleightOfHand: Boolean,
	stealth: Boolean,
	arcana: Boolean,
	history: Boolean,
	investigation: Boolean,
	nature: Boolean,
	religion: Boolean,
	animalHandling: Boolean,
	insight: Boolean,
	medicine: Boolean,
	perception: Boolean,
	survival: Boolean,
	deception: Boolean,
	intimidation: Boolean,
	performance: Boolean,
	persuasion: Boolean,
	armorBonus: Number,
	shieldBonus: Number,
	magicArmorBonus: Number,
	miscArmorBonus: Number,
	mediumArmor: Boolean,
	heavyArmor: Boolean,
	charLevel: Number,
	currenthp: Number,
	maxhp: Number,
	temphp: Number,
	proficiency: Number,
	proficiencies: String,
	characterSavesNotes: String,
	characterDefensiveStatsNotes: String,
	armorNotes: String,
	notesNotes: String
});

const UserSchema = new mongoose.Schema({
	firstName:{
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: false
	},
	lastName:{
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: false
	},
	userName: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 3
	},
	isOnline:{
		type: Boolean,
		required: true
	},
	isAdmin:{
		type: Boolean,
		required: false
	},
	email: {
		type: String,
		required: false
	},
	tokens: {
		type: Number,
		required: false
	},

	characters: [CharacterSchema]
})

// Our own student finding function 
UserSchema.statics.findByUserNamePassword = function(userName, password) {
	const User = this

	return User.findOne({userName: userName}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

UserSchema.statics.comparePassword = function(old, pass) {

	return new Promise((resolve, reject) => {
		bcrypt.compare(old, pass, (error, result) => {
			resolve(result)
		})
	})


		
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})


const User = mongoose.model('User', UserSchema)

module.exports = { User }