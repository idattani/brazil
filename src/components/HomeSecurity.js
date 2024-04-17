import React, { Component } from 'react';
// import {Button, ThemeProvider} from 'react-bootstrap';
//import {render} from 'react-dom'
import { Chart } from "react-google-charts";
import './App.css'; 
//import './App.js';
//import { arc } from "d3-shape"
//import { scaleLinear } from "d3-scale"
//import { format } from "d3-format"
//
//import Block from './Block/Block.js';
import QuestionSecurity from './Question/QuestionSecurity.js';
//import ModalFinish from './ModalFinish/ModalFinish';

//import AuthUserContext from './AuthUserContext';
import withAuthorization from './withAuthorization';
import firebase from 'firebase';

import Swal from 'sweetalert2'
// import { fillAndStroke } from 'pdfkit/js/mixins/vector';

import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

//import { auth } from '../firebase';
//const GoogleChartsNode = require('google-charts-node');

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

const gaugeStyle={
  marginLeft: "220px"
}

class HomeSecurityPage extends Component {



toggleModal = () => {
  this.setState({
    isOpen: !this.state.isOpen
  });
}

  nextQuestionHandler= () => {//cqn is the array index NOT the number

    console.log('Next was clicked ...previous question index' + this.state.currentQuestionSecurity)
    let cqn=this.state.currentQuestionSecurity +1;
    if (cqn>20) {cqn=20;} else this.setState( {currentQuestionSecurity: cqn });
    this.forceUpdate();}

  previousQuestionHandler= () => {
    //console.log('Next was clicked ...original question number' + this.state.currentQuestionSecurity)
    let cqn=this.state.currentQuestionSecurity -1;
    if (cqn<0) {cqn=0;} else this.setState( {currentQuestionSecurity: cqn });
    this.forceUpdate();}

  historyHandler= (e) => {
    let choice=parseInt(e.target.value, 10);
    
      let  h= [...this.state.historySecurity];
      const q=this.state.currentQuestionSecurity;
      h[q]=choice;
      console.log('new historySecurity ' + h[0] +' ' +h[1]+' ' +h[2] +' ' +h[3]  +' ' +h[4]   );
      this.setState( {historySecurity: h})
      this.forceUpdate();
      e.preventDefault();
      }

