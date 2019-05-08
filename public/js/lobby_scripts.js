// global counts
let numberOfUsers = 0;
let numberOfRooms = 0; 

// global arrays
const users = []
const rooms = [] 

class Room {
	constructor(roomId, name, dm, numPlayers, cap, privacy, pass) {
		this.name = name;
		this.dm = dm;
		this.numPlayers = numPlayers;
		this.cap = cap
		this.roomId = roomId;
		this.members = []
		this.privacy = privacy;
		this.pass = pass;
	}
}


const User = function(name, online) {
	this.name = name;
	this.inSession = false;
	this.room = null;
	this.online = online;
}



const createRoomForm = document.querySelector('#createRoomForm');
const roomSearchFrom = document.querySelector("#roomSearchForm")
const roomsTable = document.querySelector('#roomsTable tbody')
const memberList = document.querySelector('#memberList')
const onList = memberList.querySelector("#Online tbody");
const otherList = memberList.querySelector("#Offline tbody");


//createRoomForm.addEventListener('submit',createRoom);
roomsTable.addEventListener('click', joinRoom);
roomSearchFrom.addEventListener('submit', searchRoom);
let isAd = false;

$(document).ready (function(){
	isAdmin()
	getAllSessions();
	getAllUsers();
});

function isAdmin(){
	const url = '/currentUser';
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get sessions')
       }                
    })
    .then((user) => {
		isAd = user.isAdmin
		if (isAd){
			addAdminLink();
			return true;
		}
    }).catch((error) => {
        console.log(error)
    })
}

function addAdminLink(){
	const adminLink = document.createElement('li');
	const a = document.createElement('a');
	a.appendChild(document.createTextNode("Admin"));
	a.href = "/admin";
	a.className = "nav-link";
	adminLink.appendChild(a);
	adminLink.className = "nav-item";
	const navList = document.querySelector("#navList");
	navList.appendChild(adminLink);	
}

function getAllSessions(){
	const url = '/allSessions'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get sessions')
       }                
    })
    .then((json) => {
		if (json){
			roomsTable.innerHTML = "";
			json.map((s) => {
				const room = new Room(s.roomID, s.name, s.dm, s.numPlayers, s.playerCap, s.privacy, s.password);
				addRoomToTable(room);
			})
		}
    }).catch((error) => {
        console.log(error)
    })
}

setInterval(getAllSessions, 2000);


function getAllUsers(){
	const url = '/users'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get users')
       }                
    })
    .then((json) => {
		if (json){
			onList.innerHTML = "";
			otherList.innerHTML = "";
			json.map((u) => {
				const user = new User(u.userName, u.isOnline);
				addUserToTable(user);
			})
		}
    }).catch((error) => {
        console.log(error)
    })
}

setInterval(getAllUsers, 1000)

function createRoom (e){
	e.preventDefault();
	let newRoom;
	const roomName = createRoomForm.querySelector('#newRoomName');
	const playerCap = createRoomForm.querySelector('#playerCap');
	let priv;
	//const privacy = createRoomForm.querySelector('#privacy');
	const pass = createRoomForm.querySelector('#password');
	if (pass.length > 0){
		priv = true;
	}
	else{
		priv = false;
	}
	newRoom = new Room(roomName.value,users[0].name, playerCap.value, priv, pass.value);
	newRoom.members.push(users[0]);
	
	// Push room data to server
	rooms.push(newRoom)
	
	addRoomToTable(newRoom);
	window.open('session.html', '_blank');
}

function joinRoom(e){
	e.preventDefault();
	if (!e.target.classList.contains('Join')){
		return;
	}
	const roomNum = e.target.parentElement.parentElement.children[0].innerText;

	const url = `/getSession/${roomNum}`
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get session')
       }                
    })
    .then((room) => {
		if (room.privacy && !isAd){
			const getPass = prompt("Please enter the password","");
			if(getPass != null){
				if (getPass === room.password){
					if(room.numPlayers < room.playerCap){
						joinRoomRequest(roomNum)
					}
					else{
						alert("Room Full");
					}
				}
				else{
					alert("Incorrect Password");
				}
			}
			else{
				alert("Please enter a password");
			}
		}
		else{
			if(room.numPlayers < room.playerCap){
				joinRoomRequest(roomNum)
			}
			else{
				alert("Room Full");
			}
		}
    }).catch((error) => {
        console.log(error)
	})
}

