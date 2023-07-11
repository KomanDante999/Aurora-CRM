import { AppAurora } from "./App-Aurora.js";

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const $container = document.getElementById('aurora-crm');
    $container.classList.add('aurora-crm');
    let Aurora = new AppAurora({
      container: $container,
    })

  })
})()

