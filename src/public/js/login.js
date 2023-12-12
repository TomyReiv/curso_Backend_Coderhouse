function form() {
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data._id);
        if (data.email === "ravetomas@gmail.com") {
          localStorage.setItem("user", username);
          localStorage.setItem("uid", data._id);
          return (window.location.href = "/realTimeProducts");
        }
        if (data.username) {
          localStorage.setItem("user", username);
          localStorage.setItem("uid", data._id);
          return (window.location.href = "/");
        } else {
          alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }
      })
      .catch((error) => {
        console.error("Error al procesar la solicitud:", error);
        alert("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
      });
  });
}
form();
