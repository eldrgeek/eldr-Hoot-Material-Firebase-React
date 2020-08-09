import { createOvermindMock } from 'overmind';
import {mergedConfig} from './index';
describe('Messages', async () => {
  console.log(jest.useFakeTimers);
  test('set a message', async () => {
    const overmind = createOvermindMock(mergedConfig);
  //   const {state: {notifier: state},
  //   actions: {notifier: actions}
  // } = overmind
    // overmind.actions.setError('an error');
    // console.log(overmind);
    const {state,actions} = overmind
    const message = 'this is an error'
    expect(state.notifier.message).toEqual('');
    actions.notifier.setError(message)
    expect(state.notifier.message).toEqual(message);
    const timer = new Promise((resolve)=>setTimeout(resolve,4500))
    await timer
    expect(state.notifier.message).toEqual('')
  });
});
