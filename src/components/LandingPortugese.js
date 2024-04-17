import React from 'react';
// import keyTable from './table.js';
//import tableData from './table.js';
const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  padding: "80px",
  margin: "20px",
  textAlign: "justify",
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

//NB If don't have the hyphens then get warning !
// var tableData = {
//   columns: ['Palavras-Chave', 'Significada'],
//   rows: [{
//     'Palavras-Chave': 'FA',
//     'Significada':'Totalmente-realizado'

//   }, {
//     'Palavras-Chave': 'LA',
//      'Significada':'Realmente-realizado'
//   }, {
//     'Palavras-Chave': 'PA',
//      'Significada':'Parcialmente realizado'
//   }, {
//     'Palavras-Chave': 'NA',
//      'Significada':'Não realizado'
//   }
// ]
// };

const LandingPage = () =>
  <div  style= {pageStyle}>
  <h3> Suas ferramentas de avaliação de privacidade, proteção de dados e segurança </h3>
    <p> Este aplicativo permite o acesso a uma ferramenta de avaliação de risco de privacidade e uma
ferramenta de avaliação de segurança cibernética para uma organização. O uso de cada ferramenta
é gratuito. </p>
    <p> Após o envio de suas respotas, um resumo por escrito será compartilhado com você. </p>
    <p> A sua avaliação do <b>Risco de Privacidade</b> é baseada em suas respostas a 46 perguntas. Certique-se de
verificar os detalhes de cada declaração, pois algumas categorias podem mostrar que a organização
está em boas condições, mais um ou mais elementos podem precisar de atenção especial. Note que
a <b>Avaliação de Privacidade</b> é projetada para oferecer uma avaliação rápida e uma visão geral. A
mesma não deve ser considerada inclusiva de todas as informações, procedimentos e testes exigidos
na avaliação de conformidade normativa. </p>
{/*
<p> Quando você responder às perguntas, selecione a resposta de acordo com a tabela abaixo </p>
 {keyTable (tableData)}
<p> Como a avaliação de risco pode levar algum tempo, reserve cerca de 45 minutos. No entanto, você pode parar a qualquer momento e continuar mais tarde. Salve as respostas selecionadas e saia. Quando você faz login, suas respostas anteriores são restabelecidas. Eles podem ser alterados e outras perguntas respondidas. Depois de responder a todas as 46 perguntas, você tem a opção de enviar as respostas. </p>
*/}
<p> A avaliação do <b>risco de segurança da sua organização</b> é baseada em suas respostas a 16 perguntas.
Perguntas adicionais estão relacionadas ao impacto do risco. Reserve cerca de 10 minutos para
realizar o questionário. </p>

<p> <b>Se esta é sua primeira visita</b>, clique em Fazer login no topo da página e escolha Cadastre-se</p>
<p> Para iniciar sua avaliação, selecione uma das páginas do questionário.</p>
<p>
 V1.2
</p>




  </div>

export default LandingPage;
