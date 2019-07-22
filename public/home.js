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

$.ajax({
    url: `/allentries`,
    method: "GET",
}).then(function (response) {
    console.log(response)
    for (var i = 0; i < response.length; i++) {
        let div = $(`<div class='card'></div>`)
        div.append(`<p>${response[i].date}</p>`)
        div.append(`<p>${response[i].comments}</p>`)
        div.append(`<p>${response[i].hours}</p>`)
        $('main').append(div)
    }
});