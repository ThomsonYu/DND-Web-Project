'use strict';

$(document).ready (function(){
	getAllUsers();
});

const playerListTable = document.getElementById("userList");
playerListTable.addEventListener("click", removePlayer)
let numUsers = 1;

function getAllUsers(){
    const url = "/users"
    fetch(url)
    .then((res) => {
        if (res.status === 200){
            return res.json();
        }
    })
    .then((json) => {
        if (json){
            json.map((user) => {
                if (!user.isAdmin){
                    addUser(user)
                }
            })
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

function addUser(user){
    const tRow = document.createElement("tr")
    const tH = document.createElement("th")
    const tdName = document.createElement("td")
    const tdDel = document.createElement("td")
    const tdDelBut = document.createElement("button")

    tdDelBut.className = "Remove btn-xs btn-primary";
    tdDelBut.innerText = "Remove"
    tdDel.appendChild(tdDelBut)

    tdName.innerText = user.userName
    
    tH.setAttribute("scope", "row")
    tH.innerText = numUsers;
    numUsers++;

    tRow.appendChild(tH)
    tRow.appendChild(tdName)
    tRow.appendChild(tdDel)
    playerListTable.appendChild(tRow)
}

function removePlayer(e){
    e.preventDefault();

    if (!e.target.classList.contains('Remove')){
		return;
    }
    
    const remove = confirm("Remove this user?")
    if (remove){
        const uName = e.target.parentElement.parentElement.children[1].innerText;
        playerListTable.removeChild(e.target.parentElement.parentElement);
        removeUserRequest(uName);
    }
}
function removeUserRequest(uName){
    const url = `/users/${uName}`;
    fetch (url ,{
        method: 'DELETE'
    })
    .then((res) => {
        console.log(res.status)
        if (res.status === 200) {
            console.log("Deleted User")
        } else {
            alert('Could not delete user')
        }                
    }).catch((error) => {
        console.log(error)
    })
}

function userFilter(){
    const input = document.getElementById("userSearchQuery");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("userTable");
    const tr = table.getElementsByTagName("tr");

    let td, txtValue;
    for (let i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        } 
    }
}
