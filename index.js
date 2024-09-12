//Registration Function
function register() {
    var dataEntered = createData();
    if (dataEntered === false) {
        alert("Enter all the fields");
    } else if (dataEntered === "Invalid") {
        alert("User Name Already Exist");
    } else {
        var existingData = JSON.parse(localStorage.getItem("regusers")) || [];
        existingData.push(dataEntered);
        alert("User Registered Successfully");
        localStorage.setItem("regusers", JSON.stringify(existingData));
        window.location.href = "login.html";
    }
    document.getElementById("rform").reset();
}

//Data Create Function
function createData() {
    var name = document.getElementById("rname").value;
    var uname = document.getElementById("runame").value;
    var pass = document.getElementById("rpass").value;
    if (name === "" || uname === "" || pass === "") {
        return false;
    } else if (check(uname) === false) {
        return "Invalid";
    } else {
        return { name, uname, pass, event: [] };
    }
}

function check(uname) {
    var existingData = JSON.parse(localStorage.getItem("regusers")) || [];
    for (let i of existingData) {
        if (uname === i.uname) {
            return false;
        }
    }
    return true;
}

//Login function
function login() {
    sessionStorage.clear();
    var existingData = JSON.parse(localStorage.getItem("regusers")) || [];
    var luname = document.getElementById("luname").value;
    var lpass = document.getElementById("lpass").value;
    var flag = false;
    for (let i of existingData) {
        if (luname === i.uname && lpass === i.pass) {
            window.location.href="timer.html";
            var sessionData = JSON.parse(sessionStorage.getItem("seesuser")) || [];
            sessionData.push({ luname, lpass });
            sessionStorage.setItem("seesuser", JSON.stringify(sessionData));
            alert("User Login Successfully");
            flag = true;
            break; // Exit the loop once user is found
        }
    }
    if (!flag) {
        alert("Enter valid Name and Password");
    }
    return [luname, lpass];
}

// Add event form submission
var form3 = document.getElementById("addEventForm");
form3.addEventListener("submit", (e) => {
    e.preventDefault();
    addEvent();
});

function addEvent() {
    var eventName = document.getElementById("eventName").value;
    var eventDate = document.getElementById("eventDate").value;
    var eventTime = document.getElementById("eventTime").value;
    var eventDateTime = new Date(eventDate + "T" + eventTime);
    var sessionData = JSON.parse(sessionStorage.getItem("seesuser")) || [];
    var existingData = JSON.parse(localStorage.getItem("regusers")) || [];
    for (let j of sessionData) {
        for (let i of existingData) {
            if (j.luname === i.uname && j.lpass === i.pass) {
                i.event.push({ eventName, eventDateTime });
            }
        }
    }
    localStorage.setItem("regusers", JSON.stringify(existingData));//this line is to update local storage
    window.location.href = "timer.html";
}

    
function insert() {
    var sessionData = JSON.parse(sessionStorage.getItem("seesuser")) || [];
    var existingData = JSON.parse(localStorage.getItem("regusers")) || [];
    for (let j of sessionData) {
        for (let i of existingData) {
            if (j.luname===i.uname && j.lpass===i.pass) {
                i.event.forEach(event => {
                    var table = document.getElementById("eventTable");
                    var newRow = table.insertRow();
                    newRow.insertCell(0).innerHTML = event.eventName;
                    newRow.insertCell(1).innerHTML = event.eventDateTime;
                    var countdownCell = newRow.insertCell(2);
                    countdownCell.setAttribute("id", event.eventName.replace(/\s+/g, '-'));
                    countdownCell.innerHTML = "";
                    newRow.insertCell(3).innerHTML = `<button onclick="editEvent(this)"><i class="fa-solid fa-pen-to-square"></i></button> 
                                                        <button onclick="deleteEvent(this)"><i class="fa-solid fa-trash"></i></button>`;
                   

                   
                });
            }
        }
    }

    // Start countdown after table rendering
    startCountdown();
}



