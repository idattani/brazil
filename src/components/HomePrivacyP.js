import React, { Component } from 'react';

//import './App.js';

import Block from './Block/Block.js';
import Question from './Question/Question.js';
import ModalFinish from './ModalFinish/ModalFinish';

//import AuthUserContext from './AuthUserContext';
import withAuthorization from './withAuthorization';
import firebase from 'firebase';
//import { auth } from '../firebase';


const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  padding: "60px",
  margin: "20px",
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
fontWeight: "bold"
}

const answerText={textAlign: "justify"}

class HomePrivacyPageP extends Component {

//lsh=null;

// start and end are not used. Only for clarity. It is the array order that is used
dbBlocks= [
  {start: '1', end: '7', blockHeader: 'Manutenção de Governança de Dados',
    blockBody: 'Ao processar dados pessoais, os profissionais de proteção e privacidade de dados (DPP) e empresas devem oferecer uma estrutura de governança abrangente para garantir a conformidade com os regulamentos de privacidade e proteção de dados estabelecidos. Os processos de governança devem permitir que todos os associados e outras partes interessadas internas e externas contem com um conjunto definido de princípios, políticas e procedimentos que definem e explicam claramente como os dados pessoais podem ser processados. Devem também explicar como a liderança administrativa e outras funções de liderança na empresa devem apoiar as atividades relacionadas. '} ,
  
    {start: '8', end: '13', blockHeader: 'Adquirir, identificar e classificar dados pessoais',
    blockBody: 'A aquisição de novos dados pessoais, a identificação dos dados pessoais existentes e a classificação dos ativos de informação constituem a base para a gestão e controle desses dados de acordo com as normas previstas. Profissionais de Proteção e Privacidade de Dados (DPP) e empresas devem, portanto, oferecer um processo robusto que garanta o processamento e gerenciamento de dados eficiente e em conformidade com essas normas. Este processo também deve estabelecer um ciclo de vida definido e mensurável para os dados pessoais, levando em consideração o princípio da minimização de dados. '},
  
    {start: '14', end: '17', blockHeader: 'Gestão de risco de dados pessoais',
    blockBody: 'O processamento de dados pessoais está sujeito a uma série de riscos predefinidos que devem ser identificados, avaliados e tratados de forma adequada e apropriada.  O impacto potencial desses riscos deve ser avaliado e analisado à luz das medidas de mitigação de risco existentes. O processo de gerenciamento de risco ainda deve gerenciar o risco residual, usando ferramentas e padrões reconhecidos. '},
  
  {start: '18', end: '23', blockHeader: 'Gestão de segurança de dados pessoais',
  blockBody: 'O processamento de dados pessoais requer segurança adequada e abrangente em torno dos ativos de informação em escopo. Como os dados pessoais - e as informações de identificação pessoal (PII) em um sentido mais amplo - representam um valor comercial e financeiro significativo, eles devem ser tratados de acordo e receber um nível adequado de proteção em termos de confidencialidade, integridade e disponibilidade. O processo de segurança de dados pessoais deve garantir um nível razoável de proteção em face dos riscos e impactos correspondentes, valendo-se das avaliações de risco e análises de impacto existentes. Ainda, deve levar em conta os processos de segurança da informação já existentes para fortalecer a proteção de dados pessoais. '},
  
  {start: '24', end: '28', blockHeader: 'Gestão cadeia de fornecimento de dados pessoais',
  blockBody: 'Quando os dados pessoais são processados por mais de uma organização, a cadeia de fornecimento de todos os controladores e processadores deve ser gerenciada e controlada. O processo de gerenciamento, portanto, inclui todos os controladores (em conjunto ou separadamente), bem como quaisquer subprocessadores que lidam com dados pessoais. O processo da cadeia de fornecimento é apoiado por acordos de processamento e controles da cadeia de fornecimento, com base nos riscos e impactos potenciais ao longo da cadeia. Além disso, replica a estrutura de governança e suas partes constituintes do nível primário de controlador (es) para quaisquer outros atores na cadeia de fornecimento. '},
  
  {start: '29', end: '32', blockHeader: 'Gestão de incidentes e violações',
  blockBody: 'Incidentes e violações relacionados à proteção e privacidade de dados (DPP) devem ser relatados. Isso inclui a notificação das autoridades supervisoras, bem como as comunicações com os titulares dos dados, real ou potencialmente afetados pela violação. De uma perspectiva organizacional, o incidente (ou eventual crise) deve ser gerenciado em termos de conformidade com os regulamentos de privacidade e proteção de dados estabelecidos, bem como continuidade de negócios e recuperação de serviços e informações. Isso requer um processo robusto de gerenciamento de incidentes e violações. '},
  
  {start: '33', end: '35', blockHeader: 'Criar e Manter Conscientização',
  blockBody: 'Proteção de dados e privacidade (DPP) como valores fundamentais dentro de uma empresa requerem consciência e informações e educação contínuas sobre o DPP. O processo de conscientização apoia todos os outros processos explicando, comunicando e reforçando as boas práticas e as expectativas do cliente. O processo de conscientização inclui ainda elementos de educação, treinamento e qualificação para garantir que as empresas tenham os conjuntos de habilidades necessários e desenvolvam seus conhecimentos de acordo com as evoluções e mudanças legislativas e regulatórias. '},
  
  {start: '36', end: '40', blockHeader: 'Organização da Função de Oficial e Proteção de Dados',
  blockBody: 'Os regulamentos de privacidade e proteção de dados exigem o estabelecimento da função de oficial de proteção de dados (DPO), seja ela realizada por um indivíduo ou um departamento. É necessário um processo para garantir que, uma vez estabelecido, o DPO execute tarefas regulares e interaja com outras partes da empresa. Ao fazer isso, o DPO deve garantir a conformidade com as leis e regulamentos. Isto implica o envolvimento do DPO em quaisquer assuntos que possam estar relacionados com o tratamento de dados pessoais, criando efetivamente uma função ampla que deve ser estruturada e bem organizada. '},
  {start: '41', end: '46', blockHeader: 'Manutenção de Controles Internos',
  blockBody: 'O processamento de dados pessoais de acordo com os regulamentos de privacidade e proteção de dados estabelecidos exige um conjunto abrangente de controles internos que garantam a conformidade e forneçam uma garantia razoável. O processo de manutenção de controles internos sobre o processamento de dados pessoais deve estar totalmente alinhado com o sistema geral de controles internos operado pela empresa. Como um subconjunto de controles, os controles de processamento de dados pessoais devem ser suportados e integrados a controles gerais e de nível empresarial para evitar duplicação ou ambiguidade O processo de manutenção dos controles internos deve seguir o ciclo de vida dos dados pessoais, conforme indicado abaixo. '}


]

dbFA=require('./fap.js');
dbLA=require('./lap.js');
dbPA=require('./pap.js');
dbNA=require('./nap.js');

dbHeader=["Estabelecer Estrutura de Governança de Proteção e Privacidade de Dados (DPP)",
'Manter registro de processamento',
'Manter Regras Corporativas Vinculantes (BCRs)',
'Manter regras de consentimento',
'Manter regras para solicitações de titulares de dados',
'Manter regras para gestão de reclamações',
'Garantir supervisão imparcial',
'Gerenciar o ciclo de vida dos dado',
'Conduzir  a identificação de dados pessoais',
'Manter a classificação de dados',
'Manter registro de dados pessoais',
'Gerenciar Dados de Categorias Especiais',
'Gerenciar apagamento (direito de ser esquecido)',
'Realizar avaliação de risco',
'Realizar Relatório de Impacto à Proteção de Dados (DPIA)',
'Gerenciar o tratamento de risco',
'Realizar validação de risco',
'Gerenciar anonimização e pseudonimização',
'Gerenciar criptografia',
'Gerenciar níveis de proteção',
'Gerenciar Resiliência',
'Gerenciar acesso',
'Gerenciar testes e avaliações',
'Gerenciar controladores e processadores',
'Gerenciar Subprocessamento',
'Manter Acordos de Processamento',
'Gerenciar o impacto da cadeia de fornecimento',
'Manter os controles da cadeia de fornecimento',
'Gerenciar Notificação',
'Gerenciar Comunicações do Titular dos Dados',
'Realizar gerenciamento de incidentes e crises',
'Gerenciar evidências e reclamações',
'Manter a conscientização em toda a empresa',
'Gerenciar habilidades e educação',
'Gerenciar Treinamento',
'Manter a função de oficial de proteção de dados (DPO)',
'Gerenciar Orçamento e Recursos',
'Gerenciar Interfaces Organizacionais',
'Gerenciar Relatórios',
'Gerenciar Serviços Externos',
'Manter os controles de aquisição de dados',
'Manter os controles de processamento',
'Manter controles de armazenamento',
'Manter controles de exclusão',
'Manter controles de monitoramento',
'Conduzir uma revisão independente'
]



/* https://github.com/kolodny/immutability-helper */
 /*setState() also accepts a function. The function accepts the previous state and current props of the component
    which it uses to calculate and return the next state. */



toggleModal = () => {
  this.setState({
    isOpen: !this.state.isOpen
  });
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
            if (h[i]===0)  { alert("Você não respondeu à pergunta" +(i+1)); return notAnswered;}
                }
              return false;}





