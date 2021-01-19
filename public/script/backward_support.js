// All Code freely provided from www.developer.mozzila.org

// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: https://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function(fun, thisArg) {
      'use strict';
  
      if (this == null) {
        throw new TypeError('Array.prototype.some called on null or undefined');
      }
  
      if (typeof fun !== 'function') {
        throw new TypeError();
      }
  
      var t = Object(this);
      var len = t.length >>> 0;
  
      for (var i = 0; i < len; i++) {
        if (i in t && fun.call(thisArg, t[i], i, t)) {
          return true;
        }
      }
  
      return false;
    };
  }

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}


// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: https://es5.github.io/#x15.4.4.18

if (!Array.prototype['forEach']) {

  Array.prototype.forEach = function(callback, thisArg) {

    if (this == null) { throw new TypeError('Array.prototype.forEach called on null or undefined'); }

    var T, k;
    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: https://es5.github.com/#x9.11
    if (typeof callback !== "function") { throw new TypeError(callback + ' is not a function'); }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) { T = thisArg; }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}


// bug free animation function from HTTP 203 series
// https://www.youtube.com/watch?v=9-6CKCz58A8
function animateTo(element, keyframes, options) {
  const anim = element.animate(
      keyframes,
      { ...options, fill: 'both' },
  );
  anim.addEventListener('finish', () => {
    anim.commitStyles();
    anim.cancel();
    
      
  });
  return anim
}

// So you don't have to add the original stats, as some phones required
function animateFromCurrent(element, keyframes, options) {
  let newframes = [];

  // For each keyframe, get key name
  keyframes.some(keyframe => {
      for (let key in keyframe) {

          // Collate original and new frame, and add in that order
          let origin = new Object;
          origin[key] = element.style[key];
          newframes.push(origin)
          newframes.push(keyframe);

      } 
  })
  return anim = animateTo(element, newframes, options)
} 

// Show one element and hide the other
function showAndHide(showID, hideID) {
  showElement(showID)
  hideElement(hideID) 
}
function showElement(id) {
  let show = document.getElementById(id);
  show.style.pointerEvents = 'auto';
  show.style.opacity = 1;
}
function hideElement(id) {
  let hide = document.getElementById(id);
  hide.style.pointerEvents = 'none';
  hide.style.opacity = 0;
}