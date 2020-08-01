import React from 'react';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
const Notifier = () => {
  const { actions, state } = useApp();
  React.useEffect(() => {
    console.log('notifier');
    actions.notifier.setError('An error');
  }, [actions.notifier]);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={state.notifier.isOpen}
      autoHideDuration={4000}
      onClose={actions.notifier.handleClose}
    >
      <Alert
        onClose={actions.notifier.handleClose}
        severity={state.notifier.severity}
      >
        {state.notifier.message}
      </Alert>
    </Snackbar>
  );
};
export default Notifier;
CurrentModule(Notifier);
