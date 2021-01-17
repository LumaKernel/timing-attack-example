const crypto = require('crypto');
const { passwordLength } = require("./validations")
const functions = [...require("./validations").functions]
const chars = [
  "abcdefghijklmnopqrstuvwxyz",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  `!"#$%&'()=~|\\^-0123456789[]:/.,<>?_*}{+@ `,
  "`",
].join("").split("");

const tryCount = 1000000;

const shuffle = (arr) => {
  for(let i = 0, len = arr.length; i < len; i++) {
    const j = crypto.randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const tryWith = (/** @type (s: string) => boolean */ f, /** @type number */ c, /** @type boolean */ pad) => {
  shuffle(chars);
  let known = "";

  for(let i = 0, ilen = pad ? passwordLength : 32; i < ilen; i++) {
    const count = {};
    for(const c of chars) count[c] = 0;

    for(let _0 = 0; _0 < c; _0++) {
      shuffle(chars);
      const thisCount = chars.map(() => 0);

      for(let j = 0, jlen = chars.length; j < jlen; j++) {
        const char = chars[j];
        const challenge = pad ? known + char + "0".repeat(passwordLength - i - 1) : known + char;

        const start = process.hrtime();
        f(challenge);
        const end = process.hrtime();
        thisCount[j] += (end[0] * 1000000 + end[1] / 1000) - (start[0] * 1000000 + start[1] / 1000)
      }
      for(let j = 0; j < chars.length; j++) count[chars[j]] += thisCount[j];
    }

    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);

    console.info("1st: %o", {char: sorted[0][0], cnt: sorted[0][1]},);
    console.info("2nd: %o", {char: sorted[1][0], cnt: sorted[1][1]},);
    console.info("3nd: %o", {char: sorted[2][0], cnt: sorted[2][1]},);
    console.info("last: %o", {char: sorted[sorted.length - 1][0], cnt: sorted[sorted.length - 1][1]},);
    known += sorted[0][0]

    if(f(known)) return known;
  }

  return known;
};


// shuffle(functions);
// shuffle(functions);
// shuffle(functions);

shuffle(chars);
shuffle(chars);
shuffle(chars);

for(const pad of [true, false]) {
  for(const { v, name } of functions) {
    console.info("Start: %o", new Date);
    console.info("Pad: %o", pad);
    console.info("Function: %s", name);
    const expect = tryWith(v, tryCount, pad);
    console.info("Expect: %s", expect);
    console.info("Result: %o", v(expect));
    console.info("End: %o", new Date);
    console.info();
  }
}
