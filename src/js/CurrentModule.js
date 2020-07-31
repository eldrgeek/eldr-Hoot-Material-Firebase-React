import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'overmind-react';
import { app } from '../app';
import { useApp } from '../app';
import '../css/tailwind.css';
// import "../styles.css";
// import 'todomvc-common/base.css';
// import 'todomvc-app-css/index.css';
// import { logLoader } from "../util/logloader";
// logLoader(module);

// eslint-disable-next-line no-unused-vars
const Nothing = () => {
  return 'The currrent module is nothing';
};

const CurrentModule = Element => {
  const rootElement = document.getElementById('root');
  render(
    <Provider value={app}>
      <Element />
    </Provider>,
    rootElement
  );
};
export { CurrentModule, React, useApp };
export default CurrentModule;
// CurrentModule(Nothing);
