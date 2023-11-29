<div class="root">
  <div class="left-bar">

  </div>

  <div class="center">
    <slot></slot>
  </div>

  <div class="right-bar">

  </div>
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100vh;
    gap: 1px;
    background-color: var(--c-neutral-600);
  }

  .left-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }

  .center {
    width: 33%;
    min-width: 575px;
    flex-grow: 1;
    background-color: var(--c-black);
  }

  .right-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }
</style>