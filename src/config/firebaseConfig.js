import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyCD9QQGmoa5buBNmd_CvMd5NMqyLvs-Tls",
  authDomain: "bbbaden-m150.firebaseapp.com",
  databaseURL: "https://bbbaden-m150.firebaseio.com"
}

firebase.initializeApp(config);

export function firebaseListener(func) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // console.log("User log in success", user);
      func(true, user)
    } else {
      // console.log("User log in failed", user);
      func(false)
    }
  }, function(error) {
    console.log(error)
  });
}

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
