// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Action } from 'overmind';
const actions = {
  setFirebaseInitialized({ state }) {
    console.log('SETFBINIT Action');
    state.firebaseInitialized = true;
  },
  setPage({ state }, page) {
    if (typeof page === 'object') page = page.page;
    state.page = page;
  },
  diag({ state }, result) {
    state.diag = result;
    setTimeout(() => state.diags.push(result));
  },
  invoke({ state }, args) {
    if (typeof args === 'object') {
      // actions.diag('Invoking ' + args.label);
      args.func();
    } else {
      args();
    }
  },
  clearDiags({ state }) {
    state.diag = '';
    state.diage = [];
  },
  debugPaneOn({ state }, { from }) {
    state.debugPanel = true;
  },
  debugPaneOff({ state }, { from }) {
    state.debugPanel = false;
  },
  // export const changeNewTodoTitle: Action<string> = ({ state }, title) => {
  //   state.newTodoTitle = title;
  // };
};
export default actions;
