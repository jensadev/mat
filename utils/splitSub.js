function splitSub (sub) {
  if (sub.includes('@')) {
    return String(sub).split('@')[0];
  }
  return String(sub).split('|')[1];
}

module.exports = {splitSub};