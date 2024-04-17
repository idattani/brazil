import React, { Component } from 'react';

//import './App.js';

import Block from './Block/Block.js';
import Question from './Question/Question.js';
import ModalFinish from './ModalFinish/ModalFinish';

//import AuthUserContext from './AuthUserContext';
import withAuthorization from './withAuthorization';
import firebase from 'firebase';
//import { auth } from '../firebase';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const db = firebase.firestore();

const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  // padding: "60px",
  // margin: "20px",
  textAlign: "justify",
  //WebkitTransition: 'all', // note the capital 'W' here
  //msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};
const inlineHeader={//padding: "60px",
margin: "20px",
display: "inline",
fontSize: "1.5em",
marginTop: "0.83em",
marginBottom: "0.83em",
marginLeft: "0",
marginRight: "0",
fontWeight: "bold",
color: "#02397f"
}

const answerText={textAlign: "justify"}


class HomePage extends Component {

//lsh=null;

// start and end are not used. Only for clarity. It is the array order that is used
dbBlocks= [
  {start: '1', end: '7',  blockHeader: 'Maintain Data Governance',
  blockBody: 'When processing personal data'},

  {start: '8', end: '13', blockHeader: 'Acquire, Identify and Classify Personal Data',
  blockBody: 'The acquisition of new personal data'},

  {start: '14', end: '17', blockHeader: 'Manage Personal Data Risk',
  blockBody: 'Personal data processing is subject to a number'},

{start: '18', end: '23', blockHeader: 'Manage Personal Data Security',
blockBody: 'Personal data processing requires adequate and comprehensive security'},

{start: '24', end: '28', blockHeader: 'Manage the Personal Data Supply Chain',
blockBody: 'Where personal data is processed by more than one organization'},

{start: '29', end: '32',blockHeader: 'Manage Incidents and Breaches',
blockBody: 'DPP-related incidents and breaches should be reported'},

{start: '33', end: '35', blockHeader: 'Create and Maintain Awareness',
blockBody: 'Data protection and privacy (DPP) as fundamental values within'},

{start: '36', end: '40', blockHeader: 'Organize DPO Function',
blockBody: 'Established privacy and data protection regulations mandate'},

{start: '41', end: '46', blockHeader: 'Maintain Internal Controls',
blockBody: 'Personal data processing in accordance with established privacy'}


]

dbFA=require('./fa.js');
dbLA=require('./la.js');
dbPA=require('./pa.js');
dbNA=require('./na.js');

dbHeader=['Has your organisation established a Data Protection and Privacy (DPP) Governance Framework',
'Does your organisation maintain a Data Processing Register',
'Does your organisation maintain Binding Corporate Rules (BCRs)',
'Does your organisation maintain Rules for Consent',
'Does your organisation maintain Rules for Data Subject Requests',
'Does your organisation maintain Rules for Managing Complaints',
'Does your organisation ensure Impartial Oversight',
'Does your organisation manage the Data Life Cycle',
'Does your organisation conduct Personal Data Identification',
'Does your organisation maintain Data Classification',
'Does your organisation maintain a Personal Data Register',
'Does your organisation manage Special Categories Data',
'Does your organisation demands for erasure (Right to be Forgotten)',
'Has your organisation conducted a Risk Evaluation',
'Has your organisation conducted a Data Protection Impact Assessment (DPIA)',
'Does your organisation manage Risk Treatment',
'Does your organisation conduct Risk Validation',
'Does your organisation manage Data Anonymization and Pseudonymization',
'Does your organisation have an Encryption Strategy',
'Does your organisation manage Protection Levels',
'Does your organisation manage Resilience',
'Does your organisation manage access to personal data',
'Does your organisation manage Testing and Assessment of Personal Data Security',
'Does your organisation manage Controllers and Processors',
'Do you manage Sub-processing',
'Does your organisation maintain Processing Agreements',
'Does your organisation manage Supply Chain Impact',
'Does your organisation maintain Supply Chain Controls',
'Does your organisation manage notifications of supervisory authorities',
'Does your organisation manage Data Subject Communications',
'Does your organisation perform Incident and Crisis Management',
'Does your organisation manage Evidence and Claims',
'Does your organisation maintain Enterprise-wide Awareness',
'Does your organisation manage Skills and Education',
'Does your organisation provide Training',
'Does your organisation have Data Protection Officer (DPO) Function',
'Does your organisation manage Budget and Resources of the DPO function',
'Does your organisation manage Organisational Interfaces',
'Do you manage Reporting',
'Does your organisation manage External Services',
'Does your organisation maintain Data Acquisition Controls',
'Does your organisation maintain Processing Controls',
'Does your organisation maintain Storage Controls',
'Does your organisation maintain Deletion Controls',
'Does your organisation maintain Monitoring Controls',
'Is your Organisation prepared to manage independent reviews'

]



/* https://github.com/kolodny/immutability-helper */
 /*setState() also accepts a function. The function accepts the previous state and current props of the component
    which it uses to calculate and return the next state. */



toggleModal = () => {
  // this.setState({
  //   isOpen: !this.state.isOpen
  // });
  this.handleClickOpen();
}

