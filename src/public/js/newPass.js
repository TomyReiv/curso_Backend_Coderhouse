const error = document.getElementById("error");
const form = document.getElementById("form");

const url = window.location.href;
const parts = url.split("/");
const uid = parts[parts.length - 1];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("rePassword").value;
  console.log(password);
  if (password !== rePassword) {
    alert("Las contraseñas deben coincidir");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/users/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.message) {
        alert(data.message);
        window.location.href = "/login"; 
      }
      
    } else {
      alert("Error al actualizar la contraseña. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    alert("Error inesperado. Por favor, inténtalo de nuevo.");
  }
});
