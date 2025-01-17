import assert from 'assert';
import * as reactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import transactions from '../../../test/data/transaction-data.json';
import * as methodDataHook from '../useMethodData';
import { showSidebar } from '../../store/actions';
import { useRetryTransaction } from '../useRetryTransaction';

describe('useRetryTransaction', function () {
  describe('when transaction meets retry enabled criteria', function () {
    const dispatch = sinon.spy(() => Promise.resolve({ blockTime: 0 }));
    const event = {
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    };

    const retryEnabledTransaction = {
      ...transactions[0],
      transactions: [
        {
          submittedTime: new Date() - 5001,
        },
      ],
      hasRetried: false,
    };

    it('retryTransaction function should show retry sidebar', async function () {
      sinon.stub(reactRedux, 'useDispatch').returns(dispatch);
      sinon.stub(methodDataHook, 'useMethodData').returns({});

      const { result } = renderHook(() =>
        useRetryTransaction(retryEnabledTransaction, true),
      );
      const retry = result.current;
      await retry(event);
      assert.equal(
        dispatch.calledWith(
          showSidebar({
            transitionName: 'sidebar-left',
            type: 'customize-gas',
            props: { transaction: retryEnabledTransaction.initialTransaction },
          }),
        ),
        true,
      );

      dispatch.resetHistory();
      sinon.restore();
    });
  });
});
