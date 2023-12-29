

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const lastname = document.getElementById("lastname").value;
  const password = document.getElementById("password").value;
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;
  const street = document.getElementById("street").value;

  const data = {
    username,
    lastname,
    password,
    email,
    address: {
      city,
      country,
      street,
    },
  }; 

  fetch("http://localhost:8080/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.status != 200) {
        alert("Error en el registro o usuario existente.");
        throw new Error(`Error de red: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.errors && data.errors.length > 0) {
        const firstError = data.errors[0];
        alert(`Error in ${firstError.location}: ${firstError.msg}`);
      }

      if (data.message) {
        alert(data.message);
        localStorage.setItem("user", username);
        localStorage.setItem("uid", data._id);

        fetch(`http://localhost:8080/activacion`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error de red: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          });

        window.location.href = "/login";
        form.reset();
      }
    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });
});
