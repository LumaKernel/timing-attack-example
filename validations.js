const crypto = require('crypto');
const password = process.env.PASSWORD || "Pa55w*rd$";
const passwordLength = password.length;

exports.passwordLength = passwordLength;

const functions = [
  {
    name: "Dangerous0",
    v: (/** @type string */ challenge) => {
      if (challenge.length !== password.length) return false;
      for(let i = 0; i < challenge.length; i++) {
        if(challenge.charCodeAt(i) !== password.charCodeAt(i)) return false;
      }
      return true;
    },
  },
  {
    name: "Unsafe0",
    v: (/** @type string */ challenge) => {
    return challenge === password;
    }
  },
  {
    name: "Unsafe1",
    v: (/** @type string */ challenge) => {
      return challenge == password;
    },
  },
  {
    name: "Safe0",
    v: (/** @type string */ challenge) => {
      try {
        return crypto.timingSafeEqual(Buffer.from(challenge), Buffer.from(password));
      } catch (e) {
        return false;
      }
    },
  },
  {
    name: "Safe1",
    v: (/** @type string */ challenge) => {
      if (challenge.length !== password.length) return false;
      let diff = 0;
      for(let i = 0; i < challenge.length; i++) {
        diff |= challenge.charCodeAt(i) ^ password.charCodeAt(i);
      }
      return diff === 0;
    },
  },
];

exports.functions = functions;
