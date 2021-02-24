obj = {
  name: 'name',
  age: 12
}

console.group('more than log');
console.assert(1, 'stuff');
console.table({obj: obj});
console.warn('Something is wrong');
console.error('It is wrong, error!');

console.groupEnd();


function getSum() {
  addNumbers();
}

function addNumbers() {
  console.trace();
}

getSum();