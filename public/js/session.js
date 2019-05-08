$(document).ready (function(){
    getMessages();
    getPlayers();
    getRoomInfo();
    getCharacters();
    isAdmin()
});

///////////////
// Leave Room
window.onbeforeunload = function(e){
    return "leaving room"
}

window.addEventListener("beforeunload", () => {
    const url = '/leaveRoom'
    fetch (url)
    .then((res) => {
    }).catch((error) => {
        console.log(error)
    })
});

let numMessages = 0;
const roomName = document.querySelector("#roomName");
const hostName = document.querySelector("#hostName");
const numPlayerInfo = document.querySelector("#numPlayerInfo");
const playersTab = document.getElementById("playersTab");

const getRoomInfo = () => {
    const url = '/currentSession'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       }             
    })
    .then((json) => {
        const rNameCont = document.createElement("strong")
        const rNameLabel = document.createTextNode("Room: ")
        rNameCont.appendChild(rNameLabel)

        const rNameText = document.createTextNode(json.name)
        roomName.appendChild(rNameCont)
        roomName.appendChild(rNameText)

        const hNameCont = document.createElement("strong")
        const hNameLabel = document.createTextNode("Host: ")
        hNameCont.appendChild(hNameLabel)

        const hNameText = document.createTextNode(json.dm)
        hostName.appendChild(hNameCont)
        hostName.appendChild(hNameText) 

        const numPCont = document.createElement("strong")
        const numPLabel = document.createTextNode("Players: ")
        numPCont.appendChild(numPLabel)

        const numPText = document.createTextNode(`${json.numPlayers}/${json.playerCap}`)
        numPlayerInfo.appendChild(numPCont)
        numPlayerInfo.appendChild(numPText)
    }).catch((error) => {
        console.log(error)
    })
}

const updateRoomInfo = () => {
    const url = '/currentSession'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       }             
    })
    .then((json) => {
        numPlayerInfo.innerHTML = `<strong>Players: </strong>${json.numPlayers}/${json.playerCap}`;
    }).catch((error) => {
        console.log(error)
    })
}

setInterval(updateRoomInfo, 5000)

let characterList;
const characterDropDown = document.querySelector("#characterDropDown");
const getCharacters = () => {
    const url = '/userCharacters'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
            return res.json() 
       }             
    })
    .then((json) => {
        characterList = json;
        characterList.map((character) => {
            const characterItem = document.createElement("a")
            characterItem.className = "dropdown-item"
            characterItem.href = "#"
            characterItem.onclick = () => {setCharInfo(character)}

            const characterName = document.createTextNode(character.charName)
            characterItem.appendChild(characterName)
            characterDropDown.appendChild(characterItem)
        })
    })
}

