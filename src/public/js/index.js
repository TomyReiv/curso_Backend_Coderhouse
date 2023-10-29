(function () {
  const socket = io();

  const openDialogButton = document.getElementById("open-dialog-button");
  const closeDialogButton = document.getElementById("close-dialog-button");
  const dialog = document.getElementById("dialog");
  const logMessage = document.getElementById("logMessage");
  const username = localStorage.getItem("user");
  const formDialog = document.getElementById("formDialog");

  const form = document.getElementById("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    const product = {
      title: title,
      description: description,
      price: parseFloat(price),
      code: code,
      status: "active",
      stock: parseFloat(stock),
      category: category,
    };

    const productJSON = JSON.stringify(product);

    socket.emit("new-product", productJSON);
    form.reset();

    fetchProduct();

  }); //form global


  function updateLogMessage(messages) {
    logMessage.innerText = "";
    messages.forEach((msg) => {
      const p = document.createElement("p");
      p.innerText = `${msg.username}: ${msg.message}`;
      logMessage.appendChild(p);
    });
  }

  openDialogButton.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.classList.remove("hidden");
  });
  closeDialogButton.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.classList.add("hidden");
  });

  formDialog.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("message").value;
    socket.emit("new-message", { username, message });
    formDialog.reset();
  });

  socket.on("notification", ({ messages }) => {
    updateLogMessage(messages);
  });
})();

function fetchProduct() {
  fetch("http://localhost:8080/api/products")
    .then((response) => response.json())
    .then((data) => {
      const productList = document.getElementById("productList");
      productList.innerHTML = "";
      data.forEach((product, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Producto ${index + 1}: ${
          product.title
        }, Precio: ${product.price}`;
        productList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });
}
fetchProduct();
