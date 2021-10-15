export const postMessage = (msg) => {
  window.parent.postMessage(JSON.stringify({
    type: msg.type,
    payload: msg.payload,
  }), '*');
};

export const receiveMessage = (type) => new Promise((resolve) => {
  const listener = (event) => {
    if (typeof event.data === 'string' && event.data.includes('pym')) return;
    if (typeof event.data !== 'string') return;
    const msg = JSON.parse(event.data);
    if (msg.type === type) {
      window.removeEventListener('message', listener);
      resolve(msg.payload);
    }
  };
  window.addEventListener('message', listener);
});

export const subscribeToMessage = (type, callback) => {
  const listener = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === type) {
      callback(msg.payload);
    }
  };
  window.addEventListener('message', listener);
};
