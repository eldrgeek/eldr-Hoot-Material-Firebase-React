import React from 'react';
import CommonButtton from './CommonButton';
import { CurrentModule } from '../../CurrentModule';
import { useApp } from '../../../app';
const from = 'debugPanel';
const DebugPanel = () => {
  const { state, actions } = useApp();
  if (!state.debugPanel) return null;
  return (
    <div>
      <CommonButtton
        label="button2"
        onClick={() => actions.setPage({ from, page: 'chat' })}
      />

      <CommonButtton
        label="button1"
        onClick={() => actions.setPage({ from, page: 'chat' })}
      />
    </div>
  );
};
export default DebugPanel;
CurrentModule(DebugPanel);