function joinRoomRequest(roomNum){
	const url = `/joinSession/${roomNum}`
	fetch (url)
	.then((res) => {
		console.log(res.status)
		if (res.status === 200) {
			console.log("going")
			location.replace("/sessions")
		} else {
			alert('Could not join session')
		}                
	}).catch((error) => {
		console.log(error)
	})
}

function searchRoom(){
	const inp = roomSearchFrom.querySelector("#roomSearchQuery");
	const filter = inp.value.toUpperCase();
	const tr = roomsTable.getElementsByTagName("tr");

	let td1, td2, txtVal1, txtVal2;
	for (i = 0; i < tr.length; i++){
		td1 = tr[i].getElementsByTagName("td")[1];
		td2 = tr[i].getElementsByTagName("td")[2];
		if (td1 || td2){
			txtVal1 = td1.innerText;
			txtVal2 = td2.innerText;
			if ((txtVal1.toUpperCase().indexOf(filter) > -1) || (txtVal2.toUpperCase().indexOf(filter) > -1)){
				tr[i].style.display = "";
			}
			else{
				tr[i].style.display = "none";
			}
		}

	}

}
function sortTable(col){
	let switching = true;
	let count = 0;
	let dir = "asc"
	let rows, r1, r2, swap, i;
	while (switching){
		switching = false;
		rows = roomsTable.rows;
		for (i = 1; i < (rows.length -1); i++){
			swap = false;
			r1 = rows[i].getElementsByTagName("td")[col];
			r2 = rows[i+1].getElementsByTagName("td")[col];
			if (dir = "asc"){
				if (r1.innerHTML.toLowerCase() > r2.innerHTML.toLowerCase()){
					swap = true;
					break;
				}
			}
			else {
				if (r1.innerHTML.toLowerCase() < r2.innerHTML.toLowerCase()) {
					swap = true;
					break;
				}		
			}
		}
		if (swap){
			rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
			switching = true;
			count++;
		}
		else {
			if (count == 0 && dir == "asc"){
				dir = "desc";
				switching = true;
			}
		}
	}
}

function addRoomToTable(room){
	
	const tableRow = document.createElement('TR');
	const idCol = document.createElement('TD');
	const nameCol = document.createElement('TD');
	const dmCol = document.createElement('TD');
	const playerCol = document.createElement('TD');
	const privacyCol = document.createElement('TD');
	const joinCol = document.createElement('TD');
	idCol.appendChild(document.createTextNode(room.roomId));
	idCol.add
	nameCol.appendChild(document.createTextNode(room.name));
	dmCol.appendChild(document.createTextNode(room.dm));
	playerCol.appendChild(document.createTextNode(`${room.numPlayers}/${room.cap}`));

	if (room.privacy){
		privacyCol.appendChild(document.createTextNode("Private"));

	}
	else{
		privacyCol.appendChild(document.createTextNode("Public"));

	}

	const joinButton = document.createElement('button');
	joinButton.className = "Join btn-xs btn-primary";
	joinButton.appendChild(document.createTextNode("Join"));
	joinCol.appendChild(joinButton);

	tableRow.appendChild(idCol);
	tableRow.appendChild(nameCol);
	tableRow.appendChild(dmCol);
	tableRow.appendChild(playerCol);
	tableRow.appendChild(privacyCol);
	tableRow.appendChild(joinCol);

	roomsTable.appendChild(tableRow);
	
}

function addUserToTable(user){
	//Given the users name get their data from server
	const tableRow = document.createElement('TR');
	const nameCol = document.createElement('TD');
	nameCol.appendChild(document.createTextNode(user.name));
	tableRow.appendChild(nameCol);
	tableRow.className = "text-light";
	if (user.online){
		onList.appendChild (tableRow);
	}
	else {
		otherList.append(tableRow);
		
	}	
}


