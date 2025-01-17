import EventEmitter from 'events';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/ui/button';
import { INITIALIZE_SELECT_ACTION_ROUTE } from '../../../helpers/constants/routes';

export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    welcomeScreenSeen: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.animationEventEmitter = new EventEmitter();
  }

  componentDidMount() {
    const { history, welcomeScreenSeen } = this.props;

    if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    }
  }

  handleContinue = () => {
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  };

  render() {
    const { t } = this.context;

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          <img
            src="/images/logo/gtx.svg"
            style={{ background: 'black', padding: '2rem', width: '80%' }}
          />
          <div className="welcome-page__header">{t('welcome')}</div>
          <div className="welcome-page__description">
            <div>{t('metamaskDescription')}</div>
            <div>{t('happyToSeeYou')}</div>
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            {t('getStarted')}
          </Button>
        </div>
      </div>
    );
  }
}
