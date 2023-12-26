const uid = localStorage.getItem("uid");
const ul = document.getElementById("cartItems");
let total = 0;
let cid;
const cartTotal = document.getElementById("cartTotal");
const buy = document.getElementById("buy");
const spinner = document.getElementById('spinner');

fetch(`http://localhost:8080/api/cartUser`)
  .then((response) => response.json())
  .then((data) => {
    data[0].items.forEach((element) => {
      let li = document.createElement("li");
      let img = document.createElement("img");
      let button = document.createElement("span");
      img.src = `./img/${element.pid.thumbnail[0].filename}`;
      li.className += "list-group-item";
      li.textContent = `Name: ${element.pid.title} | Description: ${element.pid.description} | Quantity: ${element.quantity} | $${element.pid.price}`;
      button.id = "button";
      button.classList = "button";
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>';

      li.appendChild(button);
      ul.appendChild(li);
      ul.appendChild(img);

      cid = data[0]._id;

      button.addEventListener("click", () => {
        const pid = element.pid._id; // Obtén el _id del elemento actual
        fetch(`http://localhost:8080/api/cart/${cid}/product/${pid}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      });

      const subtotal = element.pid.price * element.quantity;
      // Agrega el subtotal al total
      total += subtotal;
      cartTotal.textContent = `$${total}`;
    });
  })
  .catch((error) => {
    console.log("Error", error);
  });

const home = document.getElementById("home");
home.addEventListener("click", () => {
  window.location.href = "/";
});
const logout = document
  .getElementById("logout")
  .addEventListener("click", () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
  });

buy.addEventListener("click", () => {
  buy.innerHTML = '';
  spinner.hidden = false;

  fetch(`http://localhost:8080/api/cart/${cid}/purchase`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
});
