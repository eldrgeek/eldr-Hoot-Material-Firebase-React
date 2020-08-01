import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import { H1, H3 } from './Typography';
import Button from '@material-ui/core/Button';

const ChatPage = () => {
  const { state, actions } = useApp();
  return (
    <div>
      {/* <H1> Chat </H1>; */}
      <H1> {state.rooms.roomName} </H1>;
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
    </div>
  );
};
export default ChatPage;
CurrentModule(ChatPage);
