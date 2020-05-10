const _ = require('lodash');
const randomWords = require('random-words');

const generateCodename = () =>
  randomWords({
    exactly: 2,
    join: '',
    minLength: 3,
    formatter: (word) => _.capitalize(word)
  });

module.exports = { generateCodename };
