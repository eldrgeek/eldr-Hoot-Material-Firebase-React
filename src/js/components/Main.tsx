import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import FrontPage from './FrontPage';
import ChatPage from './ChatPage';
import CascadePage from './CascadePage';
const Main = () => {
  const { state } = useApp();
  return state.page === 'front' ? (
    <FrontPage />
  ) : state.page === 'chat' ? (
    <ChatPage />
  ) : (
    <CascadePage />
  );
};
export default Main;
CurrentModule(Main);
