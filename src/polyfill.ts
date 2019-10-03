Function.prototype.bind = function( obj ) {

  // tslint:disable-next-line:one-variable-per-declaration
  const slice = [].slice,
  args = slice.call(arguments, 1),
  self = this,

  // tslint:disable-next-line
  nop = function() {},
  bound = function() {
    return self.apply( this instanceof nop ? this : ( obj || {} ),
                        args.concat( slice.call(arguments) ) );
  };

  nop.prototype = self.prototype;

  bound.prototype = new nop();

  return bound;
};

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
}
