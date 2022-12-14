// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyClMJYXEWmV4nwkEzCqJH0BlTfarDc3GuA",
  authDomain: "example-c0518.firebaseapp.com",
  projectId: "example-c0518",
  storageBucket: "example-c0518.appspot.com",
  messagingSenderId: "18628960913",
  appId: "1:18628960913:web:5ca1d0d9d54552d61b5530",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()


var storeuid;
var datelogin;

// Calculate milliseconds in a year
const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;


var total_bal =0
var total_int =0
var day_change =0

// Set up our register function


function register () {
  // Get all our input fields
  signup_email = document.getElementById('signup_email').value
  signup_password = document.getElementById('signup_password').value
  signup_name = document.getElementById('signup_name').value

  amount =0
  

  // Validate input fields
  if (validate_email(signup_email) == false || validate_password(signup_password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  if (validate_field(signup_name) == false) {
    alert('One or More Extra Fields is Outta Line!!')
    return
  }
 
  // Move on with Auth
  auth.createUserWithEmailAndPassword(signup_email, signup_password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : signup_email,
      full_name : signup_name,
      password : signup_password,
      total_bal : total_bal,
      total_int : total_int,
      day_change : day_change,
      amount : amount,
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // DOne
    alert('User Created!!')
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}








// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser
    
    // Add this user to Firebase Database
    var database_ref = database.ref()
    storeuid = user
   
    

    // Done
  //   alert('User Logged In!!')



  document.getElementById("page1").style.display = "none";
  $("#page2").css("display", "flex");
  document.getElementById("triggerloginclose").click();


  var user_ref = database.ref('users/' + user.uid)
  user_ref.on('value', function(snapshot) {
    var data = snapshot.val()

    // Whatever data we want to access
    
    document.getElementById("name").innerHTML = data.full_name;
    document.getElementById("totalbal").innerHTML = data.total_bal;
    document.getElementById("totabal").innerHTML = data.total_bal;
    document.getElementById("totalint").innerHTML = data.total_int;
    document.getElementById("daychange").innerHTML = data.day_change;
    datelogin = data.last_login;
    total_bal =data.total_bal;
    total_int =data.total_int;



    // User data update of Balance and interest by day change
      let dayscurr = Math.round(Date.now() / day);
      let dayslast = Math.round(datelogin / day);
    if(dayscurr>dayslast)
    {
      day_change= (dayscurr-dayslast)*0.037/100*total_bal;

    
      var user_data = {
        last_login : Date.now(),
        total_bal : (Math.round((total_bal+day_change) * 100) / 100).toFixed(2),
        total_int : (Math.round((total_int+day_change) * 100) / 100).toFixed(2),
        day_change :(Math.round((day_change) * 100) / 100).toFixed(2)
      }
    }
    else{
      var user_data = {
        last_login : Date.now(),
        total_bal : total_bal,
        total_int : total_int
      }
    }

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)

      })
      .catch(function(error) {
        // Firebase will use this to alert of its errors
        var error_code = error.code
        var error_message = error.message

        alert(error_message)
      })

      })
  
}



// adding Money to be withdrawn by user
// storeuid variable stores user id of whose user to be updated
function updates () {
  
  var database_ref = database.ref()
  var user_ref = database.ref('users/' + storeuid.uid)
  // Create User data
  var user_data = {
    amount : document.getElementById('amount').value
  }

  // Push to Firebase Database
  database_ref.child('users/' + storeuid.uid).update(user_data)
  document.getElementById("submitbtn").click();

}








// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
