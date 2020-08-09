import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import { H3 } from './Typography';
import Button from '@material-ui/core/Button';
import MoveableBox from './MoveableBox';
const from = 'chat';
const FilteredList = ({ filter }) => {
  const { state } = useApp();
  console.log(filter);
  Object.keys(state.rooms.members).forEach((key) =>
    console.log('pos', state.rooms.members[key])
  );
  return (
    <React.Fragment>
      {Object.keys(state.rooms.members)
        .filter((key) => state.rooms.members[key].position !== filter)
        .map((key, index) => {
          // const member = state.rooms.members[key];
          return (
            <div key={key}>
              <MoveableBox pos={index} Contents={() => <MoveableContents />} />
            </div>
          );
        })}
    </React.Fragment>
  );
};
const MoveableContents = () => {
  const { actions, state } = useApp();
  return (
    <React.Fragment>
      <video
        width={'100px'}
        ref={(el) => {
          if (el && !el.srcObject && state.streams.localStream)
            el.srcObject = actions.streams.getLocalStream({ from });
        }}
        autoPlay
      />
    </React.Fragment>
  );
};
const ChatPage = () => {
  const { state, actions } = useApp();
  React.useEffect(() => {
    if (state.page === 'chat') {
      actions.streams.openUserMedia({ from });
    }
    //eslint-disable-next-line
  }, [state.page]);
  if (state.page !== 'chat') {
    return null;
  } else
    return (
      <div className="container mx-auto bg-blue-100">
        <H3> {state.rooms.roomName} </H3>
        <div className="container h-40 mx-auto bg-red-100">
          Chat
          <FilteredList filter="none" />
        </div>
        <div className="container h-40 mx-auto bg-green-100">cascade</div>
        stuff
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={async () => {
            await actions.rooms.leaveRoom({ from });
            actions.streams.closeUserMedia({ from });
            actions.setPage({ from, page: 'front' });
          }}
        >
          Leave
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={() => {
            actions.streams.toggleUserMedia({ from });
          }}
        >
          {state.streams.enablePrompt}
        </Button>
      </div>
    );
};
export default ChatPage;
CurrentModule(ChatPage);
