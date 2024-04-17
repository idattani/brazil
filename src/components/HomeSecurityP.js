import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import { Chart } from "react-google-charts";
import './App.css'; 

//import './App.js';

//import Block from './Block/Block.js';
import QuestionSecurity from './Question/QuestionSecurity.js';
//import ModalFinish from './ModalFinish/ModalFinish';

//import AuthUserContext from './AuthUserContext';
import withAuthorization from './withAuthorization';
import firebase from 'firebase';

import Swal from 'sweetalert2'

//import { auth } from '../firebase';
//   was textAlign: "justify",
const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  padding: "60px",
  margin: "20px",
  textAlign: "left",
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
const gaugeStyle={
  marginLeft: "220px"
}


class HomeSecurityPageP extends Component {



toggleModal = () => {
  this.setState({
    isOpen: !this.state.isOpen,
    
  });
}

  nextQuestionHandler= () => {//cqn is the array index NOT the number

    //console.log('Next was clicked ...previous question index' + this.state.currentQuestionSecurity)
    let cqn=this.state.currentQuestionSecurity +1;
    if (cqn>20) {cqn=20;} else this.setState( {currentQuestionSecurity: cqn });
    this.forceUpdate();}

  previousQuestionHandler= () => {
    //console.log('Next was clicked ...original question number' + this.state.currentQuestionSecurity)
    let cqn=this.state.currentQuestionSecurity -1;
    if (cqn<0) {cqn=0;} else this.setState( {currentQuestionSecurity: cqn });
    this.forceUpdate();}

  historyHandler= (e) => {
    let choice=e.target.value
    
      let  h= [...this.state.historySecurity];
      const q=this.state.currentQuestionSecurity;
      h[q]=choice;
      //console.log('new historySecurity ' + h[0] +' ' +h[1]+' ' +h[2] +' ' +h[3]  +' ' +h[4]   );
      this.setState( {historySecurity: h})
      e.preventDefault();
      }

