import { isNative } from './is';

let callbacks = [];
let pending = false;

const flushCallbacks = () => {
  const prevCallbacks = callbacks;
  callbacks = [];
  pending = false;
  prevCallbacks.forEach((cb) => cb());
};

let asyncHandler = undefined;

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const promise = Promise.resolve();

  asyncHandler = () => {
    promise.then(flushCallbacks);
  };
} else if (
  typeof MutationObserver !== 'undefined' &&
  isNative(MutationObserver)
) {
  const observer = new MutationObserver(flushCallbacks);
  const node = document.createTextNode('0');
  observer.observe(node, { characterData: true });

  asyncHandler = () => {
    node.data = `${(parseInt(node.data) + 1) % 2}`;
  };
} else {
  asyncHandler = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export const nextTick = (cb, ctx = undefined) => {
  callbacks.push(cb.bind(ctx));

  if (pending) {
    return;
  }

  pending = true;
  asyncHandler();
};

export default nextTick;
