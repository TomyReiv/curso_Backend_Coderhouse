const username = document.getElementById("username");
const lastname = document.getElementById("lastname");
const password = document.getElementById("password");
const email = document.getElementById("email");
const city = document.getElementById("city");
const country = document.getElementById("country");
const street = document.getElementById("street");

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    username: username.value,
    lastname: lastname.value,
    password: password.value,
    email: email.value,
    address: {
      city: city.value,
      country: country.value,
      street: street.value,
    },
  };
  console.log(JSON.stringify(data));
  fetch("http://localhost:8080/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.username) {
        alert("Usuario creado");
        localStorage.setItem("user", username);
        localStorage.setItem("uid", data._id);
        window.location.href = "/";
      }
    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });

  form.reset();
});
