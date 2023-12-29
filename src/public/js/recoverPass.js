const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("user").value;
  try {
    const response = await fetch(`http://localhost:8080/pass-recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.message) {
        alert(data.message);
        window.location.href = "/login"; 
      }
      
    } else {
      alert("Error al enviar el email. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    alert("Error inesperado. Por favor, inténtalo de nuevo.");
  }
});
