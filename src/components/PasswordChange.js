import React, { Component } from 'react';

import { auth } from '../firebase';
import { Link } from 'react-router-dom';

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

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

//<h3>PasswordChange</h3>
const PasswordChangePage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PasswordChangeForm t={t} />
    </div>
  )};

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
  loading: false
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
      loading
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';
    
    const classes = styles;
    const { t } = this.props;

    return (
      <Container component="main" maxWidth="md" style={{marginLeft: '0px'}}>
				<CssBaseline />
        <div className={classes.paper}>
					{/* <Typography component="h1" variant="h5">
            Want to Change your Password?/ Quer atualizar a sua senha?
					</Typography> */}
          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={t('New Password')}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={error ? true : false}
                  onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label={t('Confirm New Password')}
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
                  onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                />
              </Grid>
              <Grid item xs={4} style={{alignSelf: 'center'}}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  style={{padding: '15px', marginTop: '8px'}}
                  disabled={loading || !this.state.passwordOne || !this.state.passwordTwo}
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
      //     value={passwordOne}
      //     onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
      //     type="password"
      //     placeholder="New password/Nova senha "
      //     style={{height: '40px', width : '400px'}}
      //   />
      //   <input
      //     value={passwordTwo}
      //     onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
      //     type="password"
      //     placeholder="Confirm New Password/Confirme a nova senha"
      //     style={{height: '40px', width : '400px'}}
      //   />
      //   <button disabled={isInvalid} type="submit"
      //   style={{height: '40px', width : '400px'}}>
      //     Reset My Password/Recuperar minha senha
           
      //   </button>

      //   { error && <p>{error.message}</p> }
      // </form>
    );
  }
}

const PasswordChangeLink = () =>
  <p>
    <Link to="/pw-change">Change Password?/ Mudar senha?</Link>
  </p>

  export default PasswordChangePage;

  export {
    PasswordChangeForm,
    PasswordChangeLink,
  };
