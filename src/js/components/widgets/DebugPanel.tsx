import React from 'react';
import CommonButton from './CommonButton';
import { CurrentModule } from '../../CurrentModule';
import { useApp } from '../../../app';
const from = 'debugPanel';
const DebugPanel = () => {
  const { state, actions } = useApp();
  const buttons = {
    chat: () => actions.setPage({ from, page: 'chat' }),
    test: () => actions.setPage({ from, page: 'streamtest' }),
  };
  if (!state.debugPanel) return null;
  return (
    <div>
      {Object.keys(buttons).map((key) => {
        return <CommonButton key={key} label={key} onClick={buttons[key]} />;
      })}
    </div>
  );
};
export default DebugPanel;
CurrentModule(DebugPanel);
