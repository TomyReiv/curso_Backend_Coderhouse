const uid = localStorage.getItem("uid");

if (!uid) window.location.href = "/login";

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

fetch(`http://localhost:8080/api/products/${id}`)
  .then((response) => response.json())
  .then((data) => {
    
    title.value = data.title;
    description.value = data.description;
    price.value = data.price;
    code.value = data.code;
    stock.value = data.stock;
    category.value = data.category;
    img.src = `../img/${data.thumbnail[0].filename}`;
})
  .catch((error)=>{
     console.log(error);
  });