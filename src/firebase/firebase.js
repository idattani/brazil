import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAoDi93bpWHyYIk7qkJraZfN-_i-dyjdEs",
  authDomain: "security-assessment-3e600.firebaseapp.com",
  databaseURL: "https://security-assessment-3e600-default-rtdb.firebaseio.com",
  projectId: "security-assessment-3e600",
  storageBucket: "security-assessment-3e600.appspot.com",
  messagingSenderId: "786998979578",
  appId: "1:786998979578:web:25d6e2c1e2179502dfd243"
};
firebase.initializeApp(config);


  if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
  auth,
};