  anyNotAnswered= (h) =>{   //change to number of questions !!!!!!!
    let i;
    for (i = 0; i < 21; i++) { 
            if (h[i]===-1 )  { 
               alert("You have not answered question " +(i+1)); return true}
            }
    return false}
// /return notAnswered;


constructor(props){
super(props);
//this.myRef = null;
this.state = {
  externalData: null,
  //gImage: null,
  localScore:-1,
  currentQuestionSecurity: 0,  // as a string in FB
  toThankYou:false,
  open: false,


  dbQuestions:{
    "questionBody":["How many employees work at your organisation?",
    "Which category best defines your organisation’s primary industry?",


    "Does your organisation have a user administration process for new employees and leaving employees?",
    'Does your organisation review user privileges?',
    'Are complex passwords enforced within the organisation?',
    "Do employees, individuals or third parties have remote access to your network?",
    "Does your organisation provide security awareness training?",
    'Are the laptops of employees encrypted?',
    'Are backups stored remotely, and if so are they properly protected?',
    'Are patches installed on a timely basis?',
    'Does your organisation have a wireless corporate network?',
    'Does your organisation have a wireless guest network?',
    'Does your organisation have security & privacy policies?',
    'Does your organisation have a security function?',
    'Does your organisation have an incident response and recovery plan?',
    'Does your organisation have an anti-virus?',
    'Does your organisation protect its environment with a firewall?',
    'Does your organisation perform internal vulnerability scans?',


    'Was your organisation in the past year a victim of a cyber attack?',
    'Compared to this time last year',
    'Does your organisation have cyber insurance?'
  
  ],

    "answers":[ ['1 to 49',
      '50 to 199',
      '200 to 499',
      '500 to 1999',
      '2000 to 4999',
      '5000 or more'
    ],
     [
      'Construction',
      'Electricity, gas, water and waste services',
      'Financial and insurance services',
      'Health care and social assistance',
      'Information media and telecommunications',
      'Manufacturing',
      'Professional, scientific and technical services',
      'Public, non-profit',
      'Rental, hiring and real estate services',
      'Retail',
      'Transport, postal and warehousing',
      'Other'
    ],
  
    ['No',
    'Yes, but not documented',
    'A formally documented process'
    ],
  
   ['No',
      'Reviews are performed on an ad-hoc basis',
      'Only administrator accounts are reviewed',
      'All user privileges are monitored on a periodic basis'
    ],
  
   ['No',
      'Less than 8 characters and no other requirements',
      '8 characters or more, special characters, upper and lower case, numbers and required change on a periodic basis',
      'Multi-factor authentication'
    ],



    [
    'No',
    'Continuously without monitoring or tools',
    'Remote access tools to access the corporate network from outside',
    'Facilitated via VPN',
    
    ],


    ['No',
    'Only for new employees',
    'For all employees on a periodic basis',
    'Mandatory for all employees and management, periodically, with assessment of understanding'
    ],


    [ 
    'Unencrypted',
    'File encryption',
    'Hard Drive encryption',
    'Full encryption and no data stored locally'
    ],

    [ 
    'Not stored remotely',
    'Yes, but physically unsecured',
    'Yes, but unencrypted',
    'Yes, encrypted'
    ],
     
     
    ['Not monitored',
    'Patches are installed on an ad-hoc basis',
    'A formal patch management process is in place and covers servers, clients and security devices'
    ],


     
    ['Published SSID with weak password',
    'Published SSID with complex password',
    'Hidden SSID, complex password (+ additional measures)'
    ],


    ['No',
      'No, guests connect to our corporate network',
    'Yes',
    'Yes, fully isolated with no access to internal network'
    ],


    ['No',
    'On-the-shelf',
    'Approved by board, trained, signed by employees, enforced'
    ],


    ['No',
    'Security functions within the technical/IT team',
    'Dedicated security team'
    ],


  ['No',
    'Our response team operates between business hours',
    'Our response team is 24/7 on stand-by with an immediate response when required'
  ],
  
  
    ['No',
    'Installed on employee computers',
    'Installed on all computers and servers',
    'Advanced End-Point Protection'
],

    [
    'No',
    'Residential grade firewall',
    'Each network entry/exit point has a commercial grade firewall that is vendor supported',
    'Each network entry/exit point has a commercial grade firewall that is vendor supported and configurations are reviewed on a periodic basis'
    ],
     
    ['No',
    'Ad-hoc',
    'Internal vulnerability scans are running across all systems at least once a year',
    'Yearly penetration testing is performed'
    ],

    ['No',
      'Yes',
    'I don’t know',
    'I’d rather not disclose this information'
    ],


    
    ['More confident',
    'Less confident',
    'No difference in confidence level',
    'Do not know / would rather not say'
    ],


   [
    'No ‐ we were not aware of this type of insurance',
    'No ‐ we don’t feel we need it',
    'No ‐ we believe this risk is covered under other insurance policies we have',
    'No ‐ we self‐insure',
    'Not yet ‐ we are considering it',
    'Yes ‐ we have a standalone cyber policy',
    'Yes ‐ we have this covered as an extension to another insurance policy',
    'Yes ‐ but do not know how the policy was arranged',
    'Do not know / would rather not say'
  ]


    ],
    "helpText": [
      "",
      "",


      "",
      'user privileges are the right to execute a specific activity such as for example the right to edit Or view a document on a file server',
      '',
      "",
      "",
      '',
      '',
      '',
      '',
      '',
      `identifies the rules and procedures for all individuals accessing and using an organization's IT assets and resources and the rules governing it's management of data and how it protects personal data it may hold and/or have access to`,
      '',
      '',
      '',
      '',
      '',


      '',
      '',
      ''
    ]
  }
}

this.finishedHandler = this.finishedHandler.bind(this);
this.historyHandler=this.historyHandler.bind(this);
this.anyNotAnswered=this.anyNotAnswered.bind(this);
this.previousQuestionHandler=this.previousQuestionHandler.bind(this);
this.nextQuestionHandler=this.nextQuestionHandler.bind(this);
//this.retrieveHandler=this.retrieveHandler.bind(this);
this.saveHandler=this.saveHandler.bind(this);
this.clearHandler=this.clearHandler.bind(this);
this.findCurrentQuestion=this.findCurrentQuestion.bind(this);
//this.getCoordsOnArc=this.getCoordsOnArc.bind(this);
//this.handleTransformation=this.handleTransformation.bind(this);
//this.routeChange = this.routeChange.bind(this);


}



shouldComponentUpdate(nextProps, nextState) {
    return nextState.chart_events != this.state.chart_events;
}

/* componentDidUpdate =(prevProps,prevState) =>{
When componentDidUpdate() is called, two arguments are passed:
prevProps and prevState. This is the inverse of 
componentWillUpdate(). The passed values are what the values 
were, and this.props and this.state are the current values.

  console.log("componentDidUpdate " + this.state.chartRendered )
  console.log("chartRendered on entry  " + this.state.chartRendered )
  if (this.state.chartRendered ===false) {

  //setTimeout(this.handleTransformation, 4000);

  this.setState( {chartRendered:true})
  console.log("chartRendered  " + this.state.chartRendered )
  //console.log("Behaviour when the component receives new state or props. " + base64String);
}
} 
*/

componentDidMount() {

console.log("in componentDidMount")
  let userId = firebase.auth().currentUser.uid; 
  if (userId) {
    //console.log('value of userId is  Home '+ userId );
  } else {
     // console.log('No user ! Home' + userId);
  }
 
 const usersRef = firebase.database().ref('/combinedusers/' + userId );
 // array index not the displayed question number
  usersRef.on("value", (snapshot) => {
 //NB the lexical scoping  => is necessary
        let childData = snapshot.val();
        console.log("childData   " + childData)
        //let language=childData.language;   NOT USED YET but are correct
        //let assessment=childData.assessment;
        let historySecurity;  
        let currentQuestionSecurity;  //to be an integer when working with it... a string in FB
        let shouldemailSecurity;
        let shouldemailJson;
        console.log("childData.currentQuestionSecurity   " +childData.currentQuestionSecurity)
        if (childData.currentQuestionSecurity === undefined) {currentQuestionSecurity= 0;}
        else 
          {currentQuestionSecurity=parseInt(childData.currentQuestionSecurity,10);}

        //let shouldemailSecurity;
        if (childData.shouldemailSecurity === undefined) {shouldemailSecurity= "no";}
          else 
            {shouldemailSecurity=childData.shouldemailSecurity;}

        if (childData.shouldemailJson === undefined) {shouldemailJson= "no";}
          else 
            {shouldemailJson=childData.shouldemailJson;}
           
          // console.error('value of currentQuestionSecurity HomeSecurity is  '+ currentQuestionSecurity );
           
         //  console.error('value of childData.assessment HomeSecuity is  '+ childData.assessment );
           
           //console.error("historySecurity "  + historySecurity)
           //historySecurity an array when using, a string in FB
           if (childData.historySecurity===undefined)
              {historySecurity=[-1,-1,-1,-1,-1,  -1,-1,-1,-1,-1,  -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1]}
            else{historySecurity=JSON.parse(childData.historySecurity);}
           //console.error("historySecurity ********************* "  + historySecurity[2])
           this.setState(
           { chartRendered:false,
            language: childData.language,
            //assessment:childData.assessment,
            historySecurity: historySecurity,
             company:childData.company,
             username:childData.username,
             eligible:childData.eligible,
             telephoneNumber:childData.telephoneNumber,
             dateSecurity:childData.dateSecurity,
             shouldemailSecurity:shouldemailSecurity,
             shouldemailJson:shouldemailJson,
             currentQuestionSecurity:currentQuestionSecurity,
             externalData:"true"
           } );
           this.forceUpdate();
 
 
          }
     ) // end of on
 
 
}





saveHandler=(e)=>{
  e.preventDefault();
  const h=this.state.historySecurity;
  //https://firebase.google.com/docs/auth/web/manage-users
  /*const user = firebase.auth().currentUser;
    if (user) {
      console.log('value of user is  saveHandler'+ user.email);
    } else {
        console.log('No user ! saveHandler' + user.email);
    }

*/
  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  //console.log('User  uid !  (saveHandler) ' + userId);

  console.log('choice', h[1]);
  if (h[1] > -1) {
    let sector = null;
    if (h[1] === 0) {
      sector = 'Construction';
    }
    if (h[1] === 1) {
      sector = 'Energy';
    }

    if (h[1] === 2) {
      sector = 'Finance and insurance';
    }

    if (h[1] === 3) {
      sector = 'Healthcare';
    }
    if (h[1] === 4) {
      sector = 'Information Media and Telecommunications';
    }
    if (h[1] === 5) {
      sector = 'Manufacturing';
    }
    if (h[1] === 6) {
      sector = 'Professional, scientific and technical Services';
    }
    if (h[1] === 7) {
      sector = 'Public, non profit';
    }
    if (h[1] === 8) {
      sector = 'Rental, Hiring and Real Estate';
    }
    if (h[1] === 9) {
      sector = 'Retail';
    }
    if (h[1] === 10) {
      sector = 'Transport, Postal and Warehousing';
    }
    if (h[1] === 11) {
      sector = 'Other';
    }
    const firestoreUserRef = db.collection("users").doc(userId);
    firestoreUserRef.update({
      sector: sector,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }


//SEE https://stackoverflow.com/questions/40589397/firebase-db-how-to-update-particular-value-of-child-in-firebase-database
    const usersRef = firebase.database().ref('/combinedusers/' + userId );

    usersRef.update({historySecurity: JSON.stringify(h), 
      dateSecurity: new Date().toJSON(),
      shouldemailSecurity: "no",
      shouldemailJson:"no",
    currentQuestionSecurity:this.state.currentQuestionSecurity.toString(),
        })

.then(
  this.setState(() => ({
    toThankYou: false, open: true}), /*alert("Responses have been saved. You can return at any time")*/  )
)

  }


//
  //  this.toggleModal(); //want to display finishing modal


  clearHandler=(e)=>{
    //console.error("In clearHandler")
    e.preventDefault();
    let h=[-1,-1,-1,-1,-1,  -1,-1,-1,-1,-1,  -1,-1,-1,-1,-1,  -1,-1,-1,-1,-1,  -1 ]
  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  const usersRef = firebase.database().ref('/combinedusers/' + userId);
  
  usersRef.update({historySecurity: JSON.stringify(h), dateSecurity: new Date().toJSON(),
    shouldemailSecurity: "no",
    shouldemailJson:"no",
    currentQuestionSecurity:"0",
    toThankYou: false,
    localScore:-1
  });
}







computeScore =()=>{ //21 questions.. first two and last 3 not counted in score
  let h=this.state.historySecurity
  let maxValues=[0,0,2,3,3,  3,3,3,3,2,  2,3,2,2,2,  3,3,3,0,0, 0]
  //use 0 for the max score in questions that do not count
  //console.error("h  " + h)
  //console.error("h{2]  " + h[2])
  let numericalH = h.map(v => parseInt(v, 10));
  //alert("numericalH     " + numericalH)
  let score=0
  for (let j=2; j<numericalH.length -3; j++) 
    { score=score + (numericalH[j]*2)} // not all questions counted 
  let maximumScore =0;
  for (let j=2; j<18; j++) 
  { maximumScore=maximumScore + (maxValues[j]*2)} // not all questions counted
 
  let scorePercentSecurityString= (parseFloat(score)*96/maximumScore).toFixed(1).toString()
//Now add it to firebase
const user = firebase.auth().currentUser;
        if (user) {
          //console.log('value of user is  '+ user.email);
        } else {
          // console.log('No user ! ' + user.email);
        }
        var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
        //console.log('User  uid !  (Home) ' + userId);
        const usersRef = firebase.database().ref('/combinedusers/' + userId);
        //usersRef.update(cust);

        usersRef.update({scoreSecurity: scorePercentSecurityString})
        const firestoreUserRef = db.collection("users").doc(userId);
        firestoreUserRef.update({
          securityRiskScore: parseFloat(scorePercentSecurityString),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
// Now return value for display
  return scorePercentSecurityString
}

finishedHandler= (e) => {
e.preventDefault();
const h=this.state.historySecurity;
const { t } = this.props;

if (this.anyNotAnswered(h) ===false) { // only post if complete
      //console.log('finished ' + h[0] +h[1] +h[2]+ h[3] +h[4]   );

      //this.toggleModal(); //want to display finishing modal

      //https://firebase.google.com/docs/auth/web/manage-users
      const user = firebase.auth().currentUser;
        if (user) {
          //console.log('value of user is  '+ user.email);
        } else {
          // console.log('No user ! ' + user.email);
        }
        var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
        //console.log('User  uid !  (Home) ' + userId);

        const firestoreUserRef = db.collection("users").doc(userId);
        firestoreUserRef.update({
          isSecuritySurveyCompleted: true,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('history', h);
        const firestoreSurveyRef = db.collection("securitySurvey");
        firestoreSurveyRef.add({
          userId,
          data: {
            answers: h
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        const usersRef = firebase.database().ref('/combinedusers/' + userId);
        //usersRef.update(cust);

        usersRef.update({historySecurity: JSON.stringify(h), dateSecurity: new Date().toJSON(),
          shouldemailSecurity: "yes",
          shouldemailJson:"yes",
          currentQuestionSecurity:this.state.currentQuestionSecurity.toString(),
          uid:userId
        
        }) //uid is added so that cloud function can use it 

        .then (
          this.setState(() => ({
            toThankYou: true
          }),()=>{
          
            let timerInterval
            Swal.fire({
              title: t('Saved Answers'),
              html: t('Computing Score'),
              timer: 4000,
              timerProgressBar: true,
              onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  const content = Swal.getContent()
                  if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                      b.textContent = Swal.getTimerLeft()
                    }
                  }
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              let score=this.computeScore();
              this.setState({localScore: score})
              //this.forceUpdate();
              console.log("   localScore  ******************* " +this.state.localScore)
              let whatToWrite=""
              if( score<20){whatToWrite=t("The level of maturity of your organization is almost non-existent")}
              if(score>=20 && score<40){whatToWrite=t("Your organization's maturity level is Basic")}
              if(score>=40 && score<60){whatToWrite=t("Your organization's maturity level is Prudence")}
              if(score>=60 && score<85){whatToWrite=t("Your organization's level of maturity is Diligence")}
              if(score>=85 ){whatToWrite=t("Your organization's level of maturity is a Best Practice")}


              /* Read more about handling dismissals below */
              // if (result.dismiss === Swal.DismissReason.timer) {
              //   Swal.fire({
              //     icon: score >= 85 ? 'success': 'error',
              //     title: t('Your Security Score is')+ this.computeScore() + " % " ,
              //     text:   whatToWrite
              //   })

               
                 this.forceUpdate(); // THIS IS NEEDED

              // }
            })


          }
 
          )
        )
        this.sendDashboardEmail();
}

return   

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

updateHistory=(hist)=>{
  this.setState (
    (state) => {
        // Important: read `state` instead of `this.state` when updating.
        return { historySecurity: hist } 
      })
}

/*
You can execute a function after setState is finishing using the second param callback like:

this.setState({
    someState: obj
}, () => {
    this.afterSetStateFinished();
});
*/
findCurrentQuestion=(h )=>{
  //console.log("inside findCurrentQuestion")
  let cq=-1;
  for (let i=0;i<21;i++){
    if (h[i]>-1){cq=i;} }
  if (cq===-1) cq=0;
  //console.log("current question number " + cq)
  return cq;
}

handleClickOpen = () => {
  this.setState({open: true});
  this.forceUpdate();
}

handleClose = () => {
  this.setState({open: false});
  this.forceUpdate();
}



 getData = () => {
   let x;
  let userId = firebase.auth().currentUser.uid; 
  const usersRef = firebase.database().ref('/combinedusers/' + userId);
  usersRef.on("value", (snapshot) => {
    let childData = snapshot.val();
    //console.log( "  childData.scoreSecurity   " + childData.scoreSecurity)
    x=childData.scoreSecurity;
   
    //console.log( "in getData   x  "+x)

  })
  return [ ["Label" , "Value"], ["Risk" , 100-parseFloat(x)]]
 }

 /* getValue = () => {
    let x;
   let userId = firebase.auth().currentUser.uid; 
   const usersRef = firebase.database().ref('/combinedusers/' + userId);
   usersRef.on("value", (snapshot) => {
     let childData = snapshot.val();
     //console.log( "  childData.scoreSecurity   " + childData.scoreSecurity)
     x=childData.scoreSecurity;
     console.log( "in getValue   "+x)
    return 100- parseFloat(x)
    
 
   })

}

//99999999999999999999999999999999999999999

value=90;
 min=0;
 max=100;
 label='RISK';
 units='%';
 getCoordsOnArc = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]


//999999999999999999999999999999999999999
//00000000000000000000000000000000000000
 backgroundArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    ()
   percentScale = scaleLinear()
    .domain([this.min, this.max])
    .range([0, 1])
   percent = this.percentScale(this.value)
   angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true)
   angle = this.angleScale(this.percent)
   filledArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(this.angle)
    .cornerRadius(1)
    ()
   colorScale = scaleLinear()
    .domain([0, 1])
    .range(["#fff400", "#ff0000"])
   gradientSteps = this.colorScale.ticks(10)
    .map(value => this.colorScale(value))
   markerLocation =this.getCoordsOnArc(
    this.angle,
    1 - ((1 - 0.65) / 2),
  )

//0000000000000000000000000000000000000

  */
 
 render() {
  const { t } = this.props;

if (this.state.externalData === null) { return (
  
          <div style= {pageStyle} >
                  <h4 style={inlineHeader}>{t('Loading your Security Assessment')}</h4> </div>

          );
            // Render loading state ...
          } 
 else {
  // Render real UI ...  componentDidMount changes externalData
     let question=(<QuestionSecurity questionNumber={this.state.currentQuestionSecurity}
      questionSet={this.state.dbQuestions}
      clickHistory={this.historyHandler}
      clickNext={this.nextQuestionHandler}
      clickBack={this.previousQuestionHandler}
      historyValue={this.state.historySecurity[this.state.currentQuestionSecurity]}
      render={this.state.refresh}
      shouldemailSecurity={this.state.shouldemailSecurity}
      shouldemailJson={this.state.shouldemailJson}
      routeChange= {this.routeChange}
      >
      </QuestionSecurity>)

//let score=(<ScoreSecurity  finalHistory={this.state.historySecurity}></ScoreSecurity>)
    if (this.state.localScore<0){
       return ( <div style={{display: 'flex', flexFlow: 'wrap', alignItems: 'center'}}>


    <div style= {pageStyle} >
      <h2 style={inlineHeader}>{t('security_assessment.title')}</h2>
      <Grid container spacing={3} style={{marginTop: '10px'}}>
      <Grid item xs={12} sm={3}>
        {this.state.currentQuestionSecurity < 20?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.saveHandler}>
          {t('Save Your Answers')}
        </Button>}
      </Grid>
      <Grid item xs={12} sm={this.state.currentQuestionSecurity == 20 ? 5 : 4}>
        {this.state.currentQuestionSecurity===0 || this.state.currentQuestionSecurity === 20?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.saveHandler}>
        {t('Save Your Answers')}
        </Button>}
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {this.state.currentQuestionSecurity < 20?"":<Button style={{color: 'white'}} onClick={this.previousQuestionHandler}><NavigateBeforeIcon />{t('Previous Question')}</Button>}
          {this.state.currentQuestionSecurity <= 20?"":<Button style={{color: 'white'}} onClick={this.nextQuestionHandler}>{t('Next Question')}<NavigateNextIcon /></Button>}
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={this.state.currentQuestionSecurity == 20 ? 3 : 5}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {this.state.currentQuestionSecurity===0 || this.state.currentQuestionSecurity=== 20 ? "":<Button style={{color: 'white'}} onClick={this.previousQuestionHandler}><NavigateBeforeIcon />{t('Previous Question')}</Button>}
          {this.state.currentQuestionSecurity===20?"":<Button style={{color: 'white'}} onClick={this.nextQuestionHandler}>{t('Next Question')}<NavigateNextIcon /></Button>}
          {this.state.currentQuestionSecurity==20?<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.finishedHandler}> {t('Submit Your Answers')} </Button>: ""}
        </ButtonGroup>
      </Grid>
    </Grid>

    <Dialog
      open={this.state.open}
      onClose={this.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <DialogContentText>
          {t('Responses have been saved. You can return at any time')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
      
      {/* <Button variant="success" onClick={this.clearHandler}> Reset </Button> */}

      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      
      {/* &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={this.retrieveHandler}> Retrieve Previously Saved Answers </button>
      */}
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      {this.state.currentQuestion!==20?"":<button onClick={this.finishedHandler}> Send your answers </button>}

      {question}
      </div>
      </div>)
    }
      
      else { 
console.log("create chart ++++++++++++++++++++++++")

        let score = this.computeScore();
        this.setState({localScore: score})
        //this.forceUpdate();
        console.log("   localScore  ******************* " +this.state.localScore)
        let whatToWrite=""
        if( score<20){whatToWrite=t("The level of maturity of your organization is almost non-existent")}
        if(score>=20 && score<40){whatToWrite=t("Your organization's maturity level is Basic")}
        if(score>=40 && score<60){whatToWrite=t("Your organization's maturity level is Prudence")}
        if(score>=60 && score<85){whatToWrite=t("Your organization's level of maturity is Diligence")}
        if(score>=85 ){whatToWrite=t("Your organization's level of maturity is a Best Practice")}
        let g= <Chart
        chartType="Gauge"
        loader={<div>Loading Score Gauge</div>}
        data= {this.getData()}
        options={{
          redFrom: 50,
          redTo: 100,
          yellowFrom: 20,
          yellowTo: 50,
          greenFrom:0,
          greenTo:5,
          majorTicks:[0,10,20,30,40,50,60,70,80,90,100],
          minorTicks: 5,
          }} 
         />

         
 



    return (
      <div style={{display: 'flex', flexFlow: 'wrap', alignItems: 'center', justifyContent:'center'}}>
        <Card style={{maxWidth: '345px'}}>
          <CardHeader
            title="Your Risk Score"
          />
          <CardMedia
            style={{paddingLeft: '20.5%'}}
            children={g}
          />
          <CardContent>
            {/* <div>{g}</div> */}
            <Typography variant="body2" color="textSecondary" component="p">
              {whatToWrite}
            </Typography>
          </CardContent>
        </Card>
      </div>
     )}; //end of else


    } //end of else
  } //end of render

}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withTranslation()(HomeSecurityPage));