  anyNotAnswered= (h) =>{   //change to number of questions !!!!!!!
    let i;
    for (i = 0; i < 21; i++) { 
            if (h[i]===-1 )  { 
               alert("Você não respondeu à pergunta " +(i+1)); return true}
            }
    return false}
// /return notAnswered;


constructor(props){
super(props);

this.state = {
  externalData: null,
  localScore:-1,
  currentQuestionSecurity: 0,  // as a string in FB
  toThankYou:false,
  dbQuestions:{
    "questionBody":["Quantos funcionários trabalham em sua organização?",
        "Qual categoria melhor define o principal setor da sua organização?",
        "Você possui um processo de administração de usuários para novos funcionários e desligamentos?",
        'Os privilégios de usuários são revisados?',
        'Senhas complexas são aplicadas em sua organização?',
        "Funcionários, indivíduos ou terceiros têm acesso remoto à sua rede?",
        "Você realiza treinamento de conscientização sobre segurança cibernética?",
        'Os laptops  eos desktops dos funcionários são criptografados?',
        'Os backups são armazenados remotamente e, em caso afirmativo, estão devidamente protegidos?',
        'Os patches são instalados em tempo hábil?',
        'Você tem uma rede corporativa wireless/sem fio?',
        'Você tem uma rede wireless/sem fio para convidados/clientes? ',
        'Você tem políticas internas de segurança e privacidade?',
        'Você tem um departamento de segurança cibernética em sua organização? ',
        'Você tem um plano de resposta e recuperação a incidentes?',
        'Você tem um antivírus?',
        'Você tem um ambiente protegido com firewall?',
        'Você executa varreduras de vulnerabilidade interna?',
    
    
        "A sua organização foi vítima de um ataque cibernético no ano passado?",
        'Em comparação com este período no ano passado, você está mais ou menos confiante na capacidade de sua organização de responder a um incidente de segurança cibernética e se recuperar de quaisquer impactos negativos associados?',
        "A sua organização possui seguro cibernético?"
  ],

    "answers":[['1 a 49',
          '50 a 199 ',
          '200 a 499',
          '500 a 1999',
          '2000 a 4999',
          '5000 ou mais'
        ],
         [
          'Construção',
          'Serviços de electricidade, gás, água e resíduos',
          'Serviços financeiros e de seguros',
          'Saúde e assistência social',
          'Meios de informação e telecomunicações',
          'Indústria',
          'Serviços profissionais, científicos e técnicos',
          "Público, sem fins lucrativos",
          'Serviços de aluguel, locação e imobiliária',
          'Varejo',
          'Transporte, correio e armazenamento ',
          'Outro'
        ],
      
        ['Não',
        'Sim, mas não documentado',
        'Um processo formalmente documentado'
        ],
      
       ['Não',
          "As análises são realizadas ad hoc",
          'Somente contas de administrador são revisadas',
          'Todos os privilégios de usuário são monitorados periodicamente'
        ],
      
       ['Não',
          'Menos de 8 caracteres e nenhum outro requisito',
          '8 caracteres ou mais, caracteres especiais, maiúsculas e minúsculas, números e alterações obrigatórias em uma base periódica',
          'Autenticação multifator'
        ],
    
    
    
        [
        
        'Continuamente sem monitoramento ou ferramentas',
        'Ferramentas de acesso remoto para acessar a rede corporativa externamente',
        'Facilitado via VPN',
        'Não'
        ],
    
    
        ['Não',
        "Apenas para novos funcionários",
        'Para todos os funcionários periodicamente',
        'Obrigatório para todos os funcionários e gerência, periodicamente, com avaliação de entendimento.'
        ],
    
    
        [
        'Não criptografado',
        'Criptografia de arquivo',
        'Criptografia do disco rígido',
        'Criptografia completa e nenhum dado armazenado localmente'
        ],
    
        [
        'Não armazenado remotamente',
        "Sim, mas fisicamente inseguro",
        'Sim, mas não criptografado',
        'Sim, criptografado'
        ],
         
         
        ['Não monitorado',
        'Patches são instalados em uma base ad-hoc',
        'Um processo formal de gerenciamento de patch está em vigor e cobre servidores, clientes e dispositivos de segurança'
        ],
    
    
         
        ['SSID publicado com senha fraca',
        'Publicado SSID com senha complexa',
        'SSID oculto, senha complexa (+ medidas adicionais)'
        ],
    
    
        ['Sim',
        'Sim, totalmente isolado, sem acesso à rede interna',
        'Não',
        "Não, os hóspedes se conectam à nossa rede corporativa"
        ],
    
    
        ['Não',
        'já existentes/prontas',
        'Aprovado pela diretoria, treinado, assinado pelos funcionários, aplicad'
        ],
    
    
        ['Não',
        ' Funções de segurança dentro da equipe técnica / TI',
        "Equipe de Segurança Dedicada"
        ],
    
    
      ['Não',
        "Nossa equipe de resposta opera em horário comercial",
        "Nossa equipe de resposta está 24 horas por dia, 7 dias por semana, em prontidão com uma resposta imediata quando necessário"
      ],
      
      
        ['Não',
        'Instalado em computadores de funcionários',
        'Instalado em todos os computadores e servidores',
        'Proteção Avançada de End-Point'
    ],
    
        [
        'Não',
        'Firewall de nível residencial',
        'Cada ponto de entrada / saída de rede tem um firewall de nível comercial que é compatível com o fornecedor',
        'Cada ponto de entrada / saída da rede tem um firewall de nível comercial que é compatível com o fornecedor e as configurações são revisadas periodicamente'
        ],
         
        ['Não',
        'Ad hoc',
        'As varreduras de vulnerabilidade interna estão sendo executadas em todos os sistemas pelo menos uma vez por ano',
        'Teste de penetração anual é realizado'
        ],
    
        ['Sim',
        'Não',
        'Não sei',
        "Prefiro não divulgar esta informação"
        ],
    
    
        
        ['Mais confiante',
        'Menos confiante',
        'Nenhuma diferença no nível de confiança',
        'Não sei / prefiro não dizer'
        ],
    
    
       [
      'Não - não tínhamos conhecimento deste tipo de seguro',
      'Não - nós não sentimos que precisamos',
      'Não - acreditamos que este risco está coberto por outras apólices de seguro que temos',
      'Não - nós no auto-seguramos',
      'Ainda não - estamos considerando isso',
      'Sim - temos uma política cibernética autônoma',
      'Sim - temos isso coberto como uma extensão de outra apólice de seguro',
      'Sim - mas não sei como a política foi estabelecida',
      'Não sei / prefiro não dizer'
      ]
    
    
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
//this.routeChange = this.routeChange.bind(this);

}


componentDidMount() {
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
        //let language=childData.language;   NOT USED YET but are correct
        //let assessment=childData.assessment;
        let historySecurity;  
        let currentQuestionSecurity;  //to be an integer when working with it... a string in FB
        let shouldemailSecurity;
        let shouldemailJson;

        if (childData.currentQuestionSecurity === undefined) {currentQuestionSecurity= 0;}
        else 
          {currentQuestionSecurity=parseInt(childData.currentQuestionSecurity,10);}
        
        if (childData.shouldemailSecurity === undefined) {shouldemailSecurity= "no";}
          else 
            {shouldemailSecurity=childData.shouldemailSecurity;}  
        if (childData.shouldemailJson === undefined) {shouldemailJson= "no";}
          else 
            {shouldemailJson=childData.shouldemailJson;}
              
           //console.error("historySecurity "  + historySecurity)
           //historySecurity an array when using, a string in FB
           if (childData.historySecurity===undefined)
              {historySecurity=[-1,-1,-1,-1,-1,  -1,-1,-1,-1,-1,  -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1]}
            else{historySecurity=JSON.parse(childData.historySecurity);}
           //console.error("historySecurity ********************* "  + historySecurity[2])
           this.setState(
           { language: childData.language,
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
    toThankYou: false}), alert("Responses have been saved. You can return at any time")  )
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
// Now return value for display
  return scorePercentSecurityString
}

finishedHandler= (e) => {
e.preventDefault();
const h=this.state.historySecurity;

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
              title: 'Respostas Salvas',
              html: 'Pontuação de Computação ',
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
              this.forceUpdate();
              //console.log("   localScore  ******************* " +this.state.localScore)
              let whatToWrite=""
              if( score<20){whatToWrite=" O nível de maturidade da sua organização é quase inexistente. Você precisa começar rapidamente a abordar até as etapas mais básicas. O relatório que será enviado por e-mail descreverá as áreas em que é possível melhorar imediatamente e os serviços que podemos oferecer para ajudar."}
              if(score>=20 && score<40){whatToWrite=" O nível de maturidade da sua organização é Básico. Embora você tenha pensado em segurança, vamos ser francos. Sua pontuação indica sérias vulnerabilidades. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar."}
              if(score>=40 && score<60){whatToWrite=" O nível de maturidade da sua organização é Prudence. A pontuação indica que você pensou em segurança, mas vários problemas precisam ser resolvidos. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar. "}
              if(score>=60 && score<85){whatToWrite="O nível de maturidade da sua organização é Diligence. Você está no caminho certo! De acordo com suas respostas, a maioria das medidas elementares e algumas avançadas estão em vigor. Isso significa que sua organização é capaz de responder a todos os ataques cibernéticos? Provavelmente não, mas podemos ajudá-lo a alcançar as melhores práticas. O relatório que será enviado por e-mail descreverá áreas em que melhorias imediatas podem ser feitas e os serviços que podemos oferecer para ajudar."}
              if(score>=85 ){whatToWrite="O nível de maturidade da sua organização é uma prática recomendada. A pontuação indica que você pensou muito em segurança, mas vários problemas ainda podem ser resolvidos. O relatório que será enviado por email sugerirá como resolvê-los."}


              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                  icon: 'success',
                  title: 'Sua pontuação de segurança é : '+ this.computeScore() + " % " ,
                  text:   whatToWrite,
                
                })

               
                //this.forceUpdate();

              }
            })


          }
 
          )
        )
}