questionBodyFn=()=>{ return null;  //NB This is to not allow the meaning to appear
  if(this.state.history[this.state.currentQuestion]===0 ) {return ' ';}
  else if(this.state.history[this.state.currentQuestion]===4 ) {return <span style={answerText}> {this.dbNA[this.state.currentQuestion]}</span>;}
  else
    if(this.state.history[this.state.currentQuestion]===3 ) {return <span style={answerText}> {this.dbPA[this.state.currentQuestion]}</span>;}
    else
      if(this.state.history[this.state.currentQuestion]===2 ) {return <span style={answerText}> {this.dbLA[this.state.currentQuestion]}</span>;}
      else
      if(this.state.history[this.state.currentQuestion]===1) {return <span style={answerText}> {this.dbFA[this.state.currentQuestion]}</span>;}
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
           let shouldemail;
           if (childData.shouldemail === undefined) {shouldemail= "no";}
           else 
             {shouldemail=childData.shouldemail;} 
           this.setState(
           { language: childData.language,
            assessment:childData.assessment,
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
           //i18n.changeLanguage(childData.language);
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
    this.toggleModal(); //want to display finishing modal
    //set({questionnaire: JSON.stringify(h)});
    // Should now make eligible !== "true" in case someone else uses the browser?

  }





finishedHandler= (e) => {
e.preventDefault();
const h=this.state.history;

if (this.anyNotAnswered(h) ===false) { // only post if complete
console.log('finished ' + h[0] +h[1] +h[2]+ h[3] +h[4]+h[5]+ h[6] +h[7]+h[8]+ h[9]  +h[10]+h[11]+ h[12] +h[13] +h[14]+ h[15]  );

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

 
  const usersRef = firebase.database().ref('/combinedusers/' + userId);
  //usersRef.update(cust);

  usersRef.update({questionnaire: JSON.stringify(h), date: new Date().toJSON(),
    shouldemail: "yes",
    currentQuestion:this.state.currentQuestion.toString(),
    currentBlock:this.state.currentBlock.toString()
  });


  // Should now make eligible !== "true" in case someone else uses the browser?




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

refreshQuestions = () =>   // is not used
  this.setState({refresh: !this.state.refresh});

//******************************************************************** 

    //<AuthUserContext.Consumer>
    //  {authUser => console.log("Home inside  render")}
    //</AuthUserContext.Consumer>

  render() {

    
if (this.state.externalData === null) { return (
  
<div style= {pageStyle} >
        <h4 style={inlineHeader}>Loading your Privacy Assessment Portugese</h4> </div>

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
        language={this.state.language}
        >
        </Question>)


    let block=(       <Block blockHeader = {this.dbBlocks[this.state.currentBlock].blockHeader}
    blockBody={this.dbBlocks[this.state.currentBlock].blockBody} > </Block>  )

    return (



    <div style= {pageStyle} >
        <h2 style={inlineHeader}>Avaliação de Privacidade e Proteção de Dados</h2>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {this.state.currentQuestion===0?"":<button onClick={this.previousQuestionHandler}> Pergunta Anterior</button>}
        &nbsp;&nbsp;&nbsp;&nbsp;
        {this.state.currentQuestion===45?"":<button onClick={this.nextQuestionHandler}> Próxima Pergunta </button>}


        {this.state.currentQuestion===0?"":<button onClick={this.saveHandler}> Salve suas Respostas </button>}

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
        {this.state.currentQuestion!==45?"":<button onClick={this.finishedHandler}> Envie suas respostas </button>}
        <ModalFinish show={this.state.isOpen}
                  onClose={this.toggleModal}>
                    Suas respostas foram enviadas ao servidor. Sua avaliação de risco será enviada a você em breve. Não se esqueça de sair.
                          </ModalFinish>

        <ModalFinish show={this.state.isOpen}
                  onClose={this.toggleModal}>
                    Suas respostas foram salvas no servidor.
                          </ModalFinish>
        {block}
        {question}
      </div>

     
    );
      }
  } //end of render

}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePrivacyPageP);


