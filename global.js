// userSession.js

let token = null;
let username = null;

const setUserSession = (newToken, newUsername) => {
  token = newToken;
  username = newUsername;
};

const getUserSession = () => {
  return { token, username };
};

module.exports = {
  setUserSession,
  getUserSession,
};
