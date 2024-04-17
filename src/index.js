import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

const locale = navigator.language;
console.log('locale', locale);


ReactDOM.render(

<I18nextProvider i18n={i18n}>
<App />
</I18nextProvider>,



 document.getElementById('root'));
registerServiceWorker();
