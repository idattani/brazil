import React,{Component}    from 'react';
import './Question.css';
import '../Button/Button';
import { useTranslation,I18n  } from 'react-i18next';

import i18n from '...i18n.js';
// Import a pre-configured instance of i18next
//import i18n_unused from './i18n';
//const I18n = reactI18next.I18n


//const { t, i18n } = useTranslation();

const style={
  width: '5em',
  backgroundColor: 'white',
  font: 'inherit',
  border: '1px solid blue',
  padding: '8px',
  cursor: 'pointer' };

const styleChosen={
    width: '5em',
    backgroundColor: 'yellow',
    font: 'inherit',
    border: '1px solid blue',
    padding: '8px',
    cursor: 'pointer' };

class question extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: 'en'
    }
    this.onLanguageChanged = this.onLanguageChanged.bind(this)
  } 

  componentDidMount() {
    i18n.on('languageChanged', this.onLanguageChanged)
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this.onLanguageChanged)
  }

  onLanguageChanged(lng) {
    this.setState({
      lng: lng
    })
  }



styleSelector=(historyValue, n) =>
{if(historyValue===n) {return styleChosen;} else {return style;}}

render() {
    

return(
  
  <div className="Question">
      <span  id="number-block"> {this.props.questionNumber +1}</span>
      <span> &emsp; &emsp; &emsp;{this.props.questionHeader}</span>
      <p></p>
      &emsp;&emsp;&emsp;&emsp;
    <button  style={this.styleSelector(this.props.historyValue,1)} onClick={this.props.clickHistory.bind(this,1)} >&nbsp;&nbsp; {i18n.t("complete")} &nbsp;&nbsp;&nbsp;&nbsp;</button>
    &emsp;
    <button style={this.styleSelector(this.props.historyValue,2)} onClick={this.props.clickHistory.bind(this,2)} >&nbsp; {i18n.t("mostly complete")} &nbsp;</button>
    &emsp;
    <button style={this.styleSelector(this.props.historyValue,3)} onClick={this.props.clickHistory.bind(this,3)} >{i18n.t("done some work")}</button>
    &emsp;
    <button style={this.styleSelector(this.props.historyValue,4)} onClick={this.props.clickHistory.bind(this,4)} >&nbsp;{i18n.t("not done anything")}</button>

   <p id="p_wrap">{this.props.questionBody}</p>


  </div>

)
}
}
//</I18n>

//)

export default question;
