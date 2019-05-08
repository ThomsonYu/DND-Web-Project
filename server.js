'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')
const bcrypt = require('bcryptjs')

const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user')
const { Session } = require ('./models/session')

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
app.set('view engine', 'hbs')

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/css", express.static(__dirname + '/public/css'))
app.use("/img", express.static(__dirname + '/public/img'))

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 6000000,
		httpOnly: true
	}
}))

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('/lobby')
	} else {
		next();
	}
}

const inRoomChecker = (req, res, next) => {
	if (req.session.roomID){
		Session.findById(req.session.roomID).then((result) => {
			if(!result){
				res.status(404).send()
			}else{
				result.players.pull(req.session.userName)
				result.numPlayers -= 1;
				result.messages.push({
					name: "Server",
					message: req.session.userName + " has left the room",
					timeStamp: new Date().toLocaleTimeString()
				})
				return result.save();
			}
		}).then((result) => {
			if (result.numPlayers === 0){
				return result.remove();
			}
		}).then((result) => {
			req.session.roomNum = undefined;
			req.session.roomID = undefined;
			next();
		}).catch((error) => {
			res.status(500).send()
		})
	}
	else{
		next();
	}
}

// route for root; redirect to index
app.get('/', sessionChecker, inRoomChecker, (req, res) => {
	res.redirect('index')
})

// route for index
app.route('/index')
	.get(sessionChecker, inRoomChecker, (req, res) => {
		res.sendFile(__dirname + '/public/index.html')
	})

// User index and logout routes
app.post('/users/index', (req, res) => {
	const userName = req.body.userName
	const password = req.body.password

	User.findByUserNamePassword(userName, password).then((user) =>{
		user.isOnline = true;
		return user.save();
	}).then((user) => {
		if(!user) {
			res.redirect('/index')
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			req.session.user = user._id;
			req.session.userName = user.userName
			req.session.isAdmin = user.isAdmin;
			res.redirect('/lobby')
		}
	}).catch((error) => {
		res.status(401).redirect('/index')
	})
})

app.get('/users/logout', inRoomChecker, (req, res) => {
	User.findById(req.session.user).then((user) => {
		user.isOnline = false;
		user.save();
	}).catch((error) => {
		log("User is not logged in")
	})
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

/** User routes for Sign up**/
app.get('/users/signUp', sessionChecker, inRoomChecker, (req, res) => {
	res.sendFile(__dirname + '/public/Signup.html')
})

app.post('/users', (req, res) => {
	// Create a new user
	const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
		userName: req.body.userName,
		password: req.body.password,
		characters: [],
		isOnline: false,
		isAdmin: false,
		tokens: 0
	})

	// save user to database
	user.save().then((result) => {
		res.redirect('/index')
	}).catch((error) => {
		log(error)
		res.redirect('/users/signUp')
	})
})

