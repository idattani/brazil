import React, {useState} from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
  minHeight: '77vh'
};

const horizontalList = {
  display: 'flex',
  flexDirection: 'row',
  padding: 0,
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

let glossaries = [
  "Access Control",
  "Advanced Persistent Threat",
  "Adware",
  "Antivirus Software",
  "Behavioural Based Analysis",
  "Binding Corporate Rules (BCRs)",
  "Blacklist",
  "Bot",
  "Brazilian Supervisory Authority",
  "Brute Force Attack",
  "CISO",
  "CISO-as-a-Service",
  "Confidentiality, Integrity and Availability (CIA)",
  "Controllers and Processors",
  "Critical Hour Golden Hour",
  "Critical Hour Framework",
  "Cross Site Scripting",
  "Cyberattack",
  "Cyber Security Incident",
  "Cyber Security",
  "Cyber Security Operations Centre",
  "Data Anonymisation and Pseudonymisation",
  "Data Classification",
  "Data Governance",
  "Data Life Cycle",
  "Data Processing",
  "Data Protection and Governance Framework",
  "Data Protection Officer (DPO)",
  "Data Protection Impact Assessment",
  "Data Processing Register",
  "Data Security",
  "Data Subject Requests",
  "Data Supply Chain",
  "Distributed Denial-of-Service",
  "Dumpster Diving",
  "Encryption",
  "Encryption Strategy",
  "Evidence and Claims",
  "Exploit Kit",
  "External Services",
  "Form Grabber",
  "Hacker",
  "Hashing",
  "Honeypot",
  "Identity and Access Management (IAM) process",
  "Impartial Oversight",
  "Incident and Crisis Management",
  "Internal Control System (ICS)",
  "Intrusion Detection and Prevention System",
  "Information Security",
  "Insider Threat",
  "Internal Vulnerability Scans",
  "Keylogging",
  "Kill Chain",
  "Lateral Movement",
  "Logic Bomb",
  "Network Security",
  "Organisational Interfaces",
  "Patches",
  "Passive Attack",
  "Password Sniffing",
  "Personal Data Identification",
  "Personal Data Register",
  "Personally Identifiable Information (PII)",
  "Penetration Testing",
  "Pharming",
  "Phishing",
  "Probing",
  "Processing Agreements",
  "Ransomware",
  "Rainbow Table Attack",
  "Resilience",
  "Right to be Forgotten",
  "Risk Evaluation",
  "Roles and responsibilities (RACI)",
  "Rules for Consent",
  "Rules for Managing Complaints",
  "Sandbox",
  "Security Monitoring",
  "Shoulder Surfing",
  "SIEM",
  "Signature Based Analysis",
  "Smishing",
  "Special Categories Data",
  "Spear phishing",
  "SQL Injection",
  "Sub-Processing",
  "Supply Chain Controls",
  "Supply Chain Impact",
  "Testing and Assessment of Personal Data Security",
  "Test of Design (ToD)",
  "Test of Effectiveness (ToE)",
  "Threat Management",
  "Threat Hunting",
  "Trojan Horse",
  "User Privileges",
  "Virtual Private Network",
  "Vishing",
  "Vulnerability Management",
  "Water Holing",
  "Whaling",
  "Wireless Network",
  "Whitelist",
  "White Hat Hacker",
  "Worm"
];




const GlossaryPage = () =>{
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  let alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  const [displayGlossaries, setDisplayGlossaries] = useState(glossaries);
  let selectedAlphabet = null;
  let selectedAlphabetRegex = /^A/;

  const displayGlossary = (alphabet) => {
    selectedAlphabet = alphabet;
    selectedAlphabetRegex = new RegExp(`^${selectedAlphabet}`);
    const filteredGlossaries = glossaries.filter((glossary) => selectedAlphabetRegex.test(glossary));
    setDisplayGlossaries(filteredGlossaries)
  };
  return(

      
    <div style={pageStyle}>
      <h3>{t('Glossary')}</h3>
      {
        i18n.language != 'pt-BR' &&
        <List style={horizontalList}>
          {
            alphabets.map((alphabet) =>
            <ListItem key={alphabet}>
              <ListItemText style={{cursor: 'pointer'}} onClick={() => displayGlossary(alphabet)} primary={alphabet}/>
            </ListItem>
            )
          }
        </List>
      }
      {
        displayGlossaries.length > 0 &&
        displayGlossaries.map((glossary) =>
          <Accordion key={glossary} style={{color: 'rgb(2, 57, 127)'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{t(`glossary.${glossary}.title`)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {t(`glossary.${glossary}.description`)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      }
      {
        displayGlossaries.length <=0 &&
        <Typography>
          {t('No Content Available')}
        </Typography>
      }
    </div>)};
export default GlossaryPage;
