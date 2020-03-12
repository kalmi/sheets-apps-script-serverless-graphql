const microtasksData = {
  queue: [],
};

global.queueMicrotask = function queueMicrotask(f) {
  microtasksData.queue.push(f);
};

global.fakeEventLoop = function fakeEventLoop() {
  let i = 0;
  do {
    i++;
    Logger.log(`Fake event loop pass #${i}`);
    const currentMicrotasks = microtasksData.queue;
    microtasksData.queue = [];
    currentMicrotasks.forEach((f) => f());
  } while (microtasksData.queue.length > 0);
};
