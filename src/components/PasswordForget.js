import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../firebase';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';


const styles = (theme) => ({
  paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

const PasswordForgetPage = () => {
  const { t } = useTranslation();
  return (
    <div style={{color: '#02397f', minHeight: '77vh'}}>
      <h2>Forgotten Your Password?/ Esqueceu sua senha?</h2>
      <p> Enter your email address  and press 'Reset My Password'/Coloque seu endereço de email e aperte 'recupear minha senha'.</p>
      <p> This will send you an email that will allow you to enter a new password/ Você receberá um email que permitirá que você insira uma nova senha. </p>
      <PasswordForgetForm t={t} />
    </div>
  )};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
  loading: false
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        this.setState({loading: false});
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        this.setState({loading: false});
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
      loading
    } = this.state;

    // const isInvalid = email === '';
    const { t } = this.props;
    const classes = styles;
    return (
      <Container component="main" maxWidth="md" style={{marginLeft: '0px'}}>
				<CssBaseline />
        <div>
					{/* <Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar> */}
					{/* <Typography component="h1" variant="h5">
            Forgotten Your Password?/ Esqueceu sua senha?
					</Typography> */}
          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
          <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('Email Address')}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={error ? true : false}
                  onChange={event => this.setState(byPropKey('email', event.target.value))}
                />
              </Grid>
              <Grid item xs={6} style={{alignSelf: 'center'}}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  style={{padding: '15px', marginTop: '8px'}}
                  disabled={loading || !this.state.email}
                >
                  {t('Reset My Password')}
                  {loading && <CircularProgress size={30} className={classes.progess} />}
                </Button>
              </Grid>
            </Grid>
						{error && error.message && (
							<Typography variant="body2" style={{color: 'red', fontSize: '0.8rem', marginTop: 10}}>
								{error.message}
							</Typography>
						)}
					</form>
				</div>
      </Container>
      // <form onSubmit={this.onSubmit}>
      //   <input
      //     value={this.state.email}
      //     onChange={event => this.setState(byPropKey('email', event.target.value))}
      //     type="text"
      //     placeholder="Email Address/Endereço de Email"
      //     style={{height: '30px', width : '300px'}}
      //   />
      //   <button disabled={isInvalid} type="submit" style={{height: '30px', width : '400px'}}  >
      //     Reset My Password/Recuperar minha senha 
      //   </button>

      //   { error && <p>{error.message}</p> }
      // </form>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to="/pw-forget">Forgot Password? / Esqueceu a senha?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
