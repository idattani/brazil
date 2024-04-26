import React, { Component } from 'react';

import Block from '../Block/BlockCyberInsurance.js';
import Question from '../Question/QuestionCyberInsurance';
import ModalFinish from '../ModalFinish/ModalFinish';

import withAuthorization from '../withAuthorization';
import firebase from 'firebase';

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

import { Helmet } from 'react-helmet';

const db = firebase.firestore();

const pageStyle = {
  textAlign: "justify",
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


class CyberInsurancePage extends Component {

    dbBlocks= [
        { start: '0', end: '0', blockHeader: 'Client Data (“YOU”)' },
        {start: '1', end: '7',  blockHeader: 'Questions for Clients with Annual Revenue from zero to BRL 100 million (ALL)'},

        {start: '8', end: '8', blockHeader: 'Question for Clients with Annual Revenue between BRL 50 million and BRL 100 million'},

        {start: '9', end: '11', blockHeader: 'Question for Clients with Annual Revenue between BRL 100 million and BRL 200 million' },
    ];

    dbHeader = [
        '',
        'Do you have commercial-grade firewalls on all external connections',
        'Do you or your IT Service Provider back up the data',
        'Is backed-up data stored in an environment that is separate from your network',
        'Do you install critical security updates (critical patches) within 30 days',
        'Do you password or biometrically protect all portable devices such as laptops',
        'Are you compliant with Payment Industry Security Standards (PCI)',
        'Have you (i) suffered a loss or',

        'Do you have secure remote access to the applications',
        
        'Is the Remote Desktop Protocol (RDP) disabled on all access points',
        'Is all Personal and/or Sensitive Data(*) always encrypted while stored on',
        'Do you protect remote access to your network and the Personal and/or Sensitive Data(*) stored on it'
    ];




    toggleModal = () => {
        this.handleClickOpen();
    }

    setBlockToCorrespondToQuestion= (cqn) =>{
        
        if(cqn === 0  ){this.setState( {currentBlock: 0 } );return;}
        if(cqn >=1 && cqn <=7  ){this.setState( {currentBlock: 1 } );return;}
        if(cqn >=8 && cqn<=8  ) {this.setState( {currentBlock: 2 } );return;}
        if(cqn >=9 && cqn<=11  ){this.setState( {currentBlock: 3} );return;}

    }
    nextQuestionHandler= () => {//cqn is the array index NOT the number

        console.log('Next was clicked ...previous question index' + this.state.currentQuestion)
        let cqn = this.state.currentQuestion +1;
        this.setBlockToCorrespondToQuestion(cqn);
        console.log('Next was clicked ...current question number' + cqn)
        if (cqn>11) {cqn=11;} else this.setState( {currentQuestion: cqn });
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

        if (h[0]['address'] === "" || h[0]['annualRevenue'] === "" || h[0]['companyName'] === "" || h[0]['registrationNumber'] === "" || h[0]['revenueFromUSA'] === "" || h[0]['sector'] === "" || h[0]['website'] === "") {
          alert("You have not answered Client Data questions");
          return notAnswered
        }
        for (i = 1; i < 11; i++) { //46
            if (h[i]===0)  {
                alert("You have not answered question " +(i+1)); 
                return notAnswered;
            }
        }
        return false;
    }





    questionBodyFn=()=>{
        const { t, i18n } = this.props;
        if (this.state.currentQuestion === 6) {
            return <span style={answerText}> {t(`cyber_insurance_application.recommendations.Questions about PCI`)}</span>
        } else if (i18n.language !== 'pt-BR' && this.state.currentQuestion === 11) {
            return <span style={answerText}> {t(`cyber_insurance_application.recommendations.Sensitive Data`)}</span>
        }
    }

    constructor(props) {
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
    
            let questionnaire=childData.cyberInsuranceQuestionnaire;  
            console.error('value of questionnaire is '+ questionnaire );
            console.error('value of username is  '+ childData.username );
            let currentQuestion=parseInt(questionnaire.currentQuestion,10);
            let currentBlock=parseInt(questionnaire.currentSection,10);
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
                history: questionnaire ? questionnaire.answers : null,
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
    
        }) // end of on
    }


saveHandler=(e)=> {
  e.preventDefault();
  const h=this.state.history;
  const { t } = this.props;

  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  console.log('User  uid !  (saveHandler) ' + userId);
  console.log('answers', h);

    const usersRef = firebase.database().ref('/combinedusers/' + userId );

    usersRef.update({cyberInsuranceQuestionnaire: {answers: h, currentQuestion: this.state.currentQuestion.toString(), currentSection: this.state.currentBlock.toString()}, 
      date: new Date().toJSON(),
    });
    this.setState({dialogText: t('Your answers have been saved to the server')});
    this.toggleModal();

}





