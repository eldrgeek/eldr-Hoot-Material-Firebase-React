import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import CommonButton from './widgets/CommonButton';
const from = 'streamtest';
// import { H1, H3 } from './Typography';

const StreamTestPage = () => {
  const { state, actions } = useApp();
  const [instance] = React.useState('testInstance');
  const [count, setCount] = React.useState(0);
  async function invoke(label, func) {
    actions.invoke({ label, func });
  }
  const doEndToEnd = async () => {
    actions.diag('Do end to end');
    setCount(count + 1);
    await actions.caller.openUserMedia({ from });
    await actions.caller.createConnection({ from, instance });
    const connectionId = actions.caller.getConnectionRef({ from, instance }).id;
    console.log('connection ID', connectionId);
    await actions.callee.openUserMedia({ from });
    await actions.callee.joinConnectionById({
      from,
      connectionId,
      instance,
      caller: 'caller1',
      callee: 'callee1',
    });
    setCount(count + 1);
  };

  // React.useEffect(() => {
  //   console.log('stream test effect', state.page);

  //   if (state.page === 'streamtest') invoke('End to end', doEndToEnd);
  //   //eslint-disable-next-line
  // }, [state.page]);
  if (state.page !== 'streamtest') {
    return null;
  } else
    return (
      <React.Fragment>
        count is {count}
        <video
          width={'100px'}
          ref={(el) => {
            console.log('Ref for local');
            if (el && !el.srcObject && state.caller.localStream) {
              console.log('Assign for local', state.caller.localStream);

              el.srcObject = actions.caller.getLocalStream({ from });
            }
          }}
          autoPlay
        />{' '}
        <video
          width={'100px'}
          ref={(el) => {
            if (el && !el.srcObject && state.caller.remoteStream[instance]) {
              console.log(
                'Create ref to Remote',
                actions.caller.getRemoteStream({ from, instance })
              );
              el.srcObject = actions.caller.getRemoteStream({ from, instance });
            }
          }}
          autoPlay
        />
        <br />
        <CommonButton
          onClick={async () => {
            await actions.caller.hangUp();
            await actions.callee.hangUp({ from, instance: 'testInstance' });
            actions.streams.closeUserMedia();
          }}
          label="Leave"
        />
        <CommonButton onClick={doEndToEnd} label="Retry" />
      </React.Fragment>
    );
};

export default StreamTestPage;
CurrentModule(StreamTestPage);
