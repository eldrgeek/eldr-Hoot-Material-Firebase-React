import * as firebase from 'firebase';
import { json, derived } from 'overmind';
const diag = false;
const state = {
  initialized: false,
  connectionName: 'test',
  localStream: null,
  remoteStream: {},
  enablePrompt: derived((state) => (state.localStream ? 'Hangup' : 'Open')),
  connectionId: {},
  connectionRef: {},
  peerConnection: {},
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
    state: { callee: state },
    actions: { callee: actions },
  }) {},
  async makeConnections({ state, actions: { callee: actions } }) {
    for (let member of state.rooms.members) {
      if (member.id < state.rooms.sessionId) {
      }
    }
  },
  async toggleUserMedia({
    state: { callee: state },
    actions: { callee: actions },
  }) {
    if (state.localStream) {
      actions.closeUserMedia();
      state.localStream = null;
    } else {
      actions.openUserMedia();
    }
  },
  async openUserMedia({ state }, instance) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    state.callee.localStream = stream;
  },
  async closeUserMedia({
    state: { callee: state },
    actions: { callee: actions },
  }) {
    const stream = actions.getLocalStream();
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    state.localStream = null;
  },
  // async createConnection({ actions }) {
  //   await actions.callee.setConnectionRef();
  //   await actions.callee.createPeerConnection();
  //   await actions.callee.addLocalTracks();
  //   await actions.callee.setupLocalCandidates();
  //   actions.callee.setupPeerListeners();
  //   actions.callee.setupSnapshotListener();
  //   actions.callee.setupCalleeCandidates();
  // },
  async joinConnectionById(
    { state, actions },
    {
      connectionId,
      instance = 'test',
      caller = 'testcaller',
      callee = 'testcallee',
    }
  ) {
    state.callee.remoteStream[instance] = new MediaStream();
    actions.callee.setConnectionId({ connectionId, instance });
    await actions.callee.setConnectionRef({ connectionId, instance });
    await actions.callee.getConnectionSnapshot(instance);
  },
  setConnectionId({ state }, { connectionId, instance }) {
    state.callee.connectionId[instance] = { id: connectionId };
  },
  getConnectionId({ state }, instance) {
    return json(state.callee.connectionId[instance]);
  },
  async hangUp({ actions }, instance) {
    // const tracks = document.querySelector("#localVideo").srcObject.getTracks();

    actions.callee.closeUserMedia();
    if (actions.callee.getRemoteStream(instance)) {
      actions.callee
        .getRemoteStream(instance)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (actions.callee.getPeerConnection(instance)) {
      actions.callee.getPeerConnection(instance).close();
    }
    if (actions.callee.getConnectionId(instance)) {
      // await actions.callee.setConnectionRef({instance});
      const calleeCandidates = await actions.callee
        .getConnectionRef(instance)
        .collection('calleeCandidates')
        .get();
      calleeCandidates.forEach(async (candidate) => {
        await candidate.ref.delete();
      });
      const callerCandidates = await actions.callee
        .getConnectionRef(instance)
        .collection('callerCandidates')
        .get();
      callerCandidates.forEach(async (candidate) => {
        await candidate.ref.delete();
      });
      await actions.callee.getConnectionRef(instance).delete();
    }
  },
  async getConnectionSnapshot({ actions }, instance) {
    const connectionSnapshot = await actions.callee
      .getConnectionRef(instance)
      .get();
    if (diag) console.log('Got connection:', connectionSnapshot.exists);

    if (connectionSnapshot.exists) {
      // if(diag) console.log("Create PeerConnection with configuration: ", configuration);
      actions.callee.createPeerConnection(instance);

      // peerConnection = new RTCPeerConnection(configuration);
      // registerPeerConnectionListeners();
      actions.callee.addLocalTracks(instance);

      // Code for collecting ICE candidates below
      // actions.callee.addCalleeCandidateCollection();

      const calleeCandidatesCollection = actions.callee
        .getConnectionRef(instance)
        .collection('calleeCandidates');

      actions.callee
        .getPeerConnection(instance)
        .addEventListener('icecandidate', (event) => {
          if (!event.candidate) {
            if (diag) console.log('Got final candidate!');
            return;
          }
          if (diag) console.log('Got candidate: ', event.candidate);
          calleeCandidatesCollection.add(event.candidate.toJSON());
        });
      // Code for collecting ICE candidates above

      actions.callee
        .getPeerConnection(instance)
        .addEventListener('track', (event) => {
          if (diag) console.log('Got remote track:', event.streams[0]);
          event.streams[0].getTracks().forEach((track) => {
            if (diag) console.log('Add a track to the remoteStream:', track);
            actions.callee.getRemoteStream(instance).addTrack(track);
          });
        });

      // Code for creating SDP answer below
      const offer = connectionSnapshot.data().offer;
      if (diag) console.log('Got offer:', offer);
      await actions.callee
        .getPeerConnection(instance)
        .setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await actions.callee
        .getPeerConnection(instance)
        .createAnswer();
      if (diag) console.log('Created answer:', answer);
      await actions.callee
        .getPeerConnection(instance)
        .setLocalDescription(answer);

      const connectionWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await actions.callee
        .getConnectionRef(instance)
        .update(connectionWithAnswer);
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      actions.callee
        .getConnectionRef(instance)
        .collection('callerCandidates')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              let data = change.doc.data();
              if (diag)
                console.log(
                  `Got new remote ICE candidate: ${JSON.stringify(data)}`
                );
              await actions.callee
                .getPeerConnection(instance)
                .addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
    }
  },
  // setupCalleeCandidates({ actions }) {
  //   actions.callee
  //     .getConnectionRef()
  //     .collection('calleeCandidates')
  //     .onSnapshot(snapshot => {
  //       snapshot.docChanges().forEach(async change => {
  //         if (change.type === 'added') {
  //           let data = change.doc.data();
  //           if(diag) console.log(
  //             `Got new remote ICE candidate: ${JSON.stringify(data)}`
  //           );
  //           await actions.callee
  //             .getPeerConnection()
  //             .addIceCandidate(new RTCIceCandidate(data));
  //         }
  //       });
  //     });
  // },
  // setupSnapshotListener({ actions }) {
  //   // Listening for remote session description below
  //   actions.callee.getConnectionRef().onSnapshot(async snapshot => {
  //     const data = snapshot.data();
  //     if (
  //       !actions.callee.getPeerConnection().currentRemoteDescription &&
  //       data &&
  //       data.answer
  //     ) {
  //       if(diag) console.log('Got remote description: ', data.answer);
  //       const rtcSessionDescription = new RTCSessionDescription(data.answer);
  //       await actions.callee
  //         .getPeerConnection()
  //         .setRemoteDescription(rtcSessionDescription);
  //     }
  //   });
  // },
  // setupPeerListeners({ actions }) {
  //   actions.callee.getPeerConnection().addEventListener('track', event => {
  //     if(diag) console.log('Got remote track:', event.streams[0]);
  //     event.streams[0].getTracks().forEach(track => {
  //       if(diag) console.log('Add a track to the remoteStream:', track);
  //       actions.callee.getRemoteStream().addTrack(track);
  //     });
  //   });
  // },
  // async setupLocalCandidates({ actions }) {
  //   const callerCandidatesCollection = await actions.callee
  //     .getConnectionRef()
  //     .collection('callerCandidates');

  //   actions.callee
  //     .getPeerConnection()
  //     .addEventListener('icecandidate', event => {
  //       if (!event.candidate) {
  //         // if(diag) console.log('Got final candidate!');
  //         return;
  //       }
  //       // if(diag) console.log('Got candidate: ', event.candidate);
  //       callerCandidatesCollection.add(event.candidate.toJSON());
  //     });
  //   // Code for collecting ICE candidates above

  //   // Code for creating a room below
  //   const offer = await actions.callee.getPeerConnection().createOffer();
  //   await actions.callee.getPeerConnection().setLocalDescription(offer);
  //   // if(diag) console.log('Created offer:', offer);

  //   const connectionWithOffer = {
  //     offer: {
  //       type: offer.type,
  //       sdp: offer.sdp,
  //     },
  //   };
  //   await actions.callee.getConnectionRef().set(connectionWithOffer);
  //   // connectionId = actions.callee.getConnectionRef().id;
  //   if(diag) console.log(
  //     `New connection created with SDP offer. connection ID: ${
  //       actions.callee.getConnectionRef().id
  //     }`
  //   );
  // },
  async setInitialized({ state }, firebase) {
    // debugger; // state.callee.firebase = firebase;
    state.callee.initialized = true;
  },
  getFirebase({ state }) {
    return firebase;
  },
  async setConnectionRef({ state, actions }, { connectionId, instance }) {
    if (diag) console.log('Set connectionRef');
    const fb = actions.callee.getFirebase();
    const db = fb.firestore();
    if (connectionId) {
      state.callee.connectionRef[instance] = await db
        .collection('connections')
        .doc(connectionId);
    } else {
      state.callee.connectionRef[instance] = await db
        .collection('connections')
        .doc();
    }
  },
  getConnectionRef({ state }, instance) {
    return json(state.callee.connectionRef[instance]);
  },

  getLocalStream({ state }) {
    return json(state.callee.localStream);
  },
  getRemoteStream({ state }, instance) {
    return json(state.callee.remoteStream[instance]);
  },
  getPeerConnection({ state }, instance) {
    return json(state.callee.peerConnection[instance]);
  },
  createPeerConnection({ state }, instance) {
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
    state.callee.peerConnection[instance] = new RTCPeerConnection(
      configuration
    );
  },
  addLocalTracks({ state, actions }, instance) {
    actions.callee
      .getLocalStream()
      .getTracks()
      .forEach((track) => {
        actions.callee
          .getPeerConnection(instance)
          .addTrack(track, actions.callee.getLocalStream());
      });
  },

  addCalleeCandidateCollection({ state, actions }) {
    // const calleeCandidatesCollection = connectionRef.collection("calleeCandidates");
    //   actions.callee
    //     .getPeerConnection()
    //     .addEventListener("icecandidate", event => {
    //       if (!event.candidate) {
    //         if(diag) console.log("Got final candidate!");
    //         return;
    //       }
    //       if(diag) console.log("Got candidate: ", event.candidate);
    //       calleeCandidatesCollection.add(event.candidate.toJSON());
    //     });
  },
};

const effects = {
  api: api,
};

const onInitialize = (context) => {
  if (diag) console.log('context in connection', context);
  // context.effects.streams.api.initialize(context);
  if (diag) console.log('init in connection complete');
};

const config = {
  state,
  effects,
  actions,
  onInitialize,
};
export default config;
