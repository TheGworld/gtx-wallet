import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ConfirmTransactionBase from '../confirm-transaction-base';
import { showModal } from '../../store/actions';
import { getTokenData } from '../../helpers/utils/transactions.util';
import {
  calcTokenAmount,
  getTokenToAddress,
  getTokenValue,
} from '../../helpers/utils/token-util';
import { useTokenTracker } from '../../hooks/useTokenTracker';
import { getTokens } from '../../ducks/metamask/metamask';
import {
  transactionFeeSelector,
  txDataSelector,
} from '../../selectors/confirm-transaction';
import {
  getCurrentCurrency,
  getDomainMetadata,
} from '../../selectors/selectors';
import { currentNetworkTxListSelector } from '../../selectors/transactions';
import { mergedTokens } from '../../../gtx/mergedTokens';
import { getNativeCurrency } from '../../selectors';
import { getCustomTxParamsData } from './confirm-approve.util';
import ConfirmApproveContent from './confirm-approve-content';

export default function ConfirmApprove() {
  const dispatch = useDispatch();
  const { id: paramsTransactionId } = useParams();
  const txMeta = useSelector(txDataSelector);
  const { id: transactionId, txParams: { to: tokenAddress, data } = {} } =
    txMeta;

  const currentCurrency = useSelector(getCurrentCurrency);
  const nativeCurrency = useSelector(getNativeCurrency);
  const currentNetworkTxList = useSelector(currentNetworkTxListSelector);
  const domainMetadata = useSelector(getDomainMetadata);
  const tokens = useSelector(getTokens);

  const transaction =
    currentNetworkTxList.find(
      ({ id }) => id === (Number(paramsTransactionId) || transactionId),
    ) || {};
  const { ethTransactionTotal, fiatTransactionTotal } = useSelector((state) =>
    transactionFeeSelector(state, transaction),
  );

  const currentToken = (tokens &&
    tokens.find(({ address }) => tokenAddress === address)) || {
    address: tokenAddress,
  };

  const { tokensWithBalances = [] } = useTokenTracker(
    currentToken?.address ? [currentToken] : [],
  );
  const tokenTrackerBalance = tokensWithBalances[0]?.balance || '';

  const tokenSymbol = currentToken?.symbol;
  const decimals = Number(currentToken?.decimals);
  const tokenData = getTokenData(data);
  const tokenValue = tokenData && getTokenValue(tokenData.params);
  const toAddress = tokenData && getTokenToAddress(tokenData.params);
  const tokenAmount =
    tokenData && calcTokenAmount(tokenValue, decimals).toString(10);

  const [customPermissionAmount, setCustomPermissionAmount] = useState('');

  const previousTokenAmount = useRef(tokenAmount);

  useEffect(() => {
    if (customPermissionAmount && previousTokenAmount.current !== tokenAmount) {
      setCustomPermissionAmount(tokenAmount);
    }
    previousTokenAmount.current = tokenAmount;
  }, [customPermissionAmount, tokenAmount]);

  const { origin } = transaction;
  const formattedOrigin = origin
    ? origin[0].toUpperCase() + origin.slice(1)
    : '';
  const txData = transaction;

  const { icon: siteImage = '' } = domainMetadata[origin] || {};
  const isInternal = origin?.toLowerCase() === 'metamask';
  let useSiteImage = siteImage;
  if (isInternal) {
    const tokenEx = Object.values(mergedTokens).find(
      ({ address }) => address?.toLowerCase() === currentToken?.address,
    );
    if (tokenEx?.logo) {
      useSiteImage = `images/contract/${tokenEx.logo}`;
    }
  }

  const tokensText = `${Number(tokenAmount)} ${tokenSymbol}`;
  const tokenBalance = tokenTrackerBalance
    ? calcTokenAmount(tokenTrackerBalance, decimals).toString(10)
    : '';
  const customData = customPermissionAmount
    ? getCustomTxParamsData(data, { customPermissionAmount, decimals })
    : null;

  return (
    <ConfirmTransactionBase
      toAddress={toAddress}
      identiconAddress={tokenAddress}
      showAccountInHeader
      title={tokensText}
      contentComponent={
        <ConfirmApproveContent
          decimals={decimals}
          siteImage={useSiteImage}
          setCustomAmount={setCustomPermissionAmount}
          customTokenAmount={String(customPermissionAmount)}
          tokenAmount={tokenAmount}
          origin={formattedOrigin}
          tokenSymbol={tokenSymbol}
          tokenBalance={tokenBalance}
          showCustomizeGasModal={() =>
            dispatch(showModal({ name: 'CUSTOMIZE_GAS', txData }))
          }
          showEditApprovalPermissionModal={({
            /* eslint-disable no-shadow */
            customTokenAmount,
            decimals,
            origin,
            setCustomAmount,
            tokenAmount,
            tokenBalance,
            tokenSymbol,
            /* eslint-enable no-shadow */
          }) =>
            dispatch(
              showModal({
                name: 'EDIT_APPROVAL_PERMISSION',
                customTokenAmount,
                decimals,
                origin,
                setCustomAmount,
                tokenAmount,
                tokenBalance,
                tokenSymbol,
              }),
            )
          }
          data={customData || data}
          toAddress={toAddress}
          currentCurrency={currentCurrency}
          nativeCurrency={nativeCurrency}
          ethTransactionTotal={ethTransactionTotal}
          fiatTransactionTotal={fiatTransactionTotal}
        />
      }
      hideSenderToRecipient
      customTxParamsData={customData}
    />
  );
}