// Set character information
function setCharInfo(char){
    document.querySelector("#cNameTitle").innerText = char.charName
    document.querySelector("#cLevel").innerText = char.charLevel
    document.querySelector("#cClass").innerText = char.charClass
    document.querySelector("#cRace").innerText = char.charRace
    document.querySelector("#cAlign").innerText = char.charAlign

    document.querySelector("#cBackground").innerText = char.charBackground
    document.querySelector("#cLanguages").innerText = char.charLanguages
    document.querySelector("#cGender").innerText = char.charSex
    document.querySelector("#cExp").innerText = char.charExp

    document.querySelector("#cStrength").innerText = char.charSTR
    document.querySelector("#cDexterity").innerText = char.charDEX
    document.querySelector("#cConstitution").innerText = char.charCON
    document.querySelector("#cIntelligence").innerText = char.charINT
    document.querySelector("#cWisdom").innerText = char.charWIS
    document.querySelector("#cCharisma").innerText = char.charCHA

    document.querySelector("#cSTStr").checked = char.saveSTR
    document.querySelector("#cSTDex").checked = char.saveDEX
    document.querySelector("#cSTCon").checked = char.saveCON
    document.querySelector("#cSTInt").checked = char.saveINT
    document.querySelector("#cSTWis").checked = char.saveWIS
    document.querySelector("#cSTCha").checked = char.saveCHA

    document.querySelector("#cSKAcrobatics").checked = char.acrobatics
    document.querySelector("#cSKAniHand").checked = char.animalHandling
    document.querySelector("#cSKArcana").checked = char.arcana
    document.querySelector("#cSKAthletics").checked = char.athletics
    document.querySelector("#cSKDeception").checked = char.deception
    document.querySelector("#cSKHistory").checked = char.history
    document.querySelector("#cSKInsight").checked = char.insight
    document.querySelector("#cSKIntimidation").checked = char.intimidation
    document.querySelector("#cSKInvestigation").checked = char.investigation
    document.querySelector("#cSKMedicine").checked = char.medicine
    document.querySelector("#cSKNature").checked = char.nature
    document.querySelector("#cSKPerception").checked = char.perception
    document.querySelector("#cSKPerformance").checked = char.performance
    document.querySelector("#cSKPersuasion").checked = char.persuasion
    document.querySelector("#cSKReligion").checked = char.religion
    document.querySelector("#cSKSlHand").checked = char.sleightOfHand
    document.querySelector("#cSKStealth").checked = char.stealth
    document.querySelector("#cSKSurvival").checked = char.survival

    document.querySelector("#cMaxHP").value = char.maxhp
    document.querySelector("#cCurHP").value = char.currenthp
    document.querySelector("#cTempHP").value = char.temphp
    document.querySelector("#cProfBonus").value = char.proficiency
    document.querySelector("#cProficiencies").innerText = char.proficiencies

    document.querySelector("#cArmor").value = char.armorBonus
    document.querySelector("#cShield").value = char.shieldBonus
    document.querySelector("#cACMedium").checked = char.mediumArmor
    document.querySelector("#cACHeavy").checked = char.heavyArmor
    document.querySelector("#cMagic").value = char.magicArmorBonus
    document.querySelector("#cMisc").value = char.miscArmorBonus
}

const charMinus = (e) => {
    e.preventDefault();
    let value = parseInt(e.target.previousElementSibling.innerText)
    value -= 1;
    e.target.previousElementSibling.innerText = value;
}

const charPlus = (e) => {
    e.preventDefault();
    let value = parseInt(e.target.previousElementSibling.previousElementSibling.innerText)
    value += 1;
    e.target.previousElementSibling.previousElementSibling.innerText = value;
}

////////////////
// Switching tabs
const openSessionTab = (e, tab, tabButton, link) => {
    let i, x, tablinks;
    x = document.getElementsByClassName(tab);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName(link);
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" tab-selected", "");
    }
    document.getElementById(tabButton).style.display = "block";
    e.currentTarget.className += " tab-selected";
}

let numPlayers = 0;

function getPlayers(){
    const url = '/currentSession'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       }             
    })
    .then((json) => {
        playersTab.innerHTML = "";
        if (json.players){
            json.players.map((player) => {
                if (player === json.dm){
                    addPlayer(player, "Host")
                }
                else{
                    addPlayer(player, "Player")
                }
            })
        }
    }).catch((error) => {
        console.log(error)
    })
}

setInterval(getPlayers, 5000)

///////////////
// Chat Message
const input = document.getElementById("messageInput")
const chatTab = document.getElementById("chatTab")

let userMessage = "";

input.addEventListener("keyup", function(e){
    if (e.keyCode === 13){
        e.preventDefault();
        userMessage = input.value;
        input.value = "";
        if (userMessage !== ""){
            const timeStamp = new Date().toLocaleTimeString()
            sendMessage(userMessage, timeStamp)
        }
    }
});

