import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WrapRowErrorMessage from './wrap-row-error-message';

export default class WrapRowWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    errorType: PropTypes.string,
    label: PropTypes.string,
    showError: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  renderAmountFormRow() {
    const { children, errorType = '', label, showError = false } = this.props;
    const formField = Array.isArray(children)
      ? children[1] || children[0]
      : children;
    const customLabelContent = children.length > 1 ? children[0] : null;

    return (
      <div className="wrap-v2__form-row">
        <div className="wrap-v2__form-label">
          {label}
          {customLabelContent}
        </div>
        <div className="wrap-v2__form-field-container">
          <div className="wrap-v2__form-field">{formField}</div>
          <div>
            {showError && <WrapRowErrorMessage errorType={errorType} />}
          </div>
        </div>
      </div>
    );
  }

  renderFormRow() {
    const { children, errorType = '', label, showError = false } = this.props;

    const formField = Array.isArray(children)
      ? children[1] || children[0]
      : children;
    const customLabelContent =
      (Array.isArray(children) && children.length) > 1 ? children[0] : null;

    return (
      <div className="wrap-v2__form-row">
        <div className="wrap-v2__form-label">
          {label}
          {showError && <WrapRowErrorMessage errorType={errorType} />}
          {customLabelContent}
        </div>
        <div className="wrap-v2__form-field">{formField}</div>
      </div>
    );
  }

  render() {
    const { errorType = '' } = this.props;

    return errorType === 'amount'
      ? this.renderAmountFormRow()
      : this.renderFormRow();
  }
}
