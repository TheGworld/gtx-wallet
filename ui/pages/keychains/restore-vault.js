import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createNewVaultAndRestore,
  unMarkPasswordForgotten,
} from '../../store/actions';
import { DEFAULT_ROUTE } from '../../helpers/constants/routes';
import TextField from '../../components/ui/text-field';
import Button from '../../components/ui/button';

class RestoreVaultPage extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    createNewVaultAndRestore: PropTypes.func.isRequired,
    leaveImportSeedScreenState: PropTypes.func,
    history: PropTypes.object,
    isLoading: PropTypes.bool,
  };

  state = {
    seedPhrase: '',
    password: '',
    confirmPassword: '',
    seedPhraseError: null,
    passwordError: null,
    confirmPasswordError: null,
  };

  parseSeedPhrase = (seedPhrase) =>
    (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

  handleSeedPhraseChange(seedPhrase) {
    let seedPhraseError = null;

    const wordCount = this.parseSeedPhrase(seedPhrase).split(/\s/u).length;
    if (
      seedPhrase &&
      (wordCount % 3 !== 0 || wordCount < 12 || wordCount > 24)
    ) {
      seedPhraseError = this.context.t('seedPhraseReq');
    }

    this.setState({ seedPhrase, seedPhraseError });
  }

  handlePasswordChange(password) {
    const { confirmPassword } = this.state;
    let confirmPasswordError = null;
    let passwordError = null;

    if (password && password.length < 8) {
      passwordError = this.context.t('passwordNotLongEnough');
    }

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordError = this.context.t('passwordsDontMatch');
    }

    this.setState({ password, passwordError, confirmPasswordError });
  }

  handleConfirmPasswordChange(confirmPassword) {
    const { password } = this.state;
    let confirmPasswordError = null;

    if (password !== confirmPassword) {
      confirmPasswordError = this.context.t('passwordsDontMatch');
    }

    this.setState({ confirmPassword, confirmPasswordError });
  }

  onClick = () => {
    const { password, seedPhrase } = this.state;
    const {
      // eslint-disable-next-line no-shadow
      createNewVaultAndRestore,
      leaveImportSeedScreenState,
      history,
    } = this.props;

    leaveImportSeedScreenState();
    createNewVaultAndRestore(password, this.parseSeedPhrase(seedPhrase)).then(
      () => {
        history.push(DEFAULT_ROUTE);
      },
    );
  };

  hasError() {
    const { passwordError, confirmPasswordError, seedPhraseError } = this.state;
    return passwordError || confirmPasswordError || seedPhraseError;
  }

  render() {
    const {
      seedPhrase,
      password,
      confirmPassword,
      seedPhraseError,
      passwordError,
      confirmPasswordError,
    } = this.state;
    const { t } = this.context;
    const { isLoading } = this.props;
    const disabled =
      !seedPhrase ||
      !password ||
      !confirmPassword ||
      isLoading ||
      this.hasError();

    return (
      <div className="first-view-main-wrapper">
        <div className="first-view-main">
          <div className="import-account">
            <a
              className="import-account__back-button"
              onClick={(e) => {
                e.preventDefault();
                this.props.leaveImportSeedScreenState();
                this.props.history.goBack();
              }}
              href="#"
            >
              {`< Back`}
            </a>
            <div className="import-account__title">
              {this.context.t('restoreAccountWithSeed')}
            </div>
            <div className="import-account__selector-label">
              {this.context.t('secretPhrase')}
            </div>
            <div className="import-account__input-wrapper">
              <label className="import-account__input-label">Wallet Seed</label>
              <textarea
                className="import-account__secret-phrase"
                onChange={(e) => this.handleSeedPhraseChange(e.target.value)}
                value={this.state.seedPhrase}
                placeholder={this.context.t('separateEachWord')}
              />
            </div>
            <span className="error">{seedPhraseError}</span>
            <TextField
              id="password"
              label={t('newPassword')}
              type="password"
              className="first-time-flow__input"
              value={this.state.password}
              onChange={(event) =>
                this.handlePasswordChange(event.target.value)
              }
              error={passwordError}
              autoComplete="new-password"
              margin="normal"
              largeLabel
            />
            <TextField
              id="confirm-password"
              label={t('confirmPassword')}
              type="password"
              className="first-time-flow__input"
              value={this.state.confirmPassword}
              onChange={(event) =>
                this.handleConfirmPasswordChange(event.target.value)
              }
              error={confirmPasswordError}
              autoComplete="confirm-password"
              margin="normal"
              largeLabel
            />
            <Button
              type="first-time"
              className="first-time-flow__button"
              onClick={() => !disabled && this.onClick()}
              disabled={disabled}
            >
              {this.context.t('restore')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ appState: { isLoading } }) => ({ isLoading }),
  (dispatch) => ({
    leaveImportSeedScreenState: () => {
      dispatch(unMarkPasswordForgotten());
    },
    createNewVaultAndRestore: (pw, seed) =>
      dispatch(createNewVaultAndRestore(pw, seed)),
  }),
)(RestoreVaultPage);
