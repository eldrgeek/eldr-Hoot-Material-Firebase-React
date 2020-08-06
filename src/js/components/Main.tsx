import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import FrontPage from './FrontPage';
import ChatPage from './ChatPage';
import DebugPanel from './widgets/DebugPanel';
import CascadePage from './CascadePage';
import StreamTestPage from './StreamTestPage';
import { H3 } from './Typography';

const pages = {
  front: <FrontPage />,
  chat: <ChatPage />,
  cascade: <CascadePage />,
  streamtest: <StreamTestPage />,
};
const Main = () => {
  const { state } = useApp();
  if (!pages[state.page]) {
    return (
      <div>
        <H3>Invalid Page:</H3>
        <H3> '{state.page}' </H3>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        {pages[state.page]}
        <DebugPanel />
      </React.Fragment>
    );
  }
};
export default Main;
CurrentModule(Main);
