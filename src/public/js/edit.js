const uid = localStorage.getItem("uid");

/* if (!uid) window.location.href = "/login"; */

const url = window.location.href;

const parts = url.split("/");

const id = parts[parts.length - 1];

const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const img = document.getElementById("img");
let pid;

fetch(`http://localhost:8080/api/products/${id}`)
  .then((response) => response.json())
  .then((data) => {
    pid = data._id;

    title.value = data.title;
    description.value = data.description;
    price.value = data.price;
    code.value = data.code;
    stock.value = data.stock;
    category.value = data.category;
    img.src = `../img/${data.thumbnail[0].filename}`;
  })
  .catch((error) => {
    console.log(error);
  });

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  const formData = new FormData();

  const editData = {
    title: title.value,
    description: description.value,
    price: parseInt(price.value),
    code: code.value,
    stock: stock.value,
    category: category.value,
   /*  image: [{ filename: file }], */
  };
console.log(JSON.stringify(editData));
  fetch(`http://localhost:8080/api/products/${pid}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) alert(data.message);
      window.location.href = "/realTimeProducts";
    })
    .catch((error) => {
      console.error("Error al procesar la solicitud:", error);
    });
});
