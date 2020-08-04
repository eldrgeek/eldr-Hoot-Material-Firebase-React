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

// const firebaseConfig = {
//   apiKey: 'AIzaSyAEM9uGdlfMsFAX1FaYBuiWT3Bh0ZfFRcE',
//   authDomain:
//     'https://3000-feeffad4-e711-4e5f-9f7f-891b31f22047.ws-us02.gitpod.io/',
//   databaseURL: 'https://civicapathyproject.firebaseio.com',
//   projectId: 'civicapathyproject',
//   storageBucket: 'civicapathyproject.appspot.com',
//   messagingSenderId: '208039221624',
//   appId: '1:208039221624:web:894094b7d962d148aed08d',
// };
// let fb;

// const api = (() => {
//   return {
//     state: null,
//     initialize({ state, actions }) {
//       if (!state.firebaseInitialized) {
//         actions.setFirebaseInitialized();
//         fb = firebase.initializeApp(firebaseConfig);
//       }
//       // state.firebase = firebase;
//     },
//     getFirebase() {
//       return fb;
//     },
//   };
// })();

const actions = {
  async templateAction({
    state: { streams: state },
    actions: { streams: actions },
  }) {},
  async makeConnections({ state, actions: { streams: actions } }) {
    for (let member of state.rooms.members) {
      if (member.id < state.rooms.sessionId) {
      }
    }
  },
  async toggleUserMedia({
    state: { streams: state },
    actions: { streams: actions },
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
    state.streams.localStream = stream;
    state.streams.remoteStream = new MediaStream();
  },
  async closeUserMedia({
    state: { streams: state },
    actions: { streams: actions },
  }) {
    if (!state.localStream) return;
    const stream = actions.getLocalStream();
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
    state.localStream = null;
    state.remoteStream = null;
  },
  // async createConnection({ actions }) {
  //   await actions.streams.setConnectionRef();
  //   await actions.streams.createPeerConnection();
  //   actions.streams.addLocalTracks();
  //   await actions.streams.setupLocalCandidates();
  //   actions.streams.setupPeerListeners();
  //   actions.streams.setupSnapshotListener();
  //   actions.streams.setupCalleeCandidates();
  // },
  // async joinConnectionById({ actions }, connectionId) {
  //   actions.streams.setConnectionId(connectionId);
  //   await actions.streams.setConnectionRef(`${connectionId}`);
  //   await actions.streams.getConnectionSnapshot();
  // },
  // setConnectionId({ state }, connectionId) {
  //   state.streams.connectionId = connectionId;
  // },
  // getConnectionId({ state }) {
  //   return json(state.streams.connectionId);
  // },
  // async hangUp({ actions }) {
  //   // const tracks = document.querySelector("#localVideo").srcObject.getTracks();

  //   actions.streams.closeLocalMedia();
  //   if (actions.streams.getRemoteStream()) {
  //     actions.connection
  //       .getRemoteStream()
  //       .getTracks()
  //       .forEach(track => track.stop());
  //   }

  //   if (actions.streams.getPeerConnection()) {
  //     actions.streams.getPeerConnection().close();
  //   }
  //   if (actions.streams.getConnectionId()) {
  //     await actions.streams.setConnectionRef();
  //     const calleeCandidates = await actions.connection
  //       .getConnectionRef()
  //       .collection('calleeCandidates')
  //       .get();
  //     calleeCandidates.forEach(async candidate => {
  //       await candidate.ref.delete();
  //     });
  //     const callerCandidates = await actions.connection
  //       .getConnectionRef()
  //       .collection('callerCandidates')
  //       .get();
  //     callerCandidates.forEach(async candidate => {
  //       await candidate.ref.delete();
  //     });
  //     await actions.streams.getConnectionRef().delete();
  //   }
  // },
  // async getConnectionSnapshot({ actions }) {
  //   const connectionSnapshot = await actions.streams.getConnectionRef().get();
  //   console.log('Got connection:', connectionSnapshot.exists);

  //   if (connectionSnapshot.exists) {
  //     // console.log("Create PeerConnection with configuration: ", configuration);
  //     actions.streams.createPeerConnection();

  //     // peerConnection = new RTCPeerConnection(configuration);
  //     // registerPeerConnectionListeners();
  //     actions.streams.addLocalTracks();

  //     // Code for collecting ICE candidates below
  //     actions.streams.addCalleeCandidateCollection();

  //     const calleeCandidatesCollection = actions.connection
  //       .getConnectionRef()
  //       .collection('calleeCandidates');

  //     actions.connection
  //       .getPeerConnection()
  //       .addEventListener('icecandidate', event => {
  //         if (!event.candidate) {
  //           console.log('Got final candidate!');
  //           return;
  //         }
  //         console.log('Got candidate: ', event.candidate);
  //         calleeCandidatesCollection.add(event.candidate.toJSON());
  //       });
  //     // Code for collecting ICE candidates above

  //     actions.connection
  //       .getPeerConnection()
  //       .addEventListener('track', event => {
  //         console.log('Got remote track:', event.streams[0]);
  //         event.streams[0].getTracks().forEach(track => {
  //           console.log('Add a track to the remoteStream:', track);
  //           actions.streams.getRemoteStream().addTrack(track);
  //         });
  //       });

  //     // Code for creating SDP answer below
  //     const offer = connectionSnapshot.data().offer;
  //     console.log('Got offer:', offer);
  //     await actions.connection
  //       .getPeerConnection()
  //       .setRemoteDescription(new RTCSessionDescription(offer));
  //     const answer = await actions.connection
  //       .getPeerConnection()
  //       .createAnswer();
  //     console.log('Created answer:', answer);
  //     await actions.streams.getPeerConnection().setLocalDescription(answer);

  //     const connectionWithAnswer = {
  //       answer: {
  //         type: answer.type,
  //         sdp: answer.sdp,
  //       },
  //     };
  //     await actions.streams.getConnectionRef().update(connectionWithAnswer);
  //     // Code for creating SDP answer above

  //     // Listening for remote ICE candidates below
  //     actions.connection
  //       .getConnectionRef()
  //       .collection('callerCandidates')
  //       .onSnapshot(snapshot => {
  //         snapshot.docChanges().forEach(async change => {
  //           if (change.type === 'added') {
  //             let data = change.doc.data();
  //             console.log(
  //               `Got new remote ICE candidate: ${JSON.stringify(data)}`
  //             );
  //             await actions.connection
  //               .getPeerConnection()
  //               .addIceCandidate(new RTCIceCandidate(data));
  //           }
  //         });
  //       });
  //   }
  // },
  // setupCalleeCandidates({ actions }) {
  //   actions.connection
  //     .getConnectionRef()
  //     .collection('calleeCandidates')
  //     .onSnapshot(snapshot => {
  //       snapshot.docChanges().forEach(async change => {
  //         if (change.type === 'added') {
  //           let data = change.doc.data();
  //           console.log(
  //             `Got new remote ICE candidate: ${JSON.stringify(data)}`
  //           );
  //           await actions.connection
  //             .getPeerConnection()
  //             .addIceCandidate(new RTCIceCandidate(data));
  //         }
  //       });
  //     });
  // },
  // setupSnapshotListener({ actions }) {
  //   // Listening for remote session description below
  //   actions.streams.getConnectionRef().onSnapshot(async snapshot => {
  //     const data = snapshot.data();
  //     if (
  //       !actions.streams.getPeerConnection().currentRemoteDescription &&
  //       data &&
  //       data.answer
  //     ) {
  //       console.log('Got remote description: ', data.answer);
  //       const rtcSessionDescription = new RTCSessionDescription(data.answer);
  //       await actions.connection
  //         .getPeerConnection()
  //         .setRemoteDescription(rtcSessionDescription);
  //     }
  //   });
  // },
  // setupPeerListeners({ actions }) {
  //   actions.streams.getPeerConnection().addEventListener('track', event => {
  //     console.log('Got remote track:', event.streams[0]);
  //     event.streams[0].getTracks().forEach(track => {
  //       console.log('Add a track to the remoteStream:', track);
  //       actions.streams.getRemoteStream().addTrack(track);
  //     });
  //   });
  // },
  // async setupLocalCandidates({ actions }) {
  //   const callerCandidatesCollection = await actions.connection
  //     .getConnectionRef()
  //     .collection('callerCandidates');

  //   actions.connection
  //     .getPeerConnection()
  //     .addEventListener('icecandidate', event => {
  //       if (!event.candidate) {
  //         // console.log('Got final candidate!');
  //         return;
  //       }
  //       // console.log('Got candidate: ', event.candidate);
  //       callerCandidatesCollection.add(event.candidate.toJSON());
  //     });
  //   // Code for collecting ICE candidates above

  //   // Code for creating a room below
  //   const offer = await actions.streams.getPeerConnection().createOffer();
  //   await actions.streams.getPeerConnection().setLocalDescription(offer);
  //   // console.log('Created offer:', offer);

  //   const connectionWithOffer = {
  //     offer: {
  //       type: offer.type,
  //       sdp: offer.sdp,
  //     },
  //   };
  //   await actions.streams.getConnectionRef().set(connectionWithOffer);
  //   // connectionId = actions.streams.getConnectionRef().id;
  //   console.log(
  //     `New connection created with SDP offer. connection ID: ${
  //       actions.streams.getConnectionRef().id
  //     }`
  //   );
  // },
  // async setInitialized({ state }, firebase) {
  //   // debugger; // state.streams.firebase = firebase;
  //   state.streams.initialized = true;
  // },
  // getFirebase({ state }) {
  //   return firebase;
  // },
  // async setConnectionRef({ state, actions }, connectionId) {
  //   console.log('Set connectionRef');
  //   const fb = actions.streams.getFirebase();
  //   const db = fb.firestore();
  //   if (connectionId) {
  //     state.streams.connectionRef = await db
  //       .collection('connections')
  //       .doc(connectionId);
  //   } else {
  //     state.streams.connectionRef = await db.collection('connections').doc();
  //   }
  // },
  // getConnectionRef({ state }) {
  //   return json(state.streams.connectionRef);
  // },

  getLocalStream({ state }) {
    return json(state.streams.localStream);
  },
  // getRemoteStream({ state }) {
  //   return json(state.streams.remoteStream);
  // },
  // getPeerConnection({ state }) {
  //   return json(state.streams.peerConnection);
  // },
  // createPeerConnection({ state }) {
  //   const configuration = {
  //     iceServers: [
  //       {
  //         urls: [
  //           'stun:stun1.l.google.com:19302',
  //           'stun:stun2.l.google.com:19302',
  //         ],
  //       },
  //     ],
  //     iceCandidatePoolSize: 10,
  //   };
  //   state.streams.peerConnection = new RTCPeerConnection(configuration);
  // },
  // addLocalTracks({ state, actions }) {
  //   actions.connection
  //     .getLocalStream()
  //     .getTracks()
  //     .forEach(track => {
  //       actions.connection
  //         .getPeerConnection()
  //         .addTrack(track, actions.streams.getLocalStream());
  //     });
  // },

  addCalleeCandidateCollection({ state, actions }) {
    // const calleeCandidatesCollection = connectionRef.collection("calleeCandidates");
    //   actions.connection
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
  // api: api,
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
