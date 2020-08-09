import { createHook } from 'overmind-react';
import { state } from './state';
import { onInitialize } from './onInitialize';
import actions from './actions';
import * as effects from './effects';
import { IConfig } from 'overmind';
import { createOvermind } from 'overmind';
import { merge, namespaced } from 'overmind/config';

import rooms from './rooms';
import notifier from './notifier';
import streams from './streams';
import caller from './caller';
import callee from './callee';

export const config = {
  onInitialize,
  state,
  actions,
  effects,
};
export let app;
export let useApp;

export const mergedConfig = merge(
  config,
  namespaced({
    rooms,
    notifier,
    streams,
    caller,
    callee,
  })
);
const initialize = () => {
  app = createOvermind(mergedConfig, {
    devtools: navigator.userAgent.match(/ CrOS /)
      ? 'penguin.linux.test:3031'
      : 'localhost:3031',
  });
  // setProxyActions(app.actions)
  useApp = createHook();
  // app.actions.setAttrs(app.effects.getAttrs())
};
// const {actions,state} = useApp()
if (!module.hot) {
  console.log('not hot');
  //   initialize();
  initialize();
} else {
  module.hot.dispose(data => {
    // console.log('disposing of the CB ', cb + '')
    // socket.off('confirm', cb)
    // data.cb = cb
    if (data.cb) console.log('THIS IS JUST TO KEEP THIS ALIVE');
  });
  if (!module.hot.data) {
    console.log('no hot data');
    initialize();
    /** Now we should always have module.hot.data */
  } else {
    console.log('Hot data output');
    // console.log('disposing', data.cb + '', cb + '')
    initialize();
  }
}

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}
