//#######################################################################################
//###############################               #########################################
//###############################    GLOBAL     #########################################
//###############################               #########################################
//#######################################################################################

//FIREBASE SETUP#########################################################################
//#######################################################################################

var firebaseConfig = {
    apiKey: "AIzaSyDMzmrdxKVN6eAuytoJkQjQXD5qC4PYVn4",
    authDomain: "studyhelper-a8dad.firebaseapp.com",
    databaseURL: "https://studyhelper-a8dad.firebaseio.com",
    projectId: "studyhelper-a8dad",
    storageBucket: "",
    messagingSenderId: "1075673230676",
    appId: "1:1075673230676:web:68dbf90b086a22d4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Realtime listener for authentication
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser)
        $('#loggedInUserDisplay').text(firebaseUser.email)
        pullEntries(firebaseUser.uid)
        fillStatsModalBody(firebaseUser.uid)
    } else {
        console.log('Logged out.')
        window.location.replace("/");
    }
})

//EVENT LISTENERS########################################################################
//#######################################################################################

//Log out
logoutButton.addEventListener('click', e => {
    firebase.auth().signOut()
    headToLoginPage()
})

$(document).on('click', '#edit_button', function () {
    let dbID = $(this).attr('data-dbID')
    console.log(dbID)
    prepareRecordForEdit(dbID)
})

//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################

//Pull in the entries from database, make cards
function pullEntries(userID) {
    let queryURL = `/allentries/${userID}`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)

        //Draw the cards
        for (var i = 0; i < response.length; i++) {
            let card = $(`<div class='card m-3'></div>`)

            let cardHeader = $(`<div class='card-header'></div>`)
            let cardHeaderRow = $(`<div class='row'></div>`)
            cardHeaderRow.append(`<div class='col-6'><h5>${response[i].date}</h5></div>`)

            //The edit and delete buttons
            cardHeaderRow.append(`
                <div class='col-6 text-right'> 
                <i id='edit_button' data-dbID="${response[i].id}" data-toggle="modal" data-target="#editRecordModal" class="material-icons ml-2" style='font-size: 20px; border-radius: 100%; cursor: pointer'>edit</i>                   
                    <form action="/deleteentry" method="post" style='display: inline'>
                        <input readonly style="display: none" type="text" id=${response[i].id} name='ID' value=${response[i].id}>
                        <button type="submit" class="btn text-warning">
                            <i class="material-icons ml-2" style='font-size: 20px; border-radius: 100%'>clear</i>
                        </button>
                    </form>
                </div>
            `);
            cardHeader.append(cardHeaderRow)

            let cardBody = $(`<div class='card-body'></div>`)
            let cardText = $(`<div class='card-text'></div>`)
            cardText.append(`<p>${response[i].comments}</p>`)
            cardText.append(`<p>Hours studied: ${response[i].hours}</p>`)
            cardText.append(`<p>Programming language: ${response[i].proglang}</p>`)
            cardBody.append(cardText)

            card.append(cardHeader)
            card.append(cardBody)

            $('main').append(card)
        };

        //Prepare for a new entry if necessary
        $('#useridForNewEntry').val(userID)

    });
}

function prepareRecordForEdit(dbID) {
    let queryURL = `/entryByID/${dbID}`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        $('#recordDatabaseID').val(response[0].id)
        $('#dateEdit').val(response[0].date)
        $('#hoursEdit').val(response[0].hours)
        $('#commentsEdit').val(response[0].comments)
        $('#proglangEdit').val(response[0].proglang)
    });
}

function fillStatsModalBody(userID) {
    let queryURL = `/allentries/${userID}`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        let sum = 0;
        for (var i = 0; i < response.length; i++) {
            sum += response[i].hours
        };
        $('#statsModalBody').append(`<p>You have studied for a total of ${sum} hours.</p>`)
    });
}