 setBlockToCorrespondToQuestion= (cqn) =>{
   cqn=cqn+1;
  if(cqn >=1 && cqn <=7  ){this.setState( {currentBlock: 0 } );return;}
  if(cqn >=8 && cqn<=13  ) {this.setState( {currentBlock: 1 } );return;}
  if(cqn >=14 && cqn<=17  ){this.setState( {currentBlock: 2} );return;}
  if(cqn >=18 && cqn<=23  ){this.setState( {currentBlock: 3 } );return;}
  if(cqn >=24 && cqn<=28  ){this.setState( {currentBlock: 4 } );return;}
  if(cqn >=29 && cqn<=32 ){this.setState( {currentBlock: 5 } );return;}
  if(cqn >=33 && cqn<=35 ){this.setState( {currentBlock: 6 } );return;}
  if(cqn >=36 && cqn<=40 ){this.setState( {currentBlock: 7 } );return;}
  if(cqn >=41 && cqn<=46 ){this.setState( {currentBlock: 8 } );return;}

}
  nextQuestionHandler= () => {//cqn is the array index NOT the number

    console.log('Next was clicked ...previous question index' + this.state.currentQuestion)
    let cqn=this.state.currentQuestion +1;
    this.setBlockToCorrespondToQuestion(cqn);
      console.log('Next was clicked ...current question number' + cqn)
    if (cqn>45) {cqn=45;} else this.setState( {currentQuestion: cqn });
  }

  previousQuestionHandler= () => {
    //console.log('Next was clicked ...original question number' + this.state.currentQuestion)
    let cqn=this.state.currentQuestion -1;
    this.setBlockToCorrespondToQuestion(cqn);//if (choice ==0) style.backgroundColor='yellow';lockToCorrespondToQuestion(cqn);
    if (cqn<0) {cqn=0;} else this.setState( {currentQuestion: cqn });
  }

  historyHandler= (choice) => {
  let  h= [...this.state.history];
  const q=this.state.currentQuestion;
  h[q]=choice;
  console.log('new history ' + h[0] +' ' +h[1]+' ' +h[2] +' ' +h[3]  +' ' +h[4]   );
  this.setState( {history: h})
  //console.log("Home authUser"+ authUser);
  //localStorage.setItem("questionnaire", JSON.stringify(h));
  }