return   

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


 getData = 
   () => {
   let x;
  let userId = firebase.auth().currentUser.uid; 
  const usersRef = firebase.database().ref('/combinedusers/' + userId);
  usersRef.on("value", (snapshot) => {
    let childData = snapshot.val();
    //console.log( "  childData.scoreSecurity   " + childData.scoreSecurity)
    x=childData.scoreSecurity;
    //console.log( "in getData   x  "+x)
  })

  return  [
        ["Label", "Value"],
        ["Risko", 100-parseFloat(x)]     //this.state.localScore
        ]
  
}

  render() {


if (this.state.externalData === null) { return (
  
<div style= {pageStyle} >
        <h4 style={inlineHeader}>Carregando sua avaliação de segurança </h4> </div>

);
  // Render loading state ...
} else {
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


  if (this.state.localScore<0){
   return ( <div> &nbsp;


    <div style= {pageStyle} >
      <h2 style={inlineHeader}>Avaliação de segurança</h2>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {this.state.currentQuestionSecurity===0?"":<button onClick={this.previousQuestionHandler}> Pergunta anterior </button>}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {this.state.currentQuestionSecurity===20?"":<button onClick={this.nextQuestionHandler}> Próxima questão </button>}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {this.state.currentQuestionSecurity===0?"":<button onClick={this.saveHandler}>Salve suas respostas até agora </button>}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {this.state.currentQuestionSecurity===20?<Button variant="warning" onClick={this.finishedHandler}> Enviar </Button>:""}
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
      {this.state.currentQuestion!==20?"":<button onClick={this.finishedHandler}> Envie suas respostas </button>}

      {question}
      </div>
      </div>)
    }
      
      else { 

        let g= (<Chart 
        width={800}
        height={240}
        chartType="Gauge"
        loader={<div>Carregando o medidor de pontuação</div>}
        data={this.getData()}
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
        /> )
        
    return (<div style= {gaugeStyle}>
    <p>&nbsp;</p> <p>&nbsp;</p>  <p>&nbsp;</p> 
     {'                                            '}{g}
    </div>
    )

                }; //end of else


    } //end of else
  } //end of render

}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomeSecurityPageP);


