// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl1cUItoOICY2fMOppGGNt1MaCiu-kJeQ",
  authDomain: "korn-jsr1130-project.firebaseapp.com",
  databaseURL: "https://korn-jsr1130-project-default-rtdb.firebaseio.com/",
  projectId: "korn-jsr1130-project",
  storageBucket: "korn-jsr1130-project.appspot.com",
  messagingSenderId: "163279245994",
  appId: "1:163279245994:web:969ea8dbe1195febd8b6d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
const myKornDatabase = getDatabase(app);
const auth = getAuth();

const messageBoard = document.querySelector(".message-board");

const messageTextArea = document.querySelector("#message");
const postToBoardButton = document.querySelector(".btn");

postToBoardButton.addEventListener("click", writeUserData);

const signUpButton = document.querySelector(".sign-up-button");
signUpButton.addEventListener("click", signUpUser);

const signInButton = document.querySelector(".sign-in-button");
signInButton.addEventListener("click", signInUser);

const signOutButton = document.querySelector(".sign-out-button");
signOutButton.addEventListener("click", signOutUser);

const emailInput = document.querySelector("input[name='email']");
const passwordInput = document.querySelector("input[name='password']");
const welcomeSpan = document.querySelector(".welcome");

function signOutUser() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      welcomeSpan.textContent = `USER is signed out`;
    })
    .catch((error) => {
      // An error happened.
    });
}

function signInUser() {
  let email = emailInput.value;
  let password = passwordInput.value;
  console.log(email, password);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      welcomeSpan.textContent = `${user.email} is signed in`;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function signUpUser() {
  let email = emailInput.value;
  let password = passwordInput.value;
  console.log(email, password);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      welcomeSpan.textContent = `${user.email} is signed in`;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

messageTextArea.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    writeUserData(event);
  }
});

function writeUserData(event) {
  event.preventDefault();
  let message = {
    message: messageTextArea.value,
    votes: 0,
  };

  messageTextArea.value = "";

  const postMessagesRef = ref(myKornDatabase, "messages");
  //   const newMessagesRef = push(postMessagesRef);
  set(push(postMessagesRef), message);
}

function getAllMessages() {
  const allMessagesRef = ref(myKornDatabase, "messages");
  onValue(allMessagesRef, (snapshot) => {
    const allMessages = snapshot.val();
    const messages = [];

    for (let id in allMessages) {
      let message = allMessages[id].message;
      let votes = allMessages[id].votes;

      let newLiTag = document.createElement("li");
      newLiTag.textContent = message;

      // create delete element
      let deleteElement = document.createElement("i");
      deleteElement.classList.add("fa", "fa-trash", "pull-right", "delete");
      deleteElement.addEventListener("click", function (event) {
        let messageId = event.target.parentNode.getAttribute("data-id");
        let messageToUpdate = child(allMessagesRef, messageId);
        remove(messageToUpdate);
      });

      // create up vote element
      let upVoteElement = document.createElement("i");
      upVoteElement.classList.add("fa", "fa-thumbs-up", "pull-right");
      upVoteElement.addEventListener("click", function (event) {
        let messageId = event.target.parentNode.getAttribute("data-id");
        let messageToUpdate = child(allMessagesRef, messageId);
        update(messageToUpdate, { votes: ++votes });
      });

      // create down vote element
      let downVoteElement = document.createElement("i");
      downVoteElement.classList.add("fa", "fa-thumbs-down", "pull-right");
      downVoteElement.addEventListener("click", function (event) {
        let messageId = event.target.parentNode.getAttribute("data-id");
        let messageToUpdate = child(allMessagesRef, messageId);
        update(messageToUpdate, { votes: --votes });
      });

      // show votes
      let showVotesElement = document.createElement("div");
      showVotesElement.classList.add("pull-right");
      showVotesElement.textContent = votes;
      newLiTag.append(
        deleteElement,
        downVoteElement,
        upVoteElement,
        showVotesElement
      );

      newLiTag.setAttribute("data-id", id);
      messages.push(newLiTag);
    }
    messageBoard.innerHTML = "";
    messages.forEach((message) => {
      messageBoard.append(message);
    });
  });
}

window.onload = getAllMessages();
