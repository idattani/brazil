import React from 'react';

import { useTranslation } from 'react-i18next';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';



const styles = makeStyles((theme) => ({
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


const INITIAL_STATE = {
  language:"Portuguese",
};

const lngs = {
  en: { nativeName: 'English' },
  "pt-BR": { nativeName: 'Portuguese' }
};

const StyledRadio = (props) => {
  const classes = styles();
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
};

const LanguageSwitcher = (props)=>{

  const { t, i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (

    <FormControl component="fieldset">
      <RadioGroup aria-label="Choose Language" name="choose-language" value={i18n.language} onChange={handleChange}>
        {
          Object.keys(lngs).map((lng) => (
            <FormControlLabel key={lng} control={<StyledRadio />} value={lng} label={t(lngs[lng].nativeName)}
            />
          ))
        }
      </RadioGroup>
    </FormControl>

    // <div>
    //   <header className="App-header">
    //     <div>
    //       {Object.keys(lngs).map((lng) => (
    //         <button key={lng} style={{ fontWeight: i18n.language === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
    //           {lngs[lng].nativeName}
    //         </button>
    //       ))}
    //     </div>
    //   </header>
    // </div>
  //   <div> <h4>Please choose your language/Por favor escolha seu idioma </h4>  
      
  //   <Form.Group inline>
  //    <label>{t("Language Choice")}</label>
  //    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Form.Radio label="English" checked={l === 'en'} value="en" 
  //    onClick={() => {setLanguage('en'); props.setMyLanguage("English");
  //    i18n.changeLanguage("en");} }/>
  //    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Form.Radio label="Portugese" checked={l === 'por'} value="por" 
  //    onClick={() => {setLanguage('por'); props.setMyLanguage("Portugese");
  //     i18n.changeLanguage("por")} }/>
  //   </Form.Group>
    
  )
}



    


export default LanguageSwitcher;
