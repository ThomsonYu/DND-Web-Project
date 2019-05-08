'use strict';
const log = console.log;

function signIn(){
	const url = "/users/index";
	let data = {
		userName: document.getElementById("uName").value,
		password: document.getElementById("pWord").value
	}

	const request = new Request(url, {
        method: "POST", 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then((res) => {
		log(res.status)
        if (res.status === 200) {
			
        } else {
            alert("Incorrect user name or password")
        }
    }).catch((error) => {
        console.error(error)
    })
}


