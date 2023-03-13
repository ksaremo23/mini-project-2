import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  get,
  set,
  ref,
  update,
  child,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MSG_SENDER_ID,
  appId: process.env.APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Initialize Variables
// const auth = getAuth(app);
const database = getDatabase(app);

const username = document.getElementById("username");
const email = document.getElementById("emailReg");
const password = document.getElementById("passwordReg");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const contactNumber = document.getElementById("contactNumber");
const address = document.getElementById("address");
const login = document.getElementById("login");
const register = document.getElementById("register");

//Validation
function isEmpty(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function validation() {
  //using regular expression
  let nameregex = /^[a-zA-Z]+$/;
  //standard email expression
  let emailregex =
    /^(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  let userregex = /^[a-zA-Z0-9]{5,}$/;

  if (
    isEmpty(username.value) ||
    isEmpty(email.value) ||
    isEmpty(password.value) ||
    isEmpty(firstName.value) ||
    isEmpty(lastName.value) ||
    isEmpty(address.value) ||
    isEmpty(contactNumber.value)
  ) {
    alert("All fields must not be empty");
    return false;
  }

  if (!nameregex.test(firstName.value)) {
    alert("Name must contains alphabet only");
    return false;
  }

  if (!nameregex.test(lastName.value)) {
    alert("Name must contains alphabet only");
    return false;
  }

  if (!emailregex.test(email.value)) {
    alert("Enter a valid email");
    return false;
  }

  if (!userregex.test(username.value)) {
    alert("Name must contains alphanumeric value");
    return false;
  }
  return true;
}

function registerUser() {
  if (!validation()) {
    return;
  }
  const dbRef = ref(database);
  get(child(dbRef, "users/" + username.value))
    .then((snapshot) => {
      if (snapshot.exists()) {
        alert("User already exist");
      } else {
        set(ref(database, "users/" + username.value), {
          username: username.value,
          email: email.value,
          password: encryptPass(),
          firstName: firstName.value,
          lastName: lastName.value,
          contactNumber: contactNumber.value,
          address: address.value,
        })
          .then(() => {
            alert("Registered Sucessfully");
          })
          .catch((error) => {
            let errorMessage = error.message;
            alert(errorMessage);
          });
      }
    })
    .catch((error) => {
      let errorMessage = error.message;
      alert(errorMessage);
    });
}
//password encryption
function encryptPass() {
  let pass = CryptoJS.AES.encrypt(password.value, password.value);
  return pass.toString();
}
register.addEventListener("click", registerUser);

function authUser() {
  const dbRef = ref(database);
  let username = document.getElementById("usernameLogin");
  let password = document.getElementById("passwordLogin");
  get(child(dbRef, "users/" + username.value))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let dte = new Date();
        let dbpass = decryptPass(snapshot.val().password);
        if (dbpass == password.value) {
          update(ref(database, "users/" + username.value), {
            lastLoggedIn: dte,
          });
          loggedIn(snapshot.val());
        } else {
          alert("username or password is invalid");
        }
      } else {
        alert("username or password is invalid");
      }
    })
    .catch((error) => {
      let errorMessage = error.message;
      alert(errorMessage);
    });
}
login.addEventListener("click", authUser);

//decrypt password
function decryptPass(dbpass) {
  let password = document.getElementById("passwordLogin");
  let pass = CryptoJS.AES.decrypt(dbpass, password.value);
  return pass.toString(CryptoJS.enc.Utf8);
}

function loggedIn(user) {
  let keepLoogedIn = document.getElementById("keepLoginSwitch").checked;

  if (!keepLoogedIn) {
    sessionStorage.setItem("user", JSON.stringify(user));
    window.location = "homepage.html";
  } else {
    localStorage.setItem("keepLoggedIn", "yes");
    localStorage.setItem("user", JSON.stringify(user));
    window.location = "homepage.html";
  }
}
