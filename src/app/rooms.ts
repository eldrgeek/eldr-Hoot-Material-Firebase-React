import * as firebase from 'firebase';
import { json } from 'overmind';

export enum RoomState {
  CHATTING = 'chatting',
  CASCADING = 'cascading',
}

export enum ConnectionType {
  CALLER = 'caller',
  CALLEE = 'callee',
}

export type Connection = {
  id: string;
  type: ConnectionType;
};
export type Member = {
  id: string;
};

type State = {
  sequence: number;
  snapshot: any;
  roomState: RoomState;
  roomName: string;
  userName: string;
  members: {
    //All members of the room
    [id: string]: Member;
  };
  connections: {
    //connections for this member
    [id: string]: Connection;
  };
};
export const state: State = {
  sequence: 0,
  snapshot: null,
  roomState: RoomState.CHATTING,
  roomName: 'main',
  userName: '',
  members: {},
  connections: {},
};
const firebaseConfig = {
  apiKey: 'AIzaSyAEM9uGdlfMsFAX1FaYBuiWT3Bh0ZfFRcE',
  authDomain:
    'https://3000-feeffad4-e711-4e5f-9f7f-891b31f22047.ws-us02.gitpod.io/',
  databaseURL: 'https://civicapathyproject.firebaseio.com',
  projectId: 'civicapathyproject',
  storageBucket: 'civicapathyproject.appspot.com',
  messagingSenderId: '208039221624',
  appId: '1:208039221624:web:894094b7d962d148aed08d',
};
let fb;

const api = (() => {
  return {
    state: null,
    initialize({ state, actions }) {
      if (!state.firebaseInitialized) {
        fb = firebase.initializeApp(firebaseConfig);
        actions.setFirebaseInitialized();
      }
      // state.firebase = firebase;
    },
    getFirebase() {
      return fb;
    },
  };
})();
const actions = {
  async clickAction({ state: { rooms: state }, actions: { rooms: actions } }) {
    state.sequence = state.sequence + 1;
    console.log('clicky clicky');
    // await actions.joinRoomByName({
    //   room: 'main',
    //   user: 'User-' + state.sequence,
    // });
    // await actions.getRoomSnapshot();
    // if (state.sequene === 5) {
    //   actions.deleteSnapshot()
    //   await actions.joinRoomByName({
    //     room: 'main',
    //     user: ('User-' + state.sequence + 1)
    //   });

    //   await actions.joinRoomByName({
    //     room: 'main',
    //     user: ('User-' + state.sequence + 2)
    //   });
    // }
  },

  async deleteSnapshot({
    state: { rooms: state },
    actions: { rooms: actions },
  }) {
    json(state.snapshot)();
    state.snapshot = null;
  },
  async joinRoomByName({
    state: { rooms: state },
    actions: { rooms: actions },
  }) {
    await actions.setRoomRef(`${state.roomName}`);
    // await actions.rooms.getRoomSnapshot();
    actions
      .getRoomRef()
      .collection('members')
      .doc(state.userName)
      .set({ user: state.userName });
    console.log(`added member ${state.userName} to ${state.roomName}`);
  },

  async setRoomRef({ state, actions }, roomId) {
    const fb = actions.rooms.getFirebase();
    const db = fb.firestore();
    state.rooms.roomRef = await db.collection('rooms').doc(roomId);
  },
  getRoomRef({ state }) {
    return json(state.rooms.roomRef);
  },
  setRoomName({ state }, roomName) {
    state.rooms.roomName = roomName;
  },
  setUserName({ state }, userName) {
    state.rooms.userName = userName;
  },

  async getRoomSnapshot({
    state: { rooms: state },
    actions: { rooms: actions },
  }) {
    if (state.snapshot) return;
    state.snapshot = actions
      .getRoomRef()
      .collection('members')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          console.log('change');
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`got new member: ${JSON.stringify(data)}`);
          }
        });
      });
  },

  async setInitialized({ state }, firebase) {
    // debugger; // state.rooms.firebase = firebase;
    state.rooms.initialized = true;
  },
  getFirebase({ state }) {
    return firebase;
  },
};

const effects = {
  api: api,
};

const onInitialize = ({ state, actions, effects }) => {
  console.log('context in the rooms', { state, actions, effects });
  effects.rooms.api.initialize({ state, actions, effects });
  // actions.rooms.joinRoomByName(state.rooms.roomName);
};

const config = {
  state,
  effects,
  actions,
  onInitialize,
};
export default config;
