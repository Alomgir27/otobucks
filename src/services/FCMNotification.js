import * as firebase from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDC4XfvaeaCZWtDL1x4ofgou9V8vOQvkBg',
  authDomain: 'otobucks-43859.firebaseapp.com',
  projectId: 'otobucks-43859',
  storageBucket: 'otobucks-43859.appspot.com',
  messagingSenderId: '443053986656',
  appId: '1:443053986656:web:a3aa37766cd5063690c405',
  measurementId: 'G-7BYPV0T289',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging
  .requestPermission()
  .then(() => {
    console.log('Notification permission granted.');
    return messaging.getToken();
  })
  .then((token) => {
    // Send the token to your server for sending push notifications
    console.log('Token:', token);
  })
  .catch((error) => {
    if (error.code === 'messaging/permission-blocked') {
      console.log('User blocked notifications.');
    } else {
      console.log('Error:', error);
    }
  });

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // show notification here
});

export default messaging;
