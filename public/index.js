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

//Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser)
        window.location.replace("home.html");
    } else {
        console.log('not logged in')
    }
})

//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################


//VARIABLES##############################################################################
//#######################################################################################

const inputEmail = document.getElementById('inputEmail')
const inputPassword = document.getElementById('inputPassword')
const loginButton = document.getElementById('loginButton')
const signUpButton = document.getElementById('signUpButton')

//EVENT LISTENERS########################################################################
//#######################################################################################

//Login
$(document).on('submit', '#loginForm', function () {
    event.preventDefault()
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function (error) {
        if (error.message === 'The email address is badly formatted.') {
            M.toast({ html: 'The email provided is not a valid email address.' })
        } else if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
            M.toast({ html: 'The entered email address is incorrect.' })

        } else if (error.message === 'The password is invalid or the user does not have a password.') {
            M.toast({ html: 'The entered password is incorrect.' })
        }
    });
})

//Sign up
signUpButton.addEventListener('click', e => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise
        //.then(user => console.log(user))
        .catch(e => console.log(e.message));
})