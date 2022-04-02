import assertWorker from './index.js'

const {log, error, clear} = console; clear();

assertWorker('a=2', 'a==2').then( r => {
  console.log('tutto bene')
}).catch( r=> {
  console.error('reject', r)
})

assertWorker('a=1', 'a==2').catch( r=> {
  console.error('reject', r) // assertion failed
})

assertWorker('b=2', 'a==2').catch( r=> {
  console.error('reject', r) // a is not defined
})

assertWorker('a=2; while(true) {}', 'a==2', 500).catch( r=> {
  console.error('reject', r) // timeout after 500ms
})
