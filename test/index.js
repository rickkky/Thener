const test = require('promises-aplus-tests');
const adapter = require('./adapter');

console.log('\n\x1B[36m %s \x1B[39m\n', ' start testing...');

test(adapter, { reporter: 'spec' });
