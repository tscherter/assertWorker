import {} from 'https://unpkg.com/@babel/standalone/babel.min.js';

const assertWorker = (code, assertion, timeout=1000, babelPresets = {}) => new Promise((resolve, reject) => {
  try {
    code = Babel.transform(code, babelPresets).code
  } catch (ex) {
    return reject(ex?.message??ex)
  }
  const workerCode = `try{ ${code}; postMessage(${assertion}) } catch(ex) { postMessage(ex?.message??ex)}`
  const worker = new Worker(`data:text/javascript,${encodeURIComponent(workerCode)}`)
  let timeoutID
  worker.onmessage = (e) => {
    clearTimeout(timeoutID)
    worker.terminate()
    e.data === true 
      ? resolve()
      : e.data === false
        ? reject({message: 'assertion failed'})
        : reject({message: e.data})
  }
  timeoutID = setTimeout(() => {
    worker.terminate()
    reject({message: `timeout after ${timeout} ms`})
  }, timeout)

})

export default assertWorker;
