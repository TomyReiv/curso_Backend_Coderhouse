(function () {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    window.location.href = "/login";
  }

  const socket = io();

  const openDialogButton = document.getElementById("open-dialog-button");
  const closeDialogButton = document.getElementById("close-dialog-button");
  const dialog = document.getElementById("dialog");
  const newMessages = document.getElementById("newMessages");
  const username = localStorage.getItem("user");
  const formDialog = document.getElementById("formDialog");
  const exit = document.getElementById("exit");
  const form = document.getElementById("form");

  exit.addEventListener("click", () => {
    localStorage.removeItem("user"), localStorage.removeItem("uid");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("code", code);
    formData.append("stock", stock);
    formData.append("category", category);

    // Obtén el archivo seleccionado
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (file) {
      formData.append("file", file);
    }

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.title) alert('Producto creado exitosamente');
      })
      .catch((error) => {
        console.error("Error al procesar la solicitud:", error);
      });

    form.reset();

    fetchProduct();
  }); //form global

  function updateLogMessage(messages) {
    newMessages.innerText = "";
    const messagesSlice = messages.slice(-4);
    messagesSlice.forEach((msg) => {
      const p = document.createElement("p");
      p.innerText = `${msg.username}: ${msg.message}`;
      newMessages.appendChild(p);
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

  socket.on("notification", ({ messagesGlobal }) => {
    updateLogMessage(messagesGlobal);
  });
})();

function fetchProduct() {
  fetch("http://localhost:8080/api/products")
    .then((response) => response.json())
    .then((data) => {
      const productList = document.getElementById("productList");
      const imgCont = document.getElementById('cart-list')
      productList.innerHTML = "";
     /*  data.forEach((product, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Producto ${index + 1}: ${product.title}, Precio: ${product.price}`;
      
        const imgList = document.createElement('img');
        imgList.src = `./img/${product.thumbnail[0].filename}`;
      
        imgList.style.width = "100px";
      
        imgCont.appendChild(imgList);
        productList.appendChild(listItem);
      }); */


      data.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
      
        const img = document.createElement("img");
        img.src = `./img/${product.thumbnail[0].filename}`;
      
        const productName = document.createElement("h2");
        productName.textContent = product.title;
      
        const productPrice = document.createElement("p");
        productPrice.textContent = `Precio: ${product.price}`;
      
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
      
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => {
          console.log('editado');
        });
      
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => {
          console.log('eliminado');
        });
      
        card.appendChild(img);
        card.appendChild(productName);
        card.appendChild(productPrice);
        card.appendChild(productDescription);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
      
        document.getElementById("productList").appendChild(card);
      });

    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });
}
fetchProduct();

function fetchMessage() {
  const logMessage = document.getElementById("logMessage");
  fetch("http://localhost:8080/api/message")
    .then((response) => response.json())
    .then((messages) => {
      logMessage.innerText = "";
      const msgSlice = messages.slice(-2);
      msgSlice.forEach((msg) => {
        const p = document.createElement("p");
        p.innerText = `${msg.username}: ${msg.message}`;
        logMessage.appendChild(p);
      });
    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });
}
fetchMessage();
