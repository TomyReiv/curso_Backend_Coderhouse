function form() {
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById('username').value
    const password = document.getElementById("password").value;

    if (email === "" && password === "") {
     return alert("Please fill all fields!");
    }
    fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === 'Inicio de sesión exitoso') {
          localStorage.setItem('user', username);
           window.location.href = "/realTimeProducts"; 
        } else {
          alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }
      })
      .catch((error) => {
        console.error("Error al procesar la solicitud:", error);
        alert("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
      });
  });
};
form();