const uid = localStorage.getItem("uid");
const ul = document.getElementById("cartItems");
let total = 0;
const cartTotal = document.getElementById("cartTotal");

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

      button.addEventListener("click", () => {
        const pid = element.pid._id; // Obtén el _id del elemento actual
        fetch(`http://localhost:8080/api/cart/${data[0]._id}/product/${pid}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
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
