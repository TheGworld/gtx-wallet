import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  contractExchangeRateSelector,
  transactionFeeSelector,
  getNativeCurrencyImage,
  getNativeCurrency,
} from '../../selectors';
import { getTokens } from '../../ducks/metamask/metamask';
import { getTokenData } from '../../helpers/utils/transactions.util';
import {
  calcTokenAmount,
  getTokenToAddress,
  getTokenValue,
} from '../../helpers/utils/token-util';
import ConfirmTokenTransactionBase from './confirm-token-transaction-base.component';

const mapStateToProps = (state, ownProps) => {
  const {
    match: { params = {} },
  } = ownProps;
  const { id: paramsTransactionId } = params;
  const {
    confirmTransaction,
    metamask: { currentCurrency, conversionRate, currentNetworkTxList },
  } = state;

  const {
    txData: {
      id: transactionId,
      txParams: { to: tokenAddress, data } = {},
    } = {},
  } = confirmTransaction;

  const transaction =
    currentNetworkTxList.find(
      ({ id }) => id === (Number(paramsTransactionId) || transactionId),
    ) || {};

  const { ethTransactionTotal, fiatTransactionTotal } = transactionFeeSelector(
    state,
    transaction,
  );
  const tokens = getTokens(state);
  const currentToken =
    tokens && tokens.find(({ address }) => tokenAddress === address);
  const { decimals, symbol: tokenSymbol, isERC721 } = currentToken || {};

  const tokenData = getTokenData(data);
  const tokenValue = tokenData && getTokenValue(tokenData.params);
  const toAddress = tokenData && getTokenToAddress(tokenData.params);
  const tokenAmount =
    tokenData && calcTokenAmount(tokenValue, decimals).toNumber();
  const contractExchangeRate = contractExchangeRateSelector(state);
  const nativeCurrencyImage = getNativeCurrencyImage(state);
  const nativeCurrency = getNativeCurrency(state);

  return {
    toAddress,
    tokenAddress,
    tokenAmount,
    tokenSymbol,
    currentCurrency,
    conversionRate,
    contractExchangeRate,
    fiatTransactionTotal,
    ethTransactionTotal,
    nativeCurrencyImage,
    nativeCurrency,
    isERC721,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
)(ConfirmTokenTransactionBase);
