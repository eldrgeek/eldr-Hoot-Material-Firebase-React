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
  sessionId: string;
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
  sessionId: '',
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
  async templateAction({
    state: { rooms: state },
    actions: { rooms: actions },
  }) {},
  async updateStorage({
    state: { rooms: state },
    actions: { rooms: actions },
    effects,
  }) {
    await effects.storage.saveSession('hootnet', {
      room: state.roomName,
      user: state.userName,
      id: state.sessionId,
    });
  },
  async updateFromStorage({
    state: { rooms: state },
    actions: { rooms: actions },
    effects,
  }) {
    const hootState = effects.storage.getSession('hootnet');
    console.log('hootstate', JSON.stringify(hootState));
    actions.setUserName(hootState.user || '');
    actions.setRoomName(hootState.room || '');
    actions.setSessionId(hootState.id || '');
  },
  async setSessionId(
    { state: { rooms: state }, actions: { rooms: actions } },
    id
  ) {
    state.sessionId = id;
  },
  async getSessionId({ state: { rooms: state }, actions: { rooms: actions } }) {
    if (!state.sessionId) {
      actions.setSessionId('S-' + (await actions.nextSessionId()));
      await actions.updateStorage();
    }
    return state.sessionId;
  },
  async nextSessionId({
    state: { rooms: state },
    actions: { rooms: actions },
  }) {
    const fb = actions.getFirebase();
    const db = fb.firestore();
    // Create a reference to the SF doc.
    await db
      .doc('root/root')
      .get()
      .then(doc => {
        if (!doc.exists) {
          db.doc('root/root').set({ sequence: 0 });
        }
      });
    const docRef = db.doc('root/root');
    return db
      .runTransaction(transaction => {
        return transaction.get(docRef).then(doc => {
          const newSequence = doc.data().sequence + 1;
          transaction.update(docRef, { sequence: newSequence });
          return newSequence;
        });
      })
      .then(sequence => {
        console.log('transaction completed', sequence);
        return sequence;
      });
  },

  async clickAction({ state: { rooms: state }, actions: { rooms: actions } }) {
    state.sequence = state.sequence + 1;
    console.log('clicky clicky');
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
    actions
      .getRoomRef()
      .collection('members')
      .doc(state.sessionId)
      .set({ user: state.userName });
    await actions.getRoomSnapshot();
    console.log(`added member ${state.userName} to ${state.roomName}`);
  },
  async leaveRoom({ state: { rooms: state }, actions: { rooms: actions } }) {
    actions
      .getRoomRef()
      .collection('members')
      .doc(state.userName)
      .delete();
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
    // avoid feedback look from set location
    if (state.rooms.roomName !== roomName) state.rooms.roomName = roomName;
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
            state.members[change.doc.id] = data;
            // console.log(
            //   `got new member: ${change.doc.id} ${JSON.stringify(data)}`
            // );
          } else if (change.type === 'deleted') {
            delete state.members[change.doc.id];
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
