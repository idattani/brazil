import React from 'react';

import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

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


const AccountPage = () => {
  const { t } = useTranslation();
  return (
  <AuthUserContext.Consumer>
    {authUser =>
      <div style={pageStyle}>
        <Typography variant="h5">
          {t('Language Choice')+'/'}{t('Account Management')}
        </Typography>
        <LanguageSwitcher />
        <Typography variant="h5">
          {t('Forgotten Your Password?')}
        </Typography>
        <Typography variant="body2">
          {t('Enter your email address  and press reset my password')}
          {t('This will send you an email that will allow you to enter a new password')}
        </Typography>
        <Typography variant="body2">
          Account: {authUser.email}
        </Typography>
        <PasswordForgetForm t={t} />
        <Typography variant="h5">
          {t('Want to Change your Password?')}
        </Typography>
        <Typography variant="body2">
          {t('Enter your new password and then repeat')}
          {t('Then click the reset button')}.
        </Typography>
        <PasswordChangeForm t={t} />
        <Typography variant="body2">
        {t('Any problems that you cannot resolve please contact')}
        </Typography>
      </div>
    }
  </AuthUserContext.Consumer>
  )}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
