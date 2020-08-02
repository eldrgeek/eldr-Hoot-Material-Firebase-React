import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import { H3 } from './Typography';
import Button from '@material-ui/core/Button';

const ChatPage = () => {
  const { state, actions } = useApp();
  React.useEffect(() => {
    if (!state.streams.localStream) {
      actions.streams.openUserMedia();
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <H3> {state.rooms.roomName} </H3>
      {Object.keys(state.rooms.members).map((key, index) => {
        const member = state.rooms.members[key];
        return (
          <div key={key}>
            {member.user}
            <video
              width={'100px'}
              ref={el => {
                if (el) el.srcObject = actions.streams.getLocalStream();
              }}
              autoPlay
            />
          </div>
        );
      })}
      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={() => {
          actions.rooms.leaveRoom();
          actions.setPage('front');
        }}
      >
        Leave
      </Button>
      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={() => {
          actions.streams.toggleUserMedia();
        }}
      >
        {state.streams.enablePrompt}
      </Button>
    </div>
  );
};
export default ChatPage;
CurrentModule(ChatPage);
