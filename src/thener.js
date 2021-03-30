import getThenMethod from './utils/getThenMethod';
import { isFunction, isNil } from './utils/is';
import nextTick from './utils/nextTick';
import { passError, passValue } from './utils/pass';

class Thener {
  static resolve(value) {
    return new Thener((resolve) => resolve(value));
  }

  static reject(reason) {
    return new Thener((resolve, reject) => reject(reason));
  }

  // 'PENDING' | 'FULFILLED' | 'REJECTED'
  _state_ = 'PENDING';

  _value_ = undefined;

  // interface Task {
  //   thener: Thener;
  //   onFulfilled: (value: any) => any;
  //   onRejected: (reason: any) => any;
  // }
  _tasks_ = [];

  constructor(executor) {
    if (!isFunction(executor)) {
      throw new TypeError(`promise resolver ${executor} should be a function`);
    }

    this._executeEntry_(executor);
  }

  _executeEntry_(executor) {
    const { resolve, reject } = this._createHandlerPairs_();

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  _createHandlerPairs_() {
    let called = false;

    const handler = (fulfilled, value) => {
      if (called) {
        return;
      }

      called = true;

      if (fulfilled) {
        this._resolve_(value);
      } else {
        this._reject_(value);
      }
    };

    return {
      resolve: handler.bind(undefined, true),
      reject: handler.bind(undefined, false),
    };
  }

  // execute the promise resolution procedure, see:
  // https://promisesaplus.com/#the-promise-resolution-procedure
  _resolve_(value) {
    let then;

    try {
      then = getThenMethod(value);
    } catch (error) {
      this._reject_(error);
      return;
    }

    if (isNil(then)) {
      this._solve_(value);
      return;
    }

    if (value === this) {
      this._reject_(
        new TypeError(`chaining cycle detected for promise ${value}`),
      );
      return;
    }

    // already bind to value
    this._executeEntry_(then);
  }

  _reject_(reason) {
    this._solve_(reason, true);
  }

  // can only be called by this[reject_ or this[resolve_
  _solve_(value, rejected = false) {
    if (this._state_ !== 'PENDING') {
      return;
    }

    this._state_ = rejected ? 'REJECTED' : 'FULFILLED';
    this._value_ = value;
    this._tasks_.forEach(this._executeTask_.bind(this));
  }

  _executeTask_(task) {
    if (this._state_ === 'PENDING') {
      return;
    }

    const { thener, onFulfilled, onRejected } = task;
    const handler = this._state_ === 'FULFILLED' ? onFulfilled : onRejected;

    const caller = () => {
      let value;

      try {
        value = handler(this._value_);
      } catch (error) {
        thener._reject_(error);
        return;
      }

      thener._resolve_(value);
    };

    nextTick(caller);
  }

  then(onFulfilled, onRejected) {
    const task = {
      thener: new Thener(() => {}),
      onFulfilled: isFunction(onFulfilled) ? onFulfilled : passValue,
      onRejected: isFunction(onRejected) ? onRejected : passError,
    };

    if (this._state_ === 'PENDING') {
      this._tasks_.push(task);
    } else {
      this._executeTask_(task);
    }

    return task.thener;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

export default Thener;
