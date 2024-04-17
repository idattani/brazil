import React from 'react';
import './Question.css';
import '../Button/Button';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

//import { withTranslation } from 'react-i18next';

// Import a pre-configured instance of i18next
//import i18n_unused from './i18n';
//const I18n = reactI18next.I18n

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: '100%',
  //   maxWidth: 250,
  //   // backgroundColor: theme.palette.background.paper,
  // },
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  radio: {
    '&$checked': {
      color: '#25ad1b'
    }
  },
  checked: {
  },
  icon: {
    borderRadius: '50%',
    width: 20,
    height: 20,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#00796b',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 20,
      height: 20,
      backgroundImage: 'radial-gradient(yellow,yellow 40%,transparent 50%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  }
}));

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="primary"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

const question=(props) => {

  

  const style={
    backgroundColor: 'white',
    font: 'inherit',
    border: '1px solid #25ad1b',
    borderRadius: '20px',
    padding: '10px',
    cursor: 'pointer' };

    const styleChosen={
      backgroundColor: 'yellow',
      font: 'inherit',
      border: '1px solid #25ad1b',
      borderRadius: '20px',
      padding: '10px',
      cursor: 'pointer' };
  

// function styleSelector(historyValue, n)
// {if(historyValue===n) {return styleChosen;} else {return style;}}

const { t } = useTranslation();
const l=props.language;
//console.error("*************************************" + l)
let a1,a2,a3,a4
if (l==='Portugese'){a1="100% Completo";a2="50% - 99% Completo";a3="49% - 10% Completo"; a4="9% - 0% Completo";}
else {a1="100% Complete";a2="50% - 99% Complete";a3="49% - 10% Complete"; a4="9% - 0% Complete";}
let complete = t('Complete');
let fullyCarriedOut = t('Fully carried out');
let significantProgressHasBeenMade = t('Significant progress has been made');
let anInitialStartHasBeenMade = t('An initial start has been made');
let nothingHasBeenDone = t('Nothing has been done');
a1 = `100% ${complete} (${fullyCarriedOut})`;
a2 = `50% - 99% ${complete} (${significantProgressHasBeenMade})`;
a3 = `10% - 49% ${complete} (${anInitialStartHasBeenMade})`;
a4 = `0% - 9% ${complete} (${nothingHasBeenDone})`;
//{t("complete")}

return(
  

  
  <div className="Question" style={{color: '#02397f', minHeight: '50vh'}}>
      <span  id="number-block"> {props.questionNumber +1}</span>
      {/* <span> &emsp; &emsp; &emsp;{props.questionHeader}</span>
      <p></p> */}
      &emsp;&emsp;&emsp;&emsp;
      <div style={{display: 'flex', marginTop: '20px', flexDirection: 'column'}}>
        <FormControl component="fieldset" style={{width: '100%'}}>
          <FormLabel component="legend" style={{color: '#02397f'}}><strong>{t(`privacy_data_protection.${props.questionHeader}`)+'?'}</strong></FormLabel>
          <RadioGroup value={props.historyValue} onChange={(e) => props.clickHistory(parseInt(e.target.value))} aria-label={props.questionHeader} name="customized-radios">
            <FormControlLabel value={1} control={<StyledRadio />} label={a1} />
            <FormControlLabel value={2} control={<StyledRadio />} label={a2} />
            <FormControlLabel value={3} control={<StyledRadio />} label={a3} />
            <FormControlLabel value={4} control={<StyledRadio />} label={a4} />
          </RadioGroup>
        </FormControl>

      <p id="p_wrap">{props.questionBody}</p>
      </div>

  </div>

)
}

//</I18n>

//)

export default question;