  anyNotAnswered= (h) =>{   //change to 46!!!!!!!
    let notAnswered=true;
    let i;
    for (i = 0; i < 46; i++) { //46
            if (h[i]===0)  { alert("You have not answered question " +(i+1)); return notAnswered;}
                }
              return false;}





questionBodyFn=()=>{
  const { t } = this.props;
  if(this.state.history[this.state.currentQuestion]===0 ) {return ' ';}
  else if(this.state.history[this.state.currentQuestion]===4 ) {return <span style={answerText}> {t(`privacy_data_protection.recommendations.${this.dbNA[this.state.currentQuestion]}`)}</span>;}
  else
    if(this.state.history[this.state.currentQuestion]===3 ) {return <span style={answerText}> {t(`privacy_data_protection.recommendations.${this.dbPA[this.state.currentQuestion]}`)}</span>;}
    else
      if(this.state.history[this.state.currentQuestion]===2 ) {return <span style={answerText}> {t(`privacy_data_protection.recommendations.${this.dbLA[this.state.currentQuestion]}`)}</span>;}
      else
      if(this.state.history[this.state.currentQuestion]===1) {return <span style={answerText}> {t(`privacy_data_protection.recommendations.${this.dbFA[this.state.currentQuestion]}`)}</span>;}
    }
// var element = document.getElementById('myElement'); // grab a reference to your element
// element.addEventListener('click', clickHandler);



/* 0 means no answer to question, 1 FA, 2 LA, 3 PA, 4 NA     pretending there are just 3 questions*/

// order of invocation
//constructor()
//static getDerivedStateFromProps()
//render()
//componentDidMount()


constructor(props){
super(props);

this.state = {
  externalData: null,
  open: false,
  dialogText: null
};

this.finishedHandler = this.finishedHandler.bind(this);
this.historyHandler=this.historyHandler.bind(this);
this.questionBodyFn=this.questionBodyFn.bind(this);
this.anyNotAnswered=this.anyNotAnswered.bind(this);
this.previousQuestionHandler=this.previousQuestionHandler.bind(this);
this.nextQuestionHandler=this.nextQuestionHandler.bind(this);
this.retrieveHandler=this.retrieveHandler.bind(this);
this.saveHandler=this.saveHandler.bind(this);
this.findCurrentQuestion=this.findCurrentQuestion.bind(this);

 //https://firebase.google.com/docs/auth/web/manage-users
 //const user = firebase.auth().currentUser;
 /* let userId = firebase.auth().currentUser.uid; 
 if (userId) {
   console.log('value of userId is  Home '+ userId );
 } else {
     console.log('No user ! Home' + userId);
 }



const usersRef = firebase.database().ref('/combinedusers/' + userId );
 usersRef.on("value").then( (snapshot) => {
//NB the lexical scoping  => is necessary
        let childData = snapshot.val();
 
          let questionnaire=childData.questionnaire;  
          console.error('value of questionnaire is '+ questionnaire );
          console.error('value of username is  '+ childData.username );
          let currentQuestion=parseInt(childData.currentQuestion,10);
          let currentBlock=parseInt(childData.currentBlock,10);
          console.error('value of currentQuestion Home is  '+ currentQuestion );
          console.error('value of currentBlock Home is  '+ currentBlock );
          this.state =
          { history: JSON.parse(questionnaire),
            company:childData.company,
            username:childData.username,
            eligible:childData.eligible,
            telephoneNumber:childData.telephoneNumber,
            signupdate:childData.signupdate,
            questionnaire:childData.questionnaire,
            shouldemail:childData.shouldemail,
            currentQuestion:currentQuestion,
            currentBlock:currentBlock
          }
// / refresh:childData.refresh    isOpen: childData.isOpen,

    } //end of snapshot function
    ) // end of on
*/

}


componentDidMount() {
  let userId = firebase.auth().currentUser.uid; 
  if (userId) {
    //console.log('value of userId is  Home '+ userId );
  } else {
     // console.log('No user ! Home' + userId);
  }
 
 const usersRef = firebase.database().ref('/combinedusers/' + userId );
  usersRef.on("value", (snapshot) => {
 //NB the lexical scoping  => is necessary
         let childData = snapshot.val();
  
           let questionnaire=childData.questionnaire;  
           console.error('value of questionnaire is '+ questionnaire );
           console.error('value of username is  '+ childData.username );
           let currentQuestion=parseInt(childData.currentQuestion,10);
           let currentBlock=parseInt(childData.currentBlock,10);
           console.error('value of currentQuestion Home is  '+ currentQuestion );
           console.error('value of currentBlock Home is  '+ currentBlock );
           //console.error('value of childData.assessmen Home is  '+ childData.assessment );
           let shouldemail;
           if (childData.shouldemail === undefined) {shouldemail= "no";}
           else 
             {shouldemail=childData.shouldemail;} 
           
           
           this.setState(
           { language: childData.language,
           // assessment:childData.assessment,
            history: JSON.parse(questionnaire),
             company:childData.company,
             username:childData.username,
             eligible:childData.eligible,
             telephoneNumber:childData.telephoneNumber,
             signupdate:childData.signupdate,
             questionnaire:childData.questionnaire,
             shouldemail:shouldemail,
             currentQuestion:currentQuestion,
             currentBlock:currentBlock,
             externalData:"true"
           } );
           this.forceUpdate();
 // / refresh:childData.refresh    isOpen: childData.isOpen,
 
          }
     ) // end of on
 
 
}
/* componentWillUnmount() {
  if (this._asyncRequest) {
    this._asyncRequest.cancel();
  }
}
*/


/*
**************************************************
let itemsRef2 = firebase.database().ref('/treatmentsData/' + patientId);
await itemsRef2.once('value').then (
  (snapshot)=>{  
**************************************






componentDidUpdate(){
 this.setState(this.state);
   console.log("In componentDidUpdate"+this.state.history);
} */


saveHandler=(e)=>{
  e.preventDefault();
  const h=this.state.history;
  const { t } = this.props;


  //https://firebase.google.com/docs/auth/web/manage-users
  /*const user = firebase.auth().currentUser;
    if (user) {
      console.log('value of user is  saveHandler'+ user.email);
    } else {
        console.log('No user ! saveHandler' + user.email);
    }

*/
  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  console.log('User  uid !  (saveHandler) ' + userId);


//SEE https://stackoverflow.com/questions/40589397/firebase-db-how-to-update-particular-value-of-child-in-firebase-database
    const usersRef = firebase.database().ref('/combinedusers/' + userId );

    usersRef.update({questionnaire: JSON.stringify(h), 
      date: new Date().toJSON(),
      shouldemail: "no",
    currentQuestion:this.state.currentQuestion.toString(),
  currentBlock:this.state.currentBlock.toString()

});
    this.setState({dialogText: t('Your answers have been saved to the server')});
    this.toggleModal(); //want to display finishing modal
    //set({questionnaire: JSON.stringify(h)});
    // Should now make eligible !== "true" in case someone else uses the browser?

  }





finishedHandler= (e) => {
e.preventDefault();
const h=this.state.history;
const { t } = this.props;

if (this.anyNotAnswered(h) ===false) { // only post if complete
console.log('finished ' + h[0] +h[1] +h[2]+ h[3] +h[4]+h[5]+ h[6] +h[7]+h[8]+ h[9]  +h[10]+h[11]+ h[12] +h[13] +h[14]+ h[15]  );

const progress = this.calculateProgress();
/* console.log('privacyandprotection progress', progress); */

this.setState({dialogText: t('Your answers have been submitted to the server')});
this.toggleModal(); //want to display finishing modal

//https://firebase.google.com/docs/auth/web/manage-users
const user = firebase.auth().currentUser;
  if (user) {
    //console.log('value of user is  '+ user.email);
  } else {
     // console.log('No user ! ' + user.email);
  }


  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  console.log('User  uid !  (Home) ' + userId);

  const firestoreUserRef = db.collection("users").doc(userId);
  firestoreUserRef.update({
    isPrivacySurveyCompleted: true,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  const firestoreSurveyRef = db.collection("privacySurvey");
  firestoreSurveyRef.add({
    userId,
    data: progress,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
 
  const usersRef = firebase.database().ref('/combinedusers/' + userId);
  //usersRef.update(cust);

  usersRef.update({questionnaire: JSON.stringify(h), date: new Date().toJSON(),
    shouldemail: "yes",
    currentQuestion:this.state.currentQuestion.toString(),
    currentBlock:this.state.currentBlock.toString(),
    uid:userId
  });


  // Should now make eligible !== "true" in case someone else uses the browser
  this.sendDashboardEmail();
  
}
}

sendDashboardEmail = (e) => {
  let dashboardEmail = firebase.functions().httpsCallable('sendEmailOnAssessmentsCompletion');
  dashboardEmail({ text: 'testing........' })
  .then((result) => {
    // Read result of the Cloud Function.
    var sanitizedMessage = result.data.text;
    console.log('sanitizedMessage', sanitizedMessage);
  })
  .catch((error) => {
    // Getting the Error details.
    var code = error.code;
    var message = error.message;
    var details = error.details;
    console.log(code, message, details);
    // ...
  });
}

calculateProgress = () => {
  const h = this.state.history;
  let progress = [];
  progress.push({id: 0, ...this.calculateProgressScore(0, 7, 'Maintain Data Governance')});
  progress.push({id: 1, ...this.calculateProgressScore(7, 13, 'Acquire, Identify and Classify Personal Data')});
  progress.push({id: 2, ...this.calculateProgressScore(13, 17, 'Manage Personal Data Risk')});
  progress.push({id: 3, ...this.calculateProgressScore(17, 23, 'Manage Personal Data Security')});
  progress.push({id: 4, ...this.calculateProgressScore(23, 28, 'Manage the Personal Data Supply Chain')});
  progress.push({id: 5, ...this.calculateProgressScore(28, 32, 'Manage Incidents and Breaches')});
  progress.push({id: 6, ...this.calculateProgressScore(32, 35, 'Create and Maintain Awareness')});
  progress.push({id: 7, ...this.calculateProgressScore(35, 40, 'Organize DPO Function')});
  progress.push({id: 8, ...this.calculateProgressScore(40, 46, 'Maintain Internal Controls')});

  return progress;
};


calculateProgressScore = (start, end, category) => {
  const selectedAnswers = this.state.history;

  const answers = selectedAnswers.slice(start, end);
  const hundredPercent = answers.filter(val => val === 1).length;
  const fiftyToNinetyNinePercent = answers.filter(val => val === 2).length;
  const tenToFourtyNinePercent = answers.filter(val => val === 3).length;
  const zeroToNinePercent = answers.filter(val => val === 4).length;

  const obj = { hundredPercent, fiftyToNinetyNinePercent, tenToFourtyNinePercent, zeroToNinePercent };
	const frequencies = Object.values(obj);
  const greatest = frequencies.sort().pop();
  const { progress, progressScore } = this.getProgressAndProgressScore(obj, frequencies, greatest);
  
  return {
    answers,
    category,
    progress,
    progressScore,
    hundredPercent,
    fiftyToNinetyNinePercent,
    tenToFourtyNinePercent,
    zeroToNinePercent
  };
};

getProgressAndProgressScore = (obj, frequencies, greatest) => {
  if (new Set(frequencies).size !== frequencies.length) {
    let matched = Object.keys(obj).filter((key)=> obj[key] === greatest);
    if (matched.includes('zeroToNinePercent')) {
      return { progress: '0 - 9%', progressScore: 100 };
    } else if (matched.includes('tenToFourtyNinePercent')) {
      return { progress: '10 - 49%', progressScore: 75 };
    } else if (matched.includes('fiftyToNinetyNinePercent')) {
      return { progress: '50 - 99%', progressScore: 50 };
    } else {
      return { progress: '100%', progressScore: 0 };
    }
  } else {
    const key = Object.keys(obj).find( k => obj[k] === greatest);
    if (key === 'zeroToNinePercent') {
      return { progress: '0 - 9%', progressScore: 100 };
    } else if (key === 'tenToFourtyNinePercent') {
      return { progress: '10 - 49%', progressScore: 75 };
    } else if (key === 'fiftyToNinetyNinePercent') {
      return { progress: '50 - 99%', progressScore: 25 };
    } else {
      return { progress: '100%', progressScore: 0 };
    }
  }
}

//simulateClick=(e)=> {
//    if (e!=null) e.click();
//  }

retrieveHandler=(e)=>{  //WILL NOT USE THIS
  e.preventDefault();

  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  console.log('User  uid !  (retrieveHandler) ' + userId);

var ref = firebase.database().ref('/combinedusers/' + userId);

  ref.once("value").then( (snapshot)=> {
      console.log("Company  "+ snapshot.val().company)


          //     snapshot.forEach(function(child) {

  //console.log("key "+ child.key +": username in DB : "+ child.val().username + " id in DB : " + child.val().id + "Firebase ID of current user : " + user.uid);

                      var childData = snapshot.val();
                      var c=childData.company;
                      console.log("Company  retrieveHandler "+ c);
                      var n=childData.username;
                      console.log("username  retrieveHandler "+ n);
                      var eligible=childData.eligible;
                      console.log("eligible  retrieveHandler " + eligible);
                      var e =childData.id;
                      console.log("email stored retrieveHandler  "+ e);
                      var hist =JSON.parse(childData.questionnaire);
                      var histString=childData.questionnaire;
                      console.log("questionnaire in retrieveHandler  "+ hist);
                      //localStorage.setItem("questionnaire",childData.questionnaire);
                      //var hist2=hist.slice(0);
return histString;})
.then( function(histString) {console.log("history" +histString);
                        //this.updateHistory(hist);
//localStorage.setItem("questionnaire",histString);
//console.log("history and question no ");
                       //,() =>  this.forceUpdate()


                   })
}

updateHistory=(hist)=>{
  this.setState (
    (state) => {
        // Important: read `state` instead of `this.state` when updating.
        return { history: hist } //, currentQuestion:this.findCurrentQuestion(hist)
      })
}
//this.setState(this.state);



/*
You can execute a function after setState is finishing using the second param callback like:

this.setState({
    someState: obj
}, () => {
    this.afterSetStateFinished();
});
*/
findCurrentQuestion=(h )=>{
  console.log("inside findCurrentQuestion")
  let cq=-1;
  for (let i=0;i<46;i++){
    if (h[i]>0){cq=i;} }
  if (cq===-1) cq=0;
  console.log("current question number " + cq)
  return cq;
}

handleClickOpen = () => {
  this.setState({open: true});
};

handleClose = () => {
  this.setState({open: false});
};

refreshQuestions = () =>   // is not used
  this.setState({refresh: !this.state.refresh});

//******************************************************************** 

    //<AuthUserContext.Consumer>
    //  {authUser => console.log("Home inside  render")}
    //</AuthUserContext.Consumer>

  render() {

const { t } = this.props;
if (this.state.externalData === null) { return (
  
<div style= {pageStyle} >
        <h4 style={inlineHeader}>{t('Loading your Privacy and Data Protection Assessment')} </h4> </div>

);
  // Render loading state ...
} else {
  // Render real UI ...  componentDidMount changes externalData
  
    
//let currentQN=this.findCurrentQuestion(this.state.history); //this.state.currentQuestion;
//console.log("this.findCurrentQuestion() " + this.findCurrentQuestion(this.state.history))
    let question=(<Question questionNumber={this.state.currentQuestion}
    //questionHeader = {this.dbQuestions[this.state.currentQuestion].questionHeader}
        questionHeader = {this.dbHeader[this.state.currentQuestion]}
        clickHistory={this.historyHandler}
        clickNext={this.nextQuestionHandler}
        clickBack={this.previousQuestionHandler}
        historyValue={this.state.history[this.state.currentQuestion]}
        questionBody= {this.questionBodyFn()}
        render={this.state.refresh}
        >
        </Question>)


    let block=(       <Block blockHeader = {this.dbBlocks[this.state.currentBlock].blockHeader}
    blockBody={this.dbBlocks[this.state.currentBlock].blockBody} > </Block>  )

    return (

// removed from below

    <div style={{display: 'flex', flexFlow: 'wrap', alignItems: 'center', justifyContent:'center'}}>
      {/* <Stepper /> */}
    <div style= {pageStyle} >
    <h2 style={inlineHeader}>{t('privacy_data_protection.title')}</h2>
    <Grid container spacing={3} style={{marginTop: '10px'}}>
      <Grid item xs={12} sm={3}>
        {this.state.currentQuestion < 45 ?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.saveHandler}>
          {t('Save Your Answers')}
        </Button>}
      </Grid>
      <Grid item xs={12} sm={this.state.currentQuestion === 45 ? 6 : 3}>
        {this.state.currentQuestion===0 || this.state.currentQuestion === 45 ?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.saveHandler}>
          {t('Save Your Answers')}
        </Button>}
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {this.state.currentQuestion < 45?"":<Button style={{color: 'white'}} onClick={this.previousQuestionHandler}><NavigateBeforeIcon />{t('Previous Question')}</Button>}
          {this.state.currentQuestion <= 45?"":<Button style={{color: 'white'}} onClick={this.nextQuestionHandler}>{t('Next Question')}<NavigateNextIcon /></Button>}
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={this.state.currentQuestion === 45 ? 3 : 6}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {this.state.currentQuestion===0 || this.state.currentQuestion === 45?"":<Button style={{color: 'white'}} onClick={this.previousQuestionHandler}><NavigateBeforeIcon />{t('Previous Question')}</Button>}
          {this.state.currentQuestion===45?"":<Button style={{color: 'white'}} onClick={this.nextQuestionHandler}>{t('Next Question')}<NavigateNextIcon /></Button>}
          {this.state.currentQuestion!==45?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.finishedHandler}> {t('Submit Your Answers')} </Button>}
        </ButtonGroup>
      </Grid>
    </Grid>

    <Dialog
      open={this.state.open}
      onClose={this.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      {/* <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
      <DialogContent>
        <DialogContentText>
          {this.state.dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
        
        
        {/* &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={this.retrieveHandler}> Retrieve Previously Saved Answers </button>
        */}
        <ModalFinish show={this.state.isOpen}
                  onClose={this.toggleModal}>
                    {t('Your answers have been submitted to the server')}
                          </ModalFinish>

        <ModalFinish show={this.state.isOpen}
                  onClose={this.toggleModal}>
                    {t('Your answers have been saved to the server')}
                          </ModalFinish>
        {block}
        {question}
      </div>
      </div>

    );
      }
  } //end of render

}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withTranslation()(HomePage));
