import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import 'firebase/storage';
import { openNotification } from './helpers';

export const app = initializeApp({
  apiKey: 'AIzaSyDC4XfvaeaCZWtDL1x4ofgou9V8vOQvkBg',
  authDomain: 'otobucks-43859.firebaseapp.com',
  projectId: 'otobucks-43859',
  storageBucket: 'otobucks-43859.appspot.com',
  messagingSenderId: '443053986656',
  appId: '1:443053986656:web:a3aa37766cd5063690c405',
  measurementId: 'G-7BYPV0T289',
});

export const messaging = getMessaging(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

export const getTokenFound = async () => {
  let currentToken = '';
  try {
    currentToken = await getToken(messaging, {
      vapidKey:
        'BNT3ndTj_PQL5NCSUiAEiWu4pfTMI03MgrFS5LslWOFyJELmfTOgX0cvhgK3CH8khKRyPBp8Mwyhb5VE5YLccGc',
    });
    if (currentToken) {
      console.log('CURRENT TOKEN', currentToken);
    } else {
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise(() => {
    onMessage(messaging, (payload) => {
      openNotification(payload.notification.body);
    });
  });
