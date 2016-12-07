var config = {
    apiKey: "AIzaSyDeIDNW1wJmuUvA5emM9oxL3TcJ1ExVCI8",
    authDomain: "greetingworld-d6e18.firebaseapp.com",
    databaseURL: "https://greetingworld-d6e18.firebaseio.com",
    storageBucket: "greetingworld-d6e18.appspot.com",
    messagingSenderId: "847595638131"
};

firebase.initializeApp(config);
var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function() {

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var arrivalTime = $("#arrival-time").val().trim();
    var tFrequency = $("#frequency").val().trim();

    var firstArrival = moment(arrivalTime, "hh:mm");
    console.log("FIRST ARRIVAL " + firstArrival);
   
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstArrival), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextArrivalTime = moment(nextTrain).format("hh:mm")
    console.log("ARRIVAL TIME: " + nextArrivalTime);
    // Creates local "temporary" object for holding employee data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        nextArrivalTime: nextArrivalTime,
        tFrequency: tFrequency,
        minutesAway: tMinutesTillTrain
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName + ' ' +
        newTrain.destination + ' ' + newTrain.nextTrain + ' ' + newTrain.tFrequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#arrival-time").val("");
    $("#frequency").val("");

    // Prevents moving to new page
    return false;
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var nextArrivalTime = childSnapshot.val().nextArrivalTime;
    var tFrequency = childSnapshot.val().tFrequency;
    var minutesAway = childSnapshot.val().minutesAway;

    console.log(trainName);
    console.log(destination);
    console.log(nextArrivalTime);
    console.log(tFrequency);
    console.log(minutesAway);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        tFrequency + "</td><td>" + nextArrivalTime + "</td><td>" + minutesAway + "</td></tr>");
});
