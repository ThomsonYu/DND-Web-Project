const log = console.log

let numChars = 0;
$(document).ready (function(){
	updateCharacterList();
	getUserInfo();
	isAdmin()
});

let popUp = false;

function getUserInfo(){
	const url = "/currentUser"
	fetch(url)
	.then((res) => {
		if (res.status === 200) {
						return res.json() 
				}             
		})
		.then((json) => {
			document.querySelector("#userName h2").innerText = json.userName
			document.querySelector("#firstName").innerText = json.firstName
			document.querySelector("#lastName").innerText = json.lastName
			if (json.email)
				document.querySelector("#email").innerText = json.email
			document.querySelector("#tokens").innerText = json.tokens
		})
		.catch((error) => {
			console.error(error)
		})
}

function changePass(e) {
	const oldPass = document.querySelector('#oldPass');
	const newPass = document.querySelector('#newPass');
	let data = {
		old: oldPass.value,
		new: newPass.value
	}
	let url = 'editPersonalInfo'
	const request = new Request(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
            	'Accept': 'application/json, text/plain, */*',
            	'Content-Type': 'application/json'
        	}
		});
	fetch(request).then((res) => {
		if (res.status === 200) {
			oldPass.value = ""
			newPass.value = ""
			alert("Password was changed successfully")
		}
		else {
			oldPass.value = ""
			newPass.value = ""
			alert("Error: Password was not changed successfully.\nPlease check if old password is correct\nNew password must be at least 3 characters long.")
		}
		}).catch((error) => {
			log(error)
	})
}

function saveEdits(e) {
	let data = {
		firstName: document.querySelector('#firstName').innerText,
		lastName: document.querySelector('#lastName').innerText,
		email: document.querySelector('#email').innerText,
		tokens: document.querySelector('#tokens').innerText
	}
	let url = 'editPersonalInfo'
	const request = new Request(url, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: {
            	'Accept': 'application/json, text/plain, */*',
            	'Content-Type': 'application/json'
        	}
		});
	fetch(request).then((res) => {
		if (res.status === 200) {
			alert("Successfully updated personal information")
		}
		else {
			alert("Unable to update personal information")
		}
		}).catch((error) => {
				console.error(error)
		})
	
}

function goEdit(mongoID) {
	return function (e) {
		e.preventDefault();
		let tr = e.target.parentElement.parentElement;
		let trtd =  tr.querySelectorAll("td");
		const str = "editCharacterSheet.html?id=";
		const s1 = trtd[0].innerHTML;
		
		const s2 = trtd[1].innerHTML;
		const s3 = trtd[2].innerHTML;
		const s4 = trtd[3].innerHTML;
		const s = str + tr.getElementsByTagName("th")[0].innerHTML + "&name=" + s1 + "&class=" + s2 + "&level=" + s3 + "&world=" + s4;
		// server call get
		window.location.href = "editCharacterSheet?id=" + mongoID;
		// window.location.href = s;
	}
}

function goDel(mongoID){
	return function (e){
		e.preventDefault();
		if (confirm("Are you sure you want to delete this character?")){
			const url = `/editCharacterSheet/${mongoID}`
			const request = new Request(url, {
				method: "DELETE"
			});
			fetch(request)
			.then((res) => {
					if (res.status === 200) {
							console.log("Character Deleted")
							updateCharacterList();
					} else {
							console.log("Unable to delete character")
					}
			}).catch((error) => {
					console.error(error)
			})
		}
	}
}

