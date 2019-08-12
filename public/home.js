//FIREBASE SETUP#########################################################################

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

//Contain active user
let activeUser = ''

//Realtime listener for authentication
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser)
        $('#loggedInUserDisplay').text(firebaseUser.email)
        activeUser = firebaseUser.uid //Grab this value for later use
        pullEntries(firebaseUser.uid) //Pull up user's entries when page loads
        makeLineChart(firebaseUser.uid) //Have this ready to show upon clicking of stats page
    } else {
        console.log('Logged out.')
        window.location.replace("/");
    }
})

//EVENT LISTENERS########################################################################

//Log out button clicked
logoutButton.addEventListener('click', e => {
    firebase.auth().signOut()
})

//Edit record button clicked
$(document).on('click', '#edit_button', function () {
    let dbID = $(this).attr('data-dbID')
    console.log(dbID)
    prepareRecordForEdit(dbID)
})

//Delete record button clicked
$(document).on('click', '#delete_button', function () {
    let dbID = $(this).attr('data-dbID')
    deleteRecordFromDatabase(dbID)
    $(this).parent().parent().parent().parent().fadeOut()
})

//Hours by time tab clicked
$(document).on('click', '#hoursByTime', function () {
    $('#statsModalBody').empty()
    makeLineChart(activeUser)
})

//Hours by language tab clicked
$(document).on('click', '#hoursByLanguage', function () {
    $('#statsModalBody').empty()
    makePieChart(activeUser)
})

//Hours by total tab clicked
$(document).on('click', '#hoursByTotal', function () {
    $('#statsModalBody').empty()
    determineTotalHoursStudied(activeUser)
})

//FUNCTIONS#########################################################################


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
            cardHeaderRow.append(`<div class='col-6'><h5>${moment(response[i].date).add(12, 'hours').format('MM/DD/YYYY')}</h5></div>`) // Push from midnight to noon - incorrectly reports previous day at midnight

            //The edit and delete buttons
            cardHeaderRow.append(`
                <div class='col-6 text-right'> 
                    <i id='edit_button' data-dbID="${response[i].id}" data-toggle="modal" data-target="#editRecordModal" class="material-icons ml-2" style='font-size: 20px; border-radius: 100%; cursor: pointer'>edit</i>                   
                    <i id='delete_button' data-dbID="${response[i].id}" class="material-icons ml-2" style='font-size: 20px; border-radius: 100%; cursor: pointer'>clear</i>
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

//Edit record preparation
function prepareRecordForEdit(dbID) {
    let queryURL = `/entryByID/${dbID}`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        $('#recordDatabaseID').val(response[0].id)
        let formattedDate = moment(response[0].date).add(12, 'hours').format('YYYY-MM-DD') // Push from midnight to noon - incorrectly reports previous day at midnight
        console.log(formattedDate)
        $('#dateEdit').val(formattedDate)
        $('#hoursEdit').val(response[0].hours)
        $('#commentsEdit').val(response[0].comments)
        $('#proglangEdit').val(response[0].proglang)
    });
}

//Delete record perform
function deleteRecordFromDatabase(dbID) {
    let queryURL = `/deleteentry`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "POST",
        data: {
            ID: dbID
        }
    }).then(function (response) {
        console.log('Deleted record')
    })
}

//Pull last 60 days into an array
function pullLast60Days() {
    var startPoint = moment().subtract(2, 'months')
    var endPoint = moment().startOf('startPoint');

    var datesArr = [];

    while (startPoint <= endPoint) {
        datesArr.push(startPoint.format('YYYY-MM-DD'));
        startPoint = startPoint.clone().add(1, 'd');
    }

    return datesArr
}

//Line chart tab
function makeLineChart(userID) {

    $('#hoursByLanguage').removeClass('active')
    $('#hoursByTotal').removeClass('active')
    $('#hoursByTime').addClass('active')
    //Make the API call
    let queryURL = `/allentries/${userID}`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        let hours = []
        let dates = []
        for (var i = 0; i < response.length; i++) {
            if (response[i].hours <= 12) { //Limit graphed items to single-day sessions
                hours.push(response[i].hours)
                dates.push(moment(response[i].date).add(12, 'hours').format('YYYY-MM-DD'))
            }
        };

        let last60DaysArray = pullLast60Days()
        let recordCount = response.length
        let comprehensiveLastSixtyDaysArray = []
        for (i = 0; i < last60DaysArray.length; i++) {
            let valueToInsert = 0;
            for (j = 0; j < recordCount; j++) {
                if (last60DaysArray[i] === response[j].date) {
                    valueToInsert += 1
                }
            }
            comprehensiveLastSixtyDaysArray.push(valueToInsert)
        }
        console.log(last60DaysArray)
        console.log(comprehensiveLastSixtyDaysArray)

        //Prepare the modal for new data
        $('#statsModalBody').append(`<canvas id="myChart"></canvas>`)

        //Create the new chart
        var ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last60DaysArray,
                datasets: [{
                    label: 'Hours',
                    data: hours.reverse(),
                    backgroundColor: 'rgba(158, 88, 65, 0.5)'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    })
};

//Pie chart tab
function makePieChart(userID) {
    $('#hoursByTime').removeClass('active')
    $('#hoursByTotal').removeClass('active')
    $('#hoursByLanguage').addClass('active')
    let queryURL = `/allentries/${userID}`
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        //Find the unique languages
        let languages = []
        let hours = []
        for (i = 0; i < response.length; i++) {
            if (response[i].proglang !== '') {
                languages.push(response[i].proglang)
                hours.push(response[i].hours)
            }
        };
        let protoUniqueLanguages = new Set(languages)
        let uniqueLanguages = Array.from(protoUniqueLanguages)
        console.log(uniqueLanguages)

        //Gather totals for each unique language
        let hourSums = []
        for (i = 0; i < uniqueLanguages.length; i++) {
            let thisLanguageTotal = 0;
            for (j = 0; j < response.length; j++) {
                if (response[j].proglang === uniqueLanguages[i]) {
                    thisLanguageTotal += response[j].hours
                }
            };
            hourSums.push(thisLanguageTotal)
        };

        //Prepare the modal for new data
        $('#statsModalBody').append(`<canvas id="myChart"></canvas>`)

        //Create the new chart
        var ctx = document.getElementById('myChart').getContext('2d');
        data = {
            datasets: [{
                data: hourSums,
                backgroundColor: ["rgb(207, 156, 138)", "rgb(237, 153, 147)", "rgb(158, 88, 65)", "rgb(227, 224, 197)", "rgb(194, 123, 100)", "rgb(207, 156, 138)", "rgb(237, 153, 147)", "rgb(158, 88, 65)", "rgb(227, 224, 197)", "rgb(194, 123, 100)"]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: uniqueLanguages
        };
        options = {
        }
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });


    })
};

//Total hours tab
function determineTotalHoursStudied(userID) {
    $('#hoursByTime').removeClass('active')
    $('#hoursByLanguage').removeClass('active')
    $('#hoursByTotal').addClass('active')
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
        $('#statsModalBody').append(`<p class='text-center'>You have studied for a total of ${sum} hours.</p>`)
    });
}