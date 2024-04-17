import React,{Component}  from 'react';
import './Question.css';
import '../Button/Button';
import {Button} from 'react-bootstrap';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { withTranslation } from 'react-i18next';


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
    }
  }
}));

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

class QuestionSecurity extends Component {

  constructor(props) {
  super(props);

  this.styleSelector = this.styleSelector.bind(this);
  this.listRBs = this.listRBs.bind(this);

}


styleSelector=( n)=>
{let hv=this.props.historyValue
//console.log("History Value prior to listing buttons and n " +hv  + "  " +n)
if(parseInt(hv,10)===n) return "outline-primary btn-warning text-left" ; 
return "outline-primary text-left" 
}

 //  variant="outline-primary  text-left" 
listRBs=(title,arrayOfAnswers, qn) =>{
//console.error("title " + title + "arrayOfAnswers " + arrayOfAnswers +"qn " +qn)
  const { t } = this.props;
  let i=-1
  let particularQuestionAnswers=arrayOfAnswers[qn]
  const listItems = particularQuestionAnswers.map((answer) =>{
    i++;
    let v=this.styleSelector(i);
    //console.log("styleSelector " + v  +  " and i   " +i)
    return (
      <FormControlLabel key={i} value={i} control={<StyledRadio />} label={t(`security_assessment.${answer}`)} />
    // <ListItem key={i}>
    //   <Button key={answer} value={i} onClick={(e) =>{this.props.clickHistory(e); this.setState({value: answer});}} 
    //   variant={v} action="true"
    //   >  {answer}</Button>
    // </ListItem>
    )}
         ); //end of map
  return listItems;
}



render(){
  // const {classes} = this.props;
  const { t } = this.props;
  return(
  <div className="Question" style={{width: '100vw', color: '#02397f', minHeight: '61vh'}}>
    <span  id="number-block"> {this.props.questionNumber +1}</span>
    {/* <p></p> */}
    <div style={{display: 'flex', marginTop: '20px'}}>
      <FormControl component="fieldset" style={{width: '100%'}}>
        <FormLabel component="legend" style={{color: '#02397f'}}><strong>{t(`security_assessment.${this.props.questionSet.questionBody[this.props.questionNumber]}`)}</strong>
          { this.props.questionSet.helpText[this.props.questionNumber] !== '' &&
              <Tooltip title={this.props.questionSet.helpText[this.props.questionNumber]} style={{maxWidth: '500px'}}>
                <IconButton aria-label="help" style={{color: '#02397f'}}>
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
          }
        </FormLabel>
        <RadioGroup value={this.props.historyValue} onChange={(e) => this.props.clickHistory(e)} aria-label={t(`security.assessment.${this.props.questionSet.questionBody[this.props.questionNumber]}`)} name="customized-radios">
        {this.listRBs(
          (this.props.questionSet.questionBody)[this.props.questionNumber]  , this.props.questionSet.answers, this.props.questionNumber)}
        </RadioGroup>
      </FormControl>
      {/* <List dense style={{width: '100%', maxWidth: 250}}>
        {this.listRBs(
          (this.props.questionSet.questionBody)[this.props.questionNumber]  , this.props.questionSet.answers, this.props.questionNumber)}
      </List> */}
    </div>
  </div>
 
  )
};
}
export default withTranslation()(QuestionSecurity);
