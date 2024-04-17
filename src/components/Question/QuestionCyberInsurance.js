import React from 'react';
import './Question.css';
import '../Button/Button';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles((theme) => ({
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

  

    const style = {
        backgroundColor: 'white',
        font: 'inherit',
        border: '1px solid #25ad1b',
        borderRadius: '20px',
        padding: '10px',
        cursor: 'pointer'
    };

    const styleChosen = {
        backgroundColor: 'yellow',
        font: 'inherit',
        border: '1px solid #25ad1b',
        borderRadius: '20px',
        padding: '10px',
        cursor: 'pointer'
    };
  

const { t } = useTranslation();
const l = props.language;

let yes = t('Yes');
let no = t('No');
console.log('currentQuestion', props.questionNumber);
return (
        <div className="Question" style={{color: '#02397f', minHeight: '50vh'}}>
            {
                props.questionNumber > 0 && (
                    <span  id="number-block"> {props.questionNumber}</span>
                )
            }
            &emsp;&emsp;&emsp;&emsp;
            <div style={{display: 'flex', marginTop: '20px', flexDirection: 'column'}}>
                {
                    props.questionNumber === 0 &&
                    (
                        <FormControl component="fieldset" style={{width: '100%'}}>
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['companyName']} fullWidth name="companyName" onChange={e => props.updatePropertyValue('companyName', e.target.value)} label={t('cyber_insurance_application.Company’s Name')} />
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['sector']} fullWidth name="sector" onChange={e => props.updatePropertyValue('sector', e.target.value)} label={t('cyber_insurance_application.Sector')} />
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['address']} fullWidth name="address" onChange={e => props.updatePropertyValue('address', e.target.value)} label={t('cyber_insurance_application.Address')} />
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['registrationNumber']} fullWidth name="registrationNumber" onChange={e => props.updatePropertyValue('registrationNumber', e.target.value)} label={t('cyber_insurance_application.Registration Number')} />
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['website']} fullWidth name="website" onChange={e => props.updatePropertyValue('website', e.target.value)} label={t('cyber_insurance_application.Website')} />
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['annualRevenue']} fullWidth name="annualRevenue" onChange={e => props.updatePropertyValue('annualRevenue', e.target.value)} label={t('cyber_insurance_application.Annual revenue')} />
                            <TextField required variant="outlined" margin="normal" value={props.historyValue['revenueFromUSA']} fullWidth name="revenueFromUSA" onChange={e => props.updatePropertyValue('revenueFromUSA', e.target.value)} label={t('cyber_insurance_application.% of revenue coming from USA')} />
                        </FormControl>
                    )
                }
                {
                    props.questionNumber > 0 &&
                    (
                        <FormControl component="fieldset" style={{width: '100%'}}>
                            <FormLabel component="legend" style={{color: '#02397f'}}><strong>{t(`cyber_insurance_application.${props.questionHeader}`)}</strong></FormLabel>
                            <RadioGroup value={props.historyValue} onChange={(e) => props.clickHistory(parseInt(e.target.value))} aria-label={props.questionHeader} name="customized-radios">
                                <FormControlLabel value={1} control={<StyledRadio />} label={yes} />
                                <FormControlLabel value={2} control={<StyledRadio />} label={no} />
                            </RadioGroup>
                        </FormControl>
                    )
                }
                
            {
                props.questionBody && <p id="p_wrap">{props.questionBody}</p>
            }
            </div>

        </div>
    )
}

export default question;
