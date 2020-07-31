import * as React from 'react';
import { useApp } from '../app';

// import TodoItem from './TodoItem';
// import TodoFooter from './TodoFooter';
import { CurrentModule } from './CurrentModule';

const TodoApp: React.FC = () => {
  const { state, actions } = useApp();

  return (
    <div>
      <header className="header">
        <h1>Overmind!!!</h1>
      </header>
      <section className="main">
        {Object.keys(state.rooms).map(key => (
          <div key={key}>
            <span>
              {key}{' '}
              {typeof state.rooms[key] === 'object'
                ? 'object'
                : `'${state.rooms[key]}'`}
            </span>
          </div>
        ))}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={actions.rooms.clickAction}
        >
          Click
        </button>
      </section>
    </div>
  );
};

export default TodoApp;
CurrentModule(TodoApp);
