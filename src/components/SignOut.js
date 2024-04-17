import React, {Suspense} from 'react';

import { auth } from '../firebase';
//import firebase from 'firebase';
import { useTranslation } from 'react-i18next';


/*
const saveToDB=() => {
const user = firebase.auth().currentUser;
  if (user) {
    console.log('value of user is in saveToDB '+ user.email);
  } else {
      console.log('No user in saveToDB ! ' + user.email);
  }


var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
console.log('User  uid !  (Signout) ' + userId);


const cust = {
  username: username,
  company: company,
  telephoneNumber: telephoneNumber,
  eligible: eligible,
  id: user.email,
  questionnaire:savedHistory,
  date: new Date().toJSON(),
  shouldemail: "no"
}  // JSON.stringify(h)


  const usersRef = firebase.database().ref('/users/' + userId);
  //usersRef.set(cust);
  //localStorage.clear();
//  auth.doSignOut();//NB this would have NO ()if placed in onClick
usersRef.set(cust).then(()=>{
console.log('Successfully set');
console.log("cust  signout" +cust.username +  " "+cust.company +  " "+cust.questionnaire +  " "+cust.telephoneNumber);
localStorage.clear();
auth.doSignOut(); //NB this would have NO ()if placed in onClick

  });

}
*/

//*****************************************
/*db.push().set(values).then(()=>{
console.log('Successfully set');

db.once('value').then((snap)=>{
console.log(snap);

});

});
*/
//***********************************





// / {t("Sign Out")}

const SignOutButton = (props) =>
{const { t, i18n } = useTranslation();
//console.log("££££££££££££££££££££££££££££££££££££££"   +props.language)
return (
  
  <button
    type="button"
    onClick={auth.doSignOut} 
  >
   {props.language==="Portugese"? "Fazer logout": "Sign Out"}
  </button>
  
  )
}
export default SignOutButton;

//{props.language}
//{props.language==="Portugese"? "Sair": "Sign Out"}