import { derived } from 'overmind';

type State = {
  message: string;
  severity: string;
  isOpen: boolean;
};
export const state: State = {
  message: '',
  severity: '',
  isOpen: derived(({ message }: State) => message !== ''),
};
export const actions = {
  async templateAction({
    state: { notifier: state },
    actions: { notifier: actions },
  }) {},
  async handleClose({
    state: { notifier: state },
    actions: { notifier: actions },
  }) {
    state.message = '';
  },

  async setMessage(
    { state: { notifier: state }, actions: { notifier: actions } },
    { message, severity }
  ) {
    console.log('err');
    state.message = message;
    state.severity = severity;
  },

  async setError(
    { state: { notifier: state }, actions: { notifier: actions } },
    message
  ) {
    actions.setMessage({ message, severity: 'error' });
    setTimeout(actions.handleClose, 4500);
  },
};

const config = {
  state,
  actions,
};
export default config;
