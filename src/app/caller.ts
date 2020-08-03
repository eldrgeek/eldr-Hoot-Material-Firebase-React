import * as firebase from 'firebase';
import { json, derived } from 'overmind';

const state = {
  initialized: false,
  connectionName: 'test',
  localStream: null,
  remoteStream: null,
  enablePrompt: derived(state => (state.localStream ? 'Hangup' : 'Open')),
  connectionId: null,
  connectionRef: null,
  peerConnections: {
    test: {
      peerConnection: null,
    },
  },
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
        actions.setFirebaseInitialized();
        fb = firebase.initializeApp(firebaseConfig);
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
    state: { caller: state },
    actions: { caller: actions },
  }) {},
  async makeConnections({ state, actions: { caller: actions } }) {
    for (let member of state.rooms.members) {
      if (member.id < state.rooms.sessionId) {
      }
    }
  },
  async toggleUserMedia({
    state: { caller: state },
    actions: { caller: actions },
  }) {
    if (state.localStream) {
      actions.closeUserMedia();
      state.localStream = null;
    } else {
      actions.openUserMedia();
    }
  },
  async openUserMedia({ state }) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    state.caller.localStream = stream;
    state.caller.remoteStream = new MediaStream();
  },
  async closeUserMedia({
    state: { caller: state },
    actions: { caller: actions },
  }) {
    const stream = actions.getLocalStream();
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
    state.localMedia = null;
  },
  async createConnection({ actions }) {
    await actions.caller.setConnectionRef();
    await actions.caller.createPeerConnection();
    await actions.caller.addLocalTracks();
    await actions.caller.setupLocalCandidates();
    actions.caller.setupPeerListeners();
    actions.caller.setupSnapshotListener();
    actions.caller.setupCalleeCandidates();
  },
  async joinConnectionById({ actions }, connectionId) {
    actions.caller.setConnectionId(connectionId);
    await actions.caller.setConnectionRef(`${connectionId}`);
    await actions.caller.getConnectionSnapshot();
  },
  setConnectionId({ state }, connectionId) {
    state.caller.connectionId = connectionId;
  },
  getConnectionId({ state }) {
    return json(state.caller.connectionId);
  },
  async hangUp({ actions }) {
    // const tracks = document.querySelector("#localVideo").srcObject.getTracks();

    actions.caller.closeUserMedia();
    if (actions.caller.getRemoteStream()) {
      actions.caller
        .getRemoteStream()
        .getTracks()
        .forEach(track => track.stop());
    }

    if (actions.caller.getPeerConnection()) {
      actions.caller.getPeerConnection().close();
    }
    if (actions.caller.getConnectionId()) {
      await actions.caller.setConnectionRef();
      const calleeCandidates = await actions.caller
        .getConnectionRef()
        .collection('calleeCandidates')
        .get();
      calleeCandidates.forEach(async candidate => {
        await candidate.ref.delete();
      });
      const callerCandidates = await actions.caller
        .getConnectionRef()
        .collection('callerCandidates')
        .get();
      callerCandidates.forEach(async candidate => {
        await candidate.ref.delete();
      });
      await actions.caller.getConnectionRef().delete();
    }
  },
  async getConnectionSnapshot({ actions }) {
    const connectionSnapshot = await actions.caller.getConnectionRef().get();
    console.log('Got connection:', connectionSnapshot.exists);

    if (connectionSnapshot.exists) {
      // console.log("Create PeerConnection with configuration: ", configuration);
      actions.caller.createPeerConnection();

      // peerConnection = new RTCPeerConnection(configuration);
      // registerPeerConnectionListeners();
      actions.caller.addLocalTracks();

      // Code for collecting ICE candidates below
      actions.caller.addCalleeCandidateCollection();

      const calleeCandidatesCollection = actions.caller
        .getConnectionRef()
        .collection('calleeCandidates');

      actions.caller
        .getPeerConnection()
        .addEventListener('icecandidate', event => {
          if (!event.candidate) {
            console.log('Got final candidate!');
            return;
          }
          console.log('Got candidate: ', event.candidate);
          calleeCandidatesCollection.add(event.candidate.toJSON());
        });
      // Code for collecting ICE candidates above

      actions.caller.getPeerConnection().addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          actions.caller.getRemoteStream().addTrack(track);
        });
      });

      // Code for creating SDP answer below
      const offer = connectionSnapshot.data().offer;
      console.log('Got offer:', offer);
      await actions.caller
        .getPeerConnection()
        .setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await actions.caller.getPeerConnection().createAnswer();
      console.log('Created answer:', answer);
      await actions.caller.getPeerConnection().setLocalDescription(answer);

      const connectionWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await actions.caller.getConnectionRef().update(connectionWithAnswer);
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      actions.caller
        .getConnectionRef()
        .collection('callerCandidates')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
              let data = change.doc.data();
              console.log(
                `Got new remote ICE candidate: ${JSON.stringify(data)}`
              );
              await actions.caller
                .getPeerConnection()
                .addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
    }
  },
  setupCalleeCandidates({ actions }) {
    actions.caller
      .getConnectionRef()
      .collection('calleeCandidates')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`
            );
            await actions.caller
              .getPeerConnection()
              .addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
  },
  setupSnapshotListener({ actions }) {
    // Listening for remote session description below
    actions.caller.getConnectionRef().onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (
        !actions.caller.getPeerConnection().currentRemoteDescription &&
        data &&
        data.answer
      ) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await actions.caller
          .getPeerConnection()
          .setRemoteDescription(rtcSessionDescription);
      }
    });
  },
  setupPeerListeners({ actions }) {
    actions.caller.getPeerConnection().addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        actions.caller.getRemoteStream().addTrack(track);
      });
    });
  },
  async setupLocalCandidates({ actions }) {
    const callerCandidatesCollection = await actions.caller
      .getConnectionRef()
      .collection('callerCandidates');

    actions.caller
      .getPeerConnection()
      .addEventListener('icecandidate', event => {
        if (!event.candidate) {
          // console.log('Got final candidate!');
          return;
        }
        // console.log('Got candidate: ', event.candidate);
        callerCandidatesCollection.add(event.candidate.toJSON());
      });
    // Code for collecting ICE candidates above

    // Code for creating a room below
    const offer = await actions.caller.getPeerConnection().createOffer();
    await actions.caller.getPeerConnection().setLocalDescription(offer);
    // console.log('Created offer:', offer);

    const connectionWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await actions.caller.getConnectionRef().set(connectionWithOffer);
    // connectionId = actions.caller.getConnectionRef().id;
    console.log(
      `New connection created with SDP offer. connection ID: ${
        actions.caller.getConnectionRef().id
      }`
    );
  },
  async setInitialized({ state }, firebase) {
    // debugger; //state.caller.firebase = firebase;
    state.caller.initialized = true;
  },
  getFirebase({ state }) {
    return firebase;
  },
  async setConnectionRef({ state, actions }, connectionId) {
    console.log('Set connectionRef');
    const fb = actions.caller.getFirebase();
    const db = fb.firestore();
    if (connectionId) {
      state.caller.connectionRef = await db
        .collection('connections')
        .doc(connectionId);
    } else {
      state.caller.connectionRef = await db.collection('connections').doc();
    }
  },
  getConnectionRef({ state }) {
    return json(state.caller.connectionRef);
  },

  getLocalStream({ state }) {
    return json(state.caller.localStream);
  },
  getRemoteStream({ state }) {
    return json(state.caller.remoteStream);
  },
  getPeerConnection({ state }) {
    return json(state.caller.peerConnection);
  },
  createPeerConnection({ state }) {
    const configuration = {
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };
    state.caller.peerConnection = new RTCPeerConnection(configuration);
  },
  addLocalTracks({ state, actions }) {
    actions.caller
      .getLocalStream()
      .getTracks()
      .forEach(track => {
        actions.caller
          .getPeerConnection()
          .addTrack(track, actions.caller.getLocalStream());
      });
  },

  addCalleeCandidateCollection({ state, actions }) {
    // const calleeCandidatesCollection = connectionRef.collection("calleeCandidates");
    //   actions.caller
    //     .getPeerConnection()
    //     .addEventListener("icecandidate", event => {
    //       if (!event.candidate) {
    //         console.log("Got final candidate!");
    //         return;
    //       }
    //       console.log("Got candidate: ", event.candidate);
    //       calleeCandidatesCollection.add(event.candidate.toJSON());
    //     });
  },
};

const effects = {
  api: api,
};

const onInitialize = context => {
  console.log('context in connection', context);
  // context.effects.streams.api.initialize(context);
  console.log('init in connection complete');
};

const config = {
  state,
  effects,
  actions,
  onInitialize,
};
export default config;