function startCountdown() {
    var sessionData = JSON.parse(sessionStorage.getItem("seesuser")) || [];
    var existingData = JSON.parse(localStorage.getItem("regusers")) || [];

    setInterval(() => {
        const now = new Date();

        for (let j of sessionData) {
            for (let i of existingData) {
                if (j.luname===i.uname && j.lpass===i.pass) {
                    i.event.forEach(event => {
                        const eventDate = new Date(event.eventDateTime);
                        const timeDiff = eventDate - now;
                        const countdownCell = document.getElementById(event.eventName.replace(/\s+/g, '-'));

                        if (timeDiff <= 0) {
                            countdownCell.textContent = "Event Ended";
                        } else {
                            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                            countdownCell.innerHTML = `
                                <div class="countdown">
                                    <div class="countdown-box">
                                        <div class="countdown-value">${days}</div>
                                        <div class="countdown-label">Days</div>
                                    </div>
                                    <div class="countdown-box">
                                        <div class="countdown-value">${hours}</div>
                                        <div class="countdown-label">Hours</div>
                                    </div>
                                    <div class="countdown-box">
                                        <div class="countdown-value">${minutes}</div>
                                        <div class="countdown-label">Minutes</div>
                                    </div>
                                    <div class="countdown-box">
                                        <div class="countdown-value">${seconds}</div>
                                        <div class="countdown-label">Seconds</div>
                                    </div>
                                </div>`;
                        }
                    });
                }
            }
        }
    }, 1000);
}

function editEvent(button) {
    // Get the row index of the button's parent row
    var rowIndex = button.parentNode.parentNode.rowIndex;

    // Access the table and its rows
    var table = document.getElementById("eventTable");
    var row = table.rows[rowIndex];

    // Check if the row exists
    if (row) {
        // Extract event details from the row
        var eventName = row.cells[0].innerText;
        var eventDateTime = row.cells[1].innerText;

        // Prompt user to edit event details
        var newEventName = prompt("Enter new event name:", eventName);
        var newEventDateTime = prompt("Enter new event date & time (YYYY-MM-DD HH:MM):", eventDateTime);

        // Update the table cell values if user provides new values
        if (newEventName && newEventDateTime) {
            row.cells[0].innerText = newEventName;
            row.cells[1].innerText = newEventDateTime;
            alert("ab to sudhar jaa")
            // Update the corresponding data in local storage
            var sessionData = JSON.parse(sessionStorage.getItem("seesuser")) || [];
            var existingData = JSON.parse(localStorage.getItem("regusers")) || [];

            for (let j of sessionData) {
                for (let i of existingData) {
                    if (j.email === i.email && j.password === i.password) {
                        i.event.forEach(event => {
                            if (event.eventName === eventName && event.eventDateTime === eventDateTime) {
                                event.eventName = newEventName;
                                event.eventDateTime = newEventDateTime;
                            }
                        });
                    }
                }
            }

            // Update the local storage
            localStorage.setItem("regusers", JSON.stringify(existingData));
            
        }
    } else {
        console.error("Row not found!");
    }
    window.location.href="timer.html"
}



function deleteEvent(button) {
    // Get the row index of the button's parent row
    var rowIndex = button.parentNode.parentNode.rowIndex;

    // Access the table and its rows
    var table = document.getElementById("eventTable");
    var row = table.rows[rowIndex];

    // Check if the row exists
    if (row) {
        // Extract event details from the row
        var eventName = row.cells[0].innerText;
        var eventDateTime = row.cells[1].innerText;

        // Remove the row from the table
        table.deleteRow(rowIndex);

        // Remove the corresponding data from local storage
        var sessionData = JSON.parse(sessionStorage.getItem("seesuser")) || [];
        var existingData = JSON.parse(localStorage.getItem("regusers")) || [];

        for (let j of sessionData) {
            for (let i of existingData) {
                if (j.email === i.email && j.password === i.password) {
                    i.event = i.event.filter(event => !(event.eventName === eventName && event.eventDateTime === eventDateTime));
                }
            }
        }

        // Update the local storage
        localStorage.setItem("regusers", JSON.stringify(existingData));
    } else {
        console.error("Row not found!");
    }
}
