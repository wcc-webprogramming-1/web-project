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
    --border-color: var(--c-neutral-500);

    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100vh;
    gap: 1px;
    background-color: var(--border-color);
  }

  .left-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }

  .center {
    max-width: 33%;
    min-width: 575px;
    flex-grow: 1;
    background-color: var(--c-black);
    overflow: hidden;
  }

  .right-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }
</style>