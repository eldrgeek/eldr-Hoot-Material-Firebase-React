// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Action } from 'overmind';
const actions = {
  setFirebaseInitialized({ state }) {
    console.log('SETFBINIT Action');
    state.firebaseInitialized = true;
  },
  // export const changeNewTodoTitle: Action<string> = ({ state }, title) => {
  //   state.newTodoTitle = title;
  // };
};
export default actions;
