//nonfunctional needst to query database

// Pseudo Code query needed
// need to pull the message board the corresponds to the event clicked.

const dbRef = ref(getDatabase());
const messageboardRef = collection(dbRef, 'messageboard');
const queryMessageBoard = query(messageboardRef, where('', '==', ''));
const notificationRef = collection(dbRef, 'notifications');
console.log(messageboardRef);
// const dbRef = testDataMessage;
// get(child(dbRef, `messageboard`))
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       const messageList = Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));
//       setMessages(messageList);
//       // console.log(messageList);
//     } else {
//       console.log('No data available');
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });
