<p>
  <img src="https://assets.solidjs.com/banner?project=Library&type=core" alt="SolidJS" />
</p>

This is the reactivity part of SolidJS, extracted out of the UI framework. Check out SolidJS's [Reactivity Tutorial](https://www.solidjs.com/guides/reactivity) to learn how to use this.

This extraction has made changes:

* Anything related to Solid's UI framework has been removed.
* All `createX` functions, such as `createSignal`, have been renamed to `$x`, e.g. `$signal`.
* `$DEVCOMP`, `$PROXY`, and `$TRACK` have been renamed with their `$` replaced with `_`, e.g. `_DEVCOMP`.
* The default `equalFn` has been changed from `a === b` to `(a === 0 && b === 0) || Object.is(a, b)`, so now `NaN` will compare as equal to itself.
* Dev exports are always accessible.
* Instead of returning a tuple, `$signal` returns an object with `get` and `set` methods.
* Added `$readonly` function to make object signals read-only.
