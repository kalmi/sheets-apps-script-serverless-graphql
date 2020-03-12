// Google Apps Script has no support for Promise-based event loop using code,
// but the graphql library is a heavy user of promises and the event loop.

// We replace Promise in a way that allows us to implement our own "event loop"

const microtasksData = {
  queue: [],
};

global.queueMicrotask = function queueMicrotask(f) {
  microtasksData.queue.push(f);
};

export function runFakeEventLoop() {
  let i = 0;
  do {
    i++;
    Logger.log(`Fake event loop pass #${i}`);
    const currentMicrotasks = microtasksData.queue;
    microtasksData.queue = [];
    currentMicrotasks.forEach(f => f());
  } while (microtasksData.queue.length > 0);
};

// This following import must be at the end of this file.
//
// core-js/es/promise checks for the presence of global.queueMicrotask,
// and if available, uses it.
//
// That means the promise polyfill must be imported only after
// global.queueMicrotask is set up.

import "core-js/es/promise";