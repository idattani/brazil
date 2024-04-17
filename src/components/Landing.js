import React from 'react';
import keyTable from './table.js';
import Navigation from './Navigation';
//import tableData from './table.js';

import { makeStyles } from '@material-ui/core/styles';

import { Trans, useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  // padding: "80px",
  // margin: "20px",
  textAlign: "justify",
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all', // 'ms' is the only lowercase vendor prefix
  color: '#02397f',
  minHeight: '75vh',
  display: 'flex',
  justifyContent: 'center',
  flexFlow: 'column wrap',
  alignItems: 'center',
  width: '66vw',
  marginLeft: '14.65vw'
};

//NB If don't have the hyphens then get warning !
var tableData = {
  columns: ['Key', 'Meaning'],
  rows: [{
    'Key': 'FA',
    'Meaning':'Fully-Accomplished'

  }, {
    'Key': 'LA',
     'Meaning':'Largely-Accomplished'
  }, {
    'Key': 'PA',
     'Meaning':'Partially-Accomplished'
  }, {
    'Key': 'NA',
     'Meaning':'Not-Accomplished'
  }
]
};


const LandingPage = () =>{
const classes = useStyles();
const { t } = useTranslation();
return(

    
  <div style={pageStyle}>
    <h3>{t('Your Privacy, Data Protection and Cyber Security assessment tools')}</h3>
    <p>{t('This application allows access to a data protection and Privacy Risk assessment tool')}</p>
    <p><Trans i18nKey='Your assessment of Privacy Risk is based on your answers'>Your assessment of <b>Privacy Risk</b> is based on your answers to the 46 statements.  Please make sure to drill down into the statement details, as you may have a category that shows the organization is in good condition, but one or more of the elements may need particular attention. Note that the <b>Privacy Assessment</b> is designed as a high-level, quick assessment; it should not be considered inclusive of all proper information, procedures and tests or exclusive of other information, procedures and tests required in evaluating normative compliance.</Trans></p>

{/*  
<p> When your answer the questions select the response according to the table below </p>
 {keyTable(tableData)}
<p> As the risk assessment may take some time please set aside about 45 minutes. You can however stop at any time and continue later. You save the answers you have selected and then sign out. When you sign in your previous answers are reinstated. They can then be changed and additional questions answered. When you have answered all 46 questions you have the option of submitting the answers.  </p>
*/}
<p><Trans i18nKey='The assessment of your Organisation-Security Risk is based on your answers'>The assessment of your <b>Organisation-Security Risk</b> is based on your answers to the 16 statements.  Additional questions relate to the impact of the risk. Please set aside around 10 minutes.</Trans></p>


<p><Trans i18nKey="If this is your first visit"><b>If this is your first visit</b> click on the <i>Sign In</i> tab at the top of the page and then choose <i>Sign Up</i>.</Trans></p>
<p>{t('To start your assessment select one of the questionnaire pages')}</p>

<p>
 V1.2
</p>
</div>)};
export default LandingPage;
