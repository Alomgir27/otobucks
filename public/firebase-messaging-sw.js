importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

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

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '../src/assets/image/default.svg',
    tag: 'notification-1',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
