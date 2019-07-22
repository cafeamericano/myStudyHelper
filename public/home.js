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
    } else {
        console.log('Logged out.')
        window.location.replace("index.html");
    }
})

//EVENT LISTENERS########################################################################
//#######################################################################################

//Log out
logoutButton.addEventListener('click', e => {
    firebase.auth().signOut()
    window.location.replace("../index.html");
})
//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################

//Pull in the entries from database, make cards
$.ajax({
    url: `/allentries`,
    method: "GET",
}).then(function (response) {
    console.log(response)
    for (var i = 0; i < response.length; i++) {
        let card = $(`<div class='card m-2'></div>`)

        let cardHeader = $(`<div class='card-header'></div>`)
        cardHeader.append(`<h5>${response[i].date}</h5>`)

        let cardBody = $(`<div class='card-body'></div>`)
        let cardText = $(`<div class='card-text'></div>`)
        cardText.append(`<p>${response[i].comments}</p>`)
        cardText.append(`<p>Hours studied: ${response[i].hours}</p>`)
        cardBody.append(cardText)

        card.append(cardHeader)
        card.append(cardBody)

        $('main').append(card)
    }
});

