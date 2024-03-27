window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');

  let load = 0;
  const interval = setInterval(() => {
    load++;
    document.getElementById('percentage').innerText = `${load}%`;

    if (load === 10) {
      clearInterval(interval);
      preloader.style.display = 'none';
    }
  }, 20);
});
  