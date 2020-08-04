import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import CommonButton from './widgets/CommonButton';

// import { H1, H3 } from './Typography';

const StreamTestPage = () => {
  const { state, actions } = useApp();
  const [instance] = React.useState('testInstance');
  async function invoke(label, func) {
    actions.invoke({ label, func });
  }
  const doEndToEnd = async () => {
    // actions.diag("Do end to end")
    await actions.caller.openUserMedia();
    await actions.caller.createConnection({ instance });
    const connectionId = actions.caller.getConnectionRef(instance).id;
    console.log('connection ID', connectionId);
    await actions.callee.openUserMedia();
    await actions.callee.joinConnectionById({
      connectionId,
      instance,
      caller: 'caller1',
      callee: 'callee1',
    });
  };

  React.useEffect(() => {
    console.log('stream test effect', state.page);

    if (state.page === 'streamtest') invoke('End to end', doEndToEnd);
    //eslint-disable-next-line
  }, [state.page]);
  return (
    <React.Fragment>
      {' '}
      "something"{' '}
      <video
        width={'100px'}
        ref={el => {
          if (el) el.srcObject = actions.caller.getLocalStream();
        }}
        autoPlay
      />{' '}
      <video
        width={'100px'}
        ref={el => {
          if (el) el.srcObject = actions.caller.getRemoteStream(instance);
        }}
        autoPlay
      />
      <br />
      <CommonButton
        onClick={async () => {
          // await actions.caller.hangUp();
          await actions.callee.hangUp('testInstance');
          // actions.streams.closeUserMedia();
        }}
        label="Leave"
      />
      <CommonButton onClick={doEndToEnd} label="Retry" />
    </React.Fragment>
  );
};

export default StreamTestPage;
CurrentModule(StreamTestPage);
