const form = document.getElementById('cerrarSesion');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const url = '/api/products/logout'
    const method = 'POST';


    fetch(url, {method})
      .then((res) => {
          window.location.href = '/api/login';
      })
      .catch((err) => {
        console.error(err);
      });
  });