// Page write message to chat box
const addMessage = (userMessage, playerName, timeStamp) => {
    const msgContainer = document.createElement("div");
    msgContainer.className = "messageContainer border-top border-dark"

    const msgPlayer = document.createElement("strong")
    const msgPlayerText = document.createTextNode(playerName + " - " + timeStamp)
    msgPlayer.appendChild(msgPlayerText);

    const msgText = document.createElement("p");
    const msgTextNode = document.createTextNode(userMessage);
    msgText.appendChild(msgTextNode);

    msgContainer.appendChild(msgPlayer);
    msgContainer.appendChild(msgText);

    chatTab.appendChild(msgContainer);
    updateScroll();
    numMessages++;
}

// Page write command message to chat box
const addCommand = (userMessage, userName, timeStamp) => {
    const cmd = userMessage.substr(0, userMessage.indexOf(' '));
    const args = userMessage.substr(userMessage.indexOf(' ')+1);
    switch (cmd){
        case "/r":
        case "/roll":
            const rolls = dice.roll(args);
            const sum = dice.sum(rolls);
            const message = args + " = (" + rolls.map(s => s) + ") = " + sum;
            addMessage(message, userName, timeStamp)
            break;
    }
}

// Server get messages
function getMessages(){
    const url = '/currentSession'
	fetch (url)
	.then((res) => {
		if (res.status === 200) {
           return res.json() 
       }             
    })
    .then((json) => {
        if (numMessages < json.messages.length){
            if (json.messages){
                const msg = json.messages[numMessages]
                if (msg.message[0] === "/"){
                    addCommand(msg.message, msg.name, msg.timeStamp)
                }
                else{
                    addMessage(msg.message, msg.name, msg.timeStamp)
                }
            }
        }
    }).catch((error) => {
        console.log(error)
    })
}

setInterval(getMessages, 100);

// Server send message
function sendMessage(message, timeStamp) {
    const url = '/sendMessage';
    // The data we are going to send in our request
    let data = {
        name: "",
        message: message,
        timeStamp: timeStamp
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "PATCH", 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then((res) => {
        if (res.status === 200) {
            console.log("Message sent!")
        } else {
            console.log("Message unable to send")
        }
    }).catch((error) => {
        console.error(error)
    })
}

const addPlayer = (player, role) => {
    const pContainer = document.createElement("div");
    pContainer.className = "playerContainer border-bottom border-dark"

    const pSpan = document.createElement("span")
    pSpan.className = "playerInfo";

    const pRole = document.createElement("strong")
    const pRoleText = document.createTextNode(`Role: ${role}`)
    pRole.appendChild(pRoleText);

    const pName = document.createElement("p");
    const pNameText = document.createTextNode(player);
    pName.appendChild(pNameText);

    pSpan.appendChild(pRole)
    pSpan.appendChild(pName);
    pContainer.appendChild(pSpan);

    playersTab.appendChild(pContainer);
    updateScroll();
    numPlayers++;
}

const updateScroll = () => {
    const div = chatTab;
    div.scrollTop = div.scrollHeight;
}

const rollDieButton = (die) => {
    const timeStamp = new Date().toLocaleTimeString()
    sendMessage(die, timeStamp)
}

//////////////////
// Roll dice
const makeDie = (sides) => {
    const die = function(){
        return 1 + Math.random() * sides | 0;
    };

    die.times = function (count){
        const rolls = [];
        for (let i = 0; i < count; i++){
            rolls.push(this());
        }
        return rolls;
    };

    return die;
}

const dice = {
    d4: makeDie(4),
    d6: makeDie(6),
    d8: makeDie(8),
    d10: makeDie(10),
    d12: makeDie(12),
    d20: makeDie(20),
    roll: function (expression) {
        let self = this, rolls = [];

        expression.toLowerCase().replace(/(\d+)(d\d+)?/g, function (_, count, die) {
        if(die) {
            try{
                rolls = rolls.concat(self[die].times(+count));
            }
            catch (e){
                rolls = rolls.concat(makeDie(die.substr(1)).times(+count));
            }
        }
        else {
            rolls.push(+count);
        }
        });
        return rolls;
    },
    sum: function(rolls){
        return rolls.reduce(function (sum, roll) {
            return sum + roll;
        });
    }
};

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