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

  fetch("http://localhost:8080/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
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
        window.location.href = "/";
        form.reset();
      }
    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });

  
});