app.get('/users', (req, res) => {
	User.find().then((result) => {
		if(!result){
			res.status(404).send()
		}else{
			res.send(result)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.get('/currentUser', (req, res) => {
	
	User.findById(req.session.user).then((result) => {
		if(!result){
			res.status(404).send()
		}else{
			res.send(result)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.delete('/users/:userName', (req, res) => {
	const uName = req.params.userName;
	User.findOneAndRemove({'userName':uName}).then((user) => {
		if (!user) {
		res.status(404).send()
	} else {
		res.send({ user })
	}
	}).catch((error) => {
		res.status(500).send(error)
	})
})

app.get('/userCharacters', (req, res) => {
	User.findById(req.session.user).then(user => {
		if(!user){
			res.status(404).send()
		}else{
			res.send(user.characters)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

/** User routes for Admin page**/
app.get('/admin', (req, res) => {
	if (req.session.isAdmin){
		res.sendFile(__dirname + '/public/admin.html')
	} else {
		res.redirect('/index')
	}
})

/** User routes for Lobby page**/
app.get('/lobby', inRoomChecker, (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.sendFile(__dirname + '/public/lobby.html')
	} else {
		res.redirect('/index')
	}
})

/** User routes for User profile page**/
app.get('/userProfile', inRoomChecker, (req, res) => {
	if (req.session.user){
		res.sendFile(__dirname + '/public/userProfile.html')
	} else {
		res.redirect('/index')
	}
})
// Send a list of the characters for the profile
app.get('/getCharacters', (req, res) => {
	if (req.session.user){
		User.findById(req.session.user).then((user) =>{
			const chars = user.characters.map(c => {
					return {
						_id: c._id,
						charID: c.charID, 
						charName: c.charName, 
						charClass: c.charClass, 
						charLevel: c.charLevel
					}
				});
			res.send(chars);
		});
	} else {
		res.redirect('/index')
	}
})

/** User routes for editing characters **/
app.get('/editCharacterSheet', (req, res) => {
	if (req.session.user){
		res.sendFile(__dirname + '/public/editCharacterSheet.html')
	} else {
		res.redirect('/index')
	}
})

app.get('/editCharacterSheet/:cid', (req, res) => {
	const cid = req.params.cid
	if (req.session.user){
		User.findById(req.session.user).then((user) =>{
			if (!user){
				res.status(404).send()
			} else {
				const char = user.characters.id(cid);
				res.send(char);
			}
		}).catch((error) => {
			console.log(error)
		})
	} else {
		res.redirect('/index')
	}
})

app.post('/editCharacterSheet/', (req, res) => {
	if (req.session.user){
		User.findById(req.session.user).then(
			(user) => {
				const character = req.body;
				user.characters.push(character);
				user.save().then(
					(user) => res.send(user.characters[user.characters.length - 1]), 
					(error) => res.status(400).send(error)
				);
			}
		);
	} else {
		res.redirect('/index')
	}
})

app.post('/editPersonalInfo', (req, res) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			//log(req.body.old)
			User.comparePassword(req.body.old, user.password).then((result) => {
				if (result) {
					user.password = req.body.new
					user.save().then((user) => {
						res.status(200).send()
					}).catch((error) => {
						res.xstatus(400).send()
					})
				}else {
					res.status(400).send()
				}
				
			}).catch((error) => {
				res.status(400).send()
			})
		}).catch((error) => {
			res.status(400).send()
		})
	}
})

app.patch('/editPersonalInfo/', (req, res) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {	
			user.tokens = req.body.tokens
			user.email = req.body.email
			user.firstName = req.body.firstName
			user.lastName = req.body.lastName
			return user.save();
		}).then((user) => {
			res.status(200).send()
		}).catch((error) => {
			res.status(400).send(error)
		})
	} else {
		res.redirect('/index')
	}
})

app.patch('/editCharacterSheet/:cid', (req, res) => {
	const cid = req.params.cid;
	if (req.session.user){
		User.findById(req.session.user).then((user) => {
			const character = req.body;
			const char = user.characters.id(cid);
			char.set(character);
			return user.save();
		}).then((character) => {
			res.send({redirect: "/userProfile"})
		}).catch((error) => {
			res.status(400).send(error)
		})
	} else {
		res.redirect('/index')
	}
})

app.delete('/editCharacterSheet/:cid', (req, res) => {
	const cid = req.params.cid;

	if (req.session.user){
		User.findById(req.session.user).then((user) => {
			const char = user.characters.id(cid);
			user.characters.splice(user.characters.indexOf(char), 1);
			return user.save();
		}).then((user) => {
			res.send(user)
		}).catch((error) => {
			res.status(400).send(error)
		})
	} else {
		res.redirect('/index')
	}
})

/** User routes for References page**/
app.get('/references', (req, res) => {
	if (req.session.user) {
		res.sendFile(__dirname + '/public/dnd5eng.pdf')
	} else {
		res.redirect('/index')
	}
})

/** User routes for Session page**/
app.get('/sessions', (req, res) => {
	// check if we have active session cookie
	if (req.session.roomID) {
		res.sendFile(__dirname + '/public/session.html')
	} else if (req.session.user) {
		res.redirect('/lobby')
	}
	else{
		res.redirect('/index')
	}
})

app.get('/allSessions', (req, res) => {
	
	Session.find().then((result) => {
		if(!result){
			res.status(404).send()
		}else{
			res.send(result)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.get('/currentSession', (req, res) => {
	Session.findById(req.session.roomID).then((result) => {
		if(!result){
			res.status(404).send()
		}else{
			res.send(result)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

let numSessions = 0;
app.post('/sessions', (req, res) => {
	if (!req.session.roomID){
		let priv;
		if (req.body.password === ""){
			priv = false;
		}
		else{
			priv = true;
		}
		const session = new Session({
			name: req.body.name,
			playerCap: req.body.playerCap,
			numPlayers: 1,
			privacy: priv,
			password: req.body.password,
			dm: req.session.userName,
			players:[],
			messages:[]
		})
		numSessions++;
		session.roomID = numSessions;
		session.players.push(req.session.userName);
		session.messages.push({
			name: "Server",
			message: req.session.userName + " has joined the room",
			timeStamp: new Date().toLocaleTimeString()
		})
		session.save().then((result) => {
			req.session.roomNum = session.roomID;
			req.session.roomID = session._id;
			res.sendFile(__dirname + '/public/session.html')
		}).catch((error) => {
			log(error)
			res.redirect('/lobby')
		})
	}
	else{
		res.redirect('/sessions')
	}
})

app.get('/getSession/:id', (req, res) => {
	const id = req.params.id

	Session.findOne({'roomID': id}).then((sn) => {
		if (!sn){
			res.status(404).send()
		}
		else{
			res.send(sn)
		}
	}).catch((error) => {
		log(error)
	})
})

app.get('/joinSession/:id', (req, res) => {
	const id = req.params.id

	Session.findOne({'roomID': id}).then((sn) => {
		if (!sn){
			res.status(404).send()
		}
		else{
			sn.players.push(req.session.userName)
			sn.messages.push({
				name: "Server",
				message: req.session.userName + " has joined the room",
				timeStamp: new Date().toLocaleTimeString()
			})
			sn.numPlayers += 1;
			req.session.roomNum = sn.roomID;
			req.session.roomID = sn._id;
			sn.save();
		}
	}).then((result) => {
		res.send('/sessions')
	}).catch((error) => {
		log(error)
	})
})

// Session messages
app.patch('/sendMessage', (req, res) => {
	Session.findById(req.session.roomID).then((sn) => {
		if (!sn){
			res.status(404).send()
		}
		else{
			if (req.body.message[0] === "/"){
				req.body.name = "Roll Bot";
			}
			else{
				req.body.name = req.session.userName;
			}
			sn.messages.push(req.body);
			sn.save();
			res.end();
		}
	}).catch((error) => {
		log(error)
		res.status(500).send(error)
	})
})

app.get('/leaveRoom', (req, res) => {
	if (req.session.roomID) {
		Session.findById(req.session.roomID).then((result) => {
			if(!result){
				res.status(404).send()
			}else{
				result.players.pull(req.session.userName)
				result.numPlayers -= 1;
				result.messages.push({
					name: "Server",
					message: req.session.userName + " has left the room",
					timeStamp: new Date().toLocaleTimeString()
				})
				return result.save();
			}
		}).then((result) => {
			if (result.numPlayers === 0){
				return result.remove();
			}
		}).then((result) => {
			req.session.roomNum = undefined;
			req.session.roomID = undefined;
			res.redirect('/lobby')
		}).catch((error) => {
			res.status(500).send()
		})
	} 
	else{
		res.redirect('/index')
	}
})

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});