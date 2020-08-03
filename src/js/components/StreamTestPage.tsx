import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
// import { H1, H3 } from './Typography';

const StreamTestPage = () => {
  const { actions } = useApp();
  React.useEffect(() => {
    const doEndToEnd = async () => {
      await actions.caller.openUserMedia();

      await actions.caller.createConnection();
      const connectionId = actions.caller.getConnectionRef().id;
      console.log('connection ID', connectionId);
      await actions.callee.openUserMedia();
      await actions.callee.joinConnectionById(connectionId);
    };
    // doEndToEnd();
    //eslint-disable-next-line
  }, []);
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
          if (el) el.srcObject = actions.caller.getRemoteStream();
        }}
        autoPlay
      />
    </React.Fragment>
  );
};
export default StreamTestPage;
CurrentModule(StreamTestPage);
