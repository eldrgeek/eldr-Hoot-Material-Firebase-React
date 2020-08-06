import { OnInitialize } from 'overmind';

// import { Filter } from './state';
//update initialize
export const onInitialize: OnInitialize = (
  { state, actions, effects },
  instance
) => {
  // state.todos = effects.storage.getTodos();
  // instance.reaction(
  //   ({ todos }) => todos,
  //   todos => effects.storage.saveTodos(todos),
  //   { nested: true }
  // );
  // effects.router.initialize({
  //   '/': () => actions.changeFilter(Filter.ALL),
  //   '/active': () => actions.changeFilter(Filter.ACTIVE),
  //   '/completed': () => actions.changeFilter(Filter.COMPLETED),
  // });
};
