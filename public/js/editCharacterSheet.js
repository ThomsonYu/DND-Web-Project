
// These are the Ids of all the fields that a character has to save.
const bioIds = ["charName","charClass","charRace","charAlign","charBackground","charLanguages","charExp","charSex","charSize","charHeight","charWeight","charSpeed"];
const statIds = ["charSTR","charDEX","charCON","charINT","charWIS","charCHA"];
const skillIds = ["saveSTR","saveDEX","saveCON","saveINT","saveWIS","saveCHA","athletics","acrobatics","sleightOfHand","stealth","arcana","history","investigation","nature","religion","animalHandling","insight","medicine","perception","survival","deception","intimidation","performance","persuasion"];
const armorClassIds = ["armorBonus","shieldBonus","magicArmorBonus","miscArmorBonus"];
const armorTypeIds = ["mediumArmor","heavyArmor"];
const otherIds = ["charLevel", "currenthp", "maxhp", "temphp","proficiency"];
const noteIds = ["proficiencies", "characterSavesNotes", "characterDefensiveStatsNotes", "armorNotes", "notesNotes"];

const intOrNull = x => parseInt(x) ? parseInt(x) : null;

class Character{
	// Because the fields can be left blank, we can't rely on all of them being set when the object is created
	// By creating the constructor this way, we can let the creator decide which fields to fill in what order
	// and avoid confusion and inconsistency causing lots of trouble when we implement the backend.
	constructor (obj) {
		this.id = null;
		for (let i = 0; i < bioIds.length; i++){
			this[bioIds[i]] = null;
		}
		for (let i = 0; i < statIds.length; i++){
			this[statIds[i]] = null;
		}
		for (let i = 0; i < skillIds.length; i++){
			this[skillIds[i]] = false;
		}
		for (let i = 0; i < armorClassIds.length; i++){
			this[armorClassIds[i]] = null;
		}
		for (let i = 0; i < armorTypeIds.length; i++){
			this[armorTypeIds[i]] = false;
		}
		for (let i = 0; i < otherIds.length; i++){
			this[otherIds[i]] = null;
		}
		for (let i = 0; i < noteIds.length; i++){
			this[noteIds[i]] = "";
		}
		if (obj){
			Object.assign(this, obj);
		}
	};
	// Sets the values in this object to the ones set on the page
	getDomValues () {
		for (let i = 0; i < bioIds.length; i++){
			this[bioIds[i]] = document.querySelector("#" + bioIds[i]).value;
		}
		for (let i = 0; i < statIds.length; i++){
			this[statIds[i]] = intOrNull(document.querySelector("#" + statIds[i]).value);
		}
		for (let i = 0; i < skillIds.length; i++){
			this[skillIds[i]] = document.querySelector("#" + skillIds[i] + " input").checked;
		}
		for (let i = 0; i < armorClassIds.length; i++){
			this[armorClassIds[i]] = intOrNull(document.querySelector("#" + armorClassIds[i]).value);
		}
		for (let i = 0; i < armorTypeIds.length; i++){
			this[armorTypeIds[i]] = document.querySelector("#" + armorTypeIds[i]).checked;
		}
		for (let i = 0; i < otherIds.length; i++){
			this[otherIds[i]] = intOrNull(document.querySelector("#" + otherIds[i]).value);
		}
		for (let i = 0; i < noteIds.length; i++){
			this[noteIds[i]] = document.querySelector("#" + noteIds[i] + " textarea").value;
		}
	};
	// Sets the values on the page to the ones set on this object
	setDomValues () {
		for (let i = 0; i < bioIds.length; i++){
			let ele = document.querySelector("#" + bioIds[i]);
			ele.value = this[bioIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
		for (let i = 0; i < statIds.length; i++){
			let ele = document.querySelector("#" + statIds[i]);
			ele.value = this[statIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
		for (let i = 0; i < skillIds.length; i++){
			let ele = document.querySelector("#" + skillIds[i] + " input");
			ele.checked = this[skillIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
		for (let i = 0; i < armorClassIds.length; i++){
			let ele = document.querySelector("#" + armorClassIds[i]);
			ele.value = this[armorClassIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
		for (let i = 0; i < armorTypeIds.length; i++){
			let ele = document.querySelector("#" + armorTypeIds[i]);
			ele.checked = this[armorTypeIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
		for (let i = 0; i < otherIds.length; i++){
			let ele = document.querySelector("#" + otherIds[i]);
			ele.value = this[otherIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
		for (let i = 0; i < noteIds.length; i++){
			let ele = document.querySelector("#" + noteIds[i] + " textarea");
			ele.value = this[noteIds[i]];
			ele.dispatchEvent(new Event("change"));
		}
	}
}

const characters = [];
const nate = new Character({"id":11235135,"charName":"Nate","charClass":"Fighter","charRace":"Human","charAlign":"Lawful Good","charBackground":"Folk Hero","charLanguages":"common, elvish","charExp":"0","charSex":"Male","charSize":"M","charHeight":"5'8\"","charWeight":"146","charSpeed":"30","charSTR":16,"charDEX":14,"charCON":15,"charINT":9,"charWIS":13,"charCHA":11,"saveSTR":true,"saveDEX":false,"saveCON":true,"saveINT":false,"saveWIS":false,"saveCHA":false,"athletics":true,"acrobatics":true,"sleightOfHand":false,"stealth":false,"arcana":false,"history":false,"investigation":false,"nature":false,"religion":false,"animalHandling":false,"insight":false,"medicine":false,"perception":false,"survival":true,"deception":false,"intimidation":true,"performance":false,"persuasion":false,"armorBonus":16,"shieldBonus":2,"magicArmorBonus":null,"miscArmorBonus":null,"mediumArmor":false,"heavyArmor":true,"charLevel":1,"currenthp":12,"maxhp":12,"temphp":null,"proficiency":2,"proficiencies":"simple weapons, martial weapons\nall armor"});
characters.push(nate);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// const name = urlParams.get('name');
// const cls = urlParams.get('class');
// const lvl = parseInt(urlParams.get('level'));
// let current_char = null;
// if (id) {
// 	current_char = characters.find(c => c.id === id);
// }
// if (id && current_char) {
// 	setTimeout(() => current_char.setDomValues(),0);
// } else {
// 	if (name)
// 		document.querySelector("#charName").value = name;
// 	if (cls)
// 		document.querySelector("#charClass").value = cls;
// 	if (lvl)
// 		document.querySelector("#charLevel").value = lvl;
// }

setTimeout(() => {
	if (id){
		$.get("/editCharacterSheet/" + id, (data) => new Character(data).setDomValues())
	}
} ,0);


// This class is just to keep the skill and stat together in one object
class Skill {
	constructor (skillId, statId) {
		this.skillId = skillId;
		this.statId = statId;
	}
	getBonus() {
		return getProficiencyBonus() + getStatMod(this.statId);
	}
}
function updateSkillModDom(skill) {
	return function (e){
		e.preventDefault();
		let bonusDom = document.querySelector("#" + skill.skillId + " .skillMod");
		bonusDom.innerText = skill.getBonus();
	};
}
function updateProficiencyModDom(statId){
	return function (e){
		e.preventDefault();
		let statDom = document.querySelector("#" + statId);
		let statMod = getStatMod(statId);
		statDom.previousElementSibling.innerText = statMod > 0 ? "+" + statMod : statMod;
	};
}
function getStatMod (statId) {
	let statBonus = document.querySelector("#" + statId).value;
	statBonus = statBonus ? Math.floor((parseInt(statBonus) - 10) / 2) : 0;
	return statBonus;
}
function getProficiencyBonus () {
	let proficiency = document.querySelector("#proficiency").value;
	return proficiency ? parseInt(proficiency) : 0;
}

// Setting the listeners for all the different skills and their associated stat
const strSkillIds = ["saveSTR","athletics"];
const dexSkillIds = ["saveDEX","acrobatics", "sleightOfHand","stealth"];
const conSkillIds = ["saveCON"];
const intSkillIds = ["saveINT","arcana","history","investigation","nature","religion"];
const wisSkillIds = ["saveWIS","animalHandling","insight","medicine","perception","survival"];
const chaSkillIds = ["saveCHA","deception","intimidation","performance","persuasion"];
//const statIds = ["charSTR", "charDEX", "charCON", "charINT", "charWIS", "charCHA"];
const skillIdsByStat = [strSkillIds, dexSkillIds, conSkillIds, intSkillIds, wisSkillIds, chaSkillIds];
const skills = []
for (let i = 0; i < 6; i++){
	let statDom = document.querySelector("#" + statIds[i]);
	statDom.addEventListener("change", updateProficiencyModDom(statIds[i]));
	for (let j = 0; j < skillIdsByStat[i].length; j++){
		let newSkill = new Skill(skillIdsByStat[i][j], statIds[i]);
		skills.push(newSkill);
		statDom.addEventListener("change", updateSkillModDom(newSkill));
		let skillDom = document.querySelector("#" + skillIdsByStat[i][j] + " input");
		skillDom.addEventListener("change", updateSkillModDom(newSkill));
	}
}
// Armor Class functions
function getArmorClass () {
	let ac = 0;
	
	let armorBonus = document.querySelector("#armorBonus").value;
	armorBonus = armorBonus ? parseInt(armorBonus) : 0;
	let shieldBonus = document.querySelector("#shieldBonus").value;
	shieldBonus = shieldBonus ? parseInt(shieldBonus) : 0;
	let magicArmorBonus = document.querySelector("#magicArmorBonus").value;
	magicArmorBonus = magicArmorBonus ? parseInt(magicArmorBonus) : 0;
	let miscArmorBonus = document.querySelector("#miscArmorBonus").value;
	miscArmorBonus = miscArmorBonus ? parseInt(miscArmorBonus) : 0;
	
	let dexBonus = getStatMod("charDEX");
	if (document.querySelector("#heavyArmor").checked){
		dexBonus = 0;
	}
	else if (document.querySelector("#mediumArmor").checked){
		dexBonus = Math.min(dexBonus, 2);
	}
	
	ac += armorBonus;
	ac += shieldBonus;
	ac += dexBonus;
	ac += magicArmorBonus;
	ac += miscArmorBonus;
	
	return ac;
}
function updateDexArmorClassBonus (e) {
	e.preventDefault();
	let dexBonus = getStatMod("charDEX");
	if (document.querySelector("#heavyArmor").checked){
		dexBonus = 0;
	}
	else if (document.querySelector("#mediumArmor").checked){
		dexBonus = Math.min(dexBonus, 2);
	}
	document.querySelector("#dexBonus").value = dexBonus;
}
function updateArmorClass(e) {
	e.preventDefault();
	document.querySelector("#armorClass .modifier").innerText = getArmorClass();
}
// Setting listeners for armor class
document.querySelector("#charDEX").addEventListener("change", updateDexArmorClassBonus);
document.querySelector("#charDEX").addEventListener("change", updateArmorClass);
document.querySelector("#heavyArmor").addEventListener("change", updateDexArmorClassBonus);
document.querySelector("#heavyArmor").addEventListener("change", updateArmorClass);
document.querySelector("#mediumArmor").addEventListener("change", updateDexArmorClassBonus);
document.querySelector("#mediumArmor").addEventListener("change", updateArmorClass);
document.querySelector("#armorBonus").addEventListener("change", updateArmorClass);
document.querySelector("#shieldBonus").addEventListener("change", updateArmorClass);
document.querySelector("#magicArmorBonus").addEventListener("change", updateArmorClass);
document.querySelector("#miscArmorBonus").addEventListener("change", updateArmorClass);

// Initiative functions
function updateInitiative (e) {
	e.preventDefault();
	document.querySelector("#initiative").innerText = getStatMod("charDEX");
}
document.querySelector("#charDEX").addEventListener("change", updateInitiative);

function saveCharacter (e) {
	e.preventDefault();
	const newChar = new Character();
	newChar.getDomValues();
	if (id){
		newChar._id = id;
		$.ajax({
		    url : '/editCharacterSheet/' + id,
		    data : JSON.stringify(newChar),
		    type : 'PATCH',
		    contentType : 'application/json',
			dataType: 'json',
			success: (data) => {
				if (data.redirect){
					window.location.href = data.redirect;
				}
			} 
		});
	} else {
		$.post('/editCharacterSheet/', newChar, data => {id = data.charID})
	}
}

document.querySelector("#saveBtn a").addEventListener('click', saveCharacter);



