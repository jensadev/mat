const adjektiv = require('../docs/adjektiv.json');
const substantiv = require('../docs/substantiv.json');

function generateUserName() {
  let adj = getRandomInt(0, adjektiv.length);
  let sub = getRandomInt(0, substantiv.length);
  return (
    capitalizeFirstLetter(adjektiv[adj]) +
    capitalizeFirstLetter(substantiv[sub]) +
    clamp(adj + sub, 0, 5000)
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

module.exports = { generateUserName };
