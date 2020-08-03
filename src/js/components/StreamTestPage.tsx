import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import { H1, H3 } from './Typography';

const ChatPage = () => {
  const { state } = useApp();
  return <H1> Cascade Page </H1>;
};
export default ChatPage;
CurrentModule(ChatPage);