function popupAddCharacter() {
	if (!popUp) {
		popUp = true;
		
		if (numChars == 5) {
			window.alert("Too many Characters!");
			popUp = false;
			return;
		}
		let f = document.createElement("form");
		f.setAttribute('id',"popupForm");
		
		let i = document.createElement("input"); //input element, text
		i.setAttribute('class',"createChar");
		i.setAttribute('type',"text");
		i.setAttribute('name',"username");
		i.setAttribute('placeholder',"Character Name");

		let l = document.createElement("input"); //input element, text
		l.setAttribute('class',"createChar");
		l.setAttribute('type',"text");
		l.setAttribute('name',"level");
		l.setAttribute('placeholder',"Character Level");

		let c = document.createElement("label"); //input element, text
		c.setAttribute('class',"createChar");
		i.setAttribute('for',"class");
		i.setAttribute('for',"class");
	
		let cOptions = document.createElement("select"); //input element, text
		i.setAttribute('id',"classes");

		const classes = ["Barbarian","Bard","Cleric","Druid","Fighter","Monk","Paladin","Ranger","Rogue","Sorcerer","Warlock","Wizard"];
		for (let cls = 0; cls < classes.length; cls++){
			let cOptioni = document.createElement("option");
			cOptioni.setAttribute('value',classes[cls].toLowerCase());
			cOptioni.innerHTML = classes[cls];
			cOptions.appendChild(cOptioni);
		}
		c.appendChild(cOptions);

		let s = document.createElement("input"); //input element, Submit button
		s.setAttribute('class',"createChar");
		s.setAttribute('type',"submit");
		s.setAttribute('value',"Create");
		
		
		f.appendChild(i);
		f.appendChild(l);
		f.appendChild(c);
		f.appendChild(s);
		const popUpPos = document.querySelector("#popUp");

		popUpPos.appendChild(f);
		
		function getRndInteger(min, max) {
  			return Math.floor(Math.random() * (max - min) ) + min;
		}
	
		
		const createCharForm = document.querySelector('#popupForm');
		
		createCharForm.addEventListener('submit', function(e) {

			e.preventDefault();
			for (let i = 0; i < createCharForm.elements.length; i++) {
				if (createCharForm.elements[i].value == "") {
					window.alert("Fill all fields please!");
					return;
				}
				if (i==1 && parseInt(createCharForm.elements[i].value).toString().length != createCharForm.elements[i].value.length) {
					window.alert("Character Level should only contain numbers!");
					return;
				}
			}
			if (/\d/.test(createCharForm.elements[3].value)) {
				window.alert("Enter a real world please!");
				return;
			}
			else {
				numChars++;
				const charID = numChars;
				const charName = createCharForm.elements[0].value;
				const charLevel = createCharForm.elements[1].value;
				const charClass = createCharForm.elements[2].value;
				popUpPos.removeChild(createCharForm);
				popUp = false;
				// server call post
				const newChar = {
					charID,
					charName,
					charClass,
					charLevel
				};
				$.post('/editCharacterSheet', newChar, 
					(data, status) => {
						//scope.innerHTML = data._id;
						createNewCharacterElement(
							data.charID,
							data._id,
							data.charName, 
							data.charClass, 
							data.charLevel
						);
				});
			}
		})
	}
}

const characterListTable = document.querySelector("#characterTable").querySelector("tbody");
function createNewCharacterElement(charID, mongoID, charName, charClass, charLevel) {
	let a = document.createElement("a");
	a.setAttribute('href', "editCharacterSheet.html");
	let tr = document.createElement("tr");
	let scope = document.createElement("th");
	scope.setAttribute('scope',"row");
	scope.innerHTML = charID;
	let name = document.createElement("td");
	name.innerHTML = charName;
	let level = document.createElement("td");
	level.innerHTML = charLevel;
	let cclass = document.createElement("td");
	cclass.innerHTML = charClass;
	let viewButton = document.createElement("td");
	let vbutton = document.createElement("input");
	let delButton = document.createElement("td");
	let dbutton = document.createElement("input");
	vbutton.setAttribute('type',"submit");
	vbutton.setAttribute('class',"btn-primary mb-4");
	vbutton.setAttribute('value',"Edit");

	dbutton.setAttribute('type',"submit");
	dbutton.setAttribute('class',"btn-danger mb-4");
	dbutton.setAttribute('value',"Delete");
	
	viewButton.appendChild(vbutton);
	delButton.appendChild(dbutton);
	tr.appendChild(scope);
	tr.appendChild(name);
	tr.appendChild(cclass);
	tr.appendChild(level);
	tr.appendChild(viewButton);
	tr.appendChild(delButton);
	vbutton.addEventListener('click',goEdit(mongoID));
	dbutton.addEventListener('click',goDel(mongoID));
	characterListTable.appendChild(tr);
}


function updateCharacterList(){
	characterListTable.innerHTML = "";
	$.get('/getCharacters', (data) => {
		numChars = data.length;
		let currChar = 1;
		data.forEach(char => createNewCharacterElement(char.charID,char._id, char.charName, char.charClass, char.charLevel))
	});
}

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
		if (user.isAdmin){
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
