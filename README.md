<p>
  <img src="https://assets.solidjs.com/banner?project=Library&type=core" alt="SolidJS" />
</p>

This is the reactivity part of SolidJS, extracted out of the UI framework. Check out SolidJS's [Reactivity Tutorial](https://www.solidjs.com/guides/reactivity) to learn how to use this.

This extraction has made changes:

* Anything related to Solid's UI framework has been removed.
* All `createX` functions, such as `createSignal`, have been renamed to `$x`, e.g. `$signal`.
* `$DEVCOMP`, `$PROXY`, and `$TRACK` have been renames, with their `$` replaced with `_`.
* Dev exports are always accessible.