finishedHandler= (e) => {
e.preventDefault();
this.saveHandler(e);
const h=this.state.history;
const { t } = this.props;

if (this.anyNotAnswered(h) ===false) { // only post if complete
console.log('finished ' + h[0] +h[1] +h[2]+ h[3] +h[4]+h[5]+ h[6] +h[7]+h[8]+ h[9]  +h[10]+h[11]+ h[12] +h[13] +h[14]+ h[15]  );

/* const progress = this.calculateProgress(); */

this.setState({dialogText: t('Your answers have been submitted to the server')});
this.toggleModal(); //want to display finishing modal

const user = firebase.auth().currentUser;


  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  console.log('User  uid !  (Home) ' + userId);

  const firestoreUserRef = db.collection("users").doc(userId);
  firestoreUserRef.update({
    isCyberInsuranceApplicationCompleted: true,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  /* const firestoreSurveyRef = db.collection("cyberInsuranceSurvey");
  firestoreSurveyRef.add({
    userId,
    data: progress,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }); */
 
  const usersRef = firebase.database().ref('/combinedusers/' + userId);
  //usersRef.update(cust);

  usersRef.update({cyberInsuranceQuestionnaire: {answers: h, currentQuestion: this.state.currentQuestion.toString(), currentSection: this.state.currentBlock.toString(),
    date: new Date().toJSON()
  }})

  this.sendCyberInsuranceReport();
  
}
}

sendCyberInsuranceReport = (e) => {
  let sendReport = firebase.functions().httpsCallable('sendCyberInsuranceEmail');
  sendReport({ text: 'testing........' })
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

updatePropertyValue = (property, value) => {
    const answers = this.state.history;
    answers[0][property] = value;
    this.setState({history: answers});
}

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
        <h4 style={inlineHeader}>{t('Loading your Cyber Insurance Application')} </h4> </div>

);
  // Render loading state ...
} else {
  // Render real UI ...  componentDidMount changes externalData
  
    
//let currentQN=this.findCurrentQuestion(this.state.history); //this.state.currentQuestion;
//console.log("this.findCurrentQuestion() " + this.findCurrentQuestion(this.state.history))
    let question=(<Question questionNumber={this.state.currentQuestion}
    //questionHeader = {this.dbQuestions[this.state.currentQuestion].questionHeader}
        questionHeader = {this.dbHeader[this.state.currentQuestion]}
        updatePropertyValue = {this.updatePropertyValue}
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
      <Helmet>
        <title>CyberSeguro | {t('cyber_insurance_application.title')}</title>
      </Helmet>
    <div style= {pageStyle} >
    <h2 style={inlineHeader}>{t('cyber_insurance_application.title')}</h2>
    <Grid container spacing={3} style={{marginTop: '10px'}}>
      <Grid item xs={12} sm={3}>
        {/* {this.state.currentQuestion < 11 ?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.saveHandler}>
          {t('Save Your Answers')}
        </Button>} */}
      </Grid>
      <Grid item xs={12} sm={this.state.currentQuestion === 11 ? 6 : 3}>
        {/* {this.state.currentQuestion===0 || this.state.currentQuestion === 11 ?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.saveHandler}>
          {t('Save Your Answers')}
        </Button>} */}
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {this.state.currentQuestion < 11?"":<Button style={{color: 'white'}} onClick={this.previousQuestionHandler}><NavigateBeforeIcon />{t('Previous Question')}</Button>}
          {this.state.currentQuestion <= 11?"":<Button style={{color: 'white'}} onClick={this.nextQuestionHandler}>{t('Next Question')}<NavigateNextIcon /></Button>}
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={this.state.currentQuestion === 11 ? 3 : 6}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {this.state.currentQuestion===0 || this.state.currentQuestion === 11?"":<Button style={{color: 'white'}} onClick={this.previousQuestionHandler}><NavigateBeforeIcon />{t('Previous Question')}</Button>}
          {this.state.currentQuestion===11?"":<Button style={{color: 'white'}} onClick={this.nextQuestionHandler}>{t('Next Question')}<NavigateNextIcon /></Button>}
          {this.state.currentQuestion!==11?"":<Button style={{color: 'white'}} variant="contained" color="primary" onClick={this.finishedHandler}> {t('Submit Your Answers')} </Button>}
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

export default withAuthorization(authCondition)(withTranslation()(CyberInsurancePage));
