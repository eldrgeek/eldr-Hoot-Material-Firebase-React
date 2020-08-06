// import { derived } from 'overmind';

export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type State = {
  firebaseInitialized: boolean;
  page: string;
  diag: string;
  debugPanel: boolean;
  diags: Array<string>;
};

export const state: State = {
  firebaseInitialized: false,
  debugPanel: true,
  page: 'front',
  diag: '',
  diags: [],
};
