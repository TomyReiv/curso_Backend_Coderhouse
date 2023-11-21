const uid = localStorage.getItem("uid").trim();

/* if (!uid) window.location.href = "/login"; */

const url = window.location.href;

const parts = url.split("/");

const id = parts[parts.length - 1];
const contenedor = document.getElementById("contenedor");

fetch(`http://localhost:8080/api/products/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const img = document.createElement("img");
    img.src = `../img/${data.thumbnail[0].filename}`;

    const productName = document.createElement("h2");
    productName.textContent = data.title;

    const productPrice = document.createElement("p");
    productPrice.textContent = `Precio: ${data.price}`;

    const productDescription = document.createElement("p");
    productDescription.textContent = data.description;

    contenedor.appendChild(img);
    contenedor.appendChild(productName);
    contenedor.appendChild(productPrice);
    contenedor.appendChild(productDescription);
  });

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = document.getElementById("valor").value;

  const cartProductData = {
    pid: id.trim(),
    quantity: parseInt(value, 10),
  };

  const cartData = {
    userId: uid.trim(),
    items: [cartProductData],
  };

try {
  fetch("http://localhost:8080/api/cart", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Producto cargado exitosamente')
    })
    .catch((error) => {
      console.log('Error' ,error);
    });
} catch (error) {
  console.log(error);
}
  form.reset()
})
.catch((error)=>{
  console.log(error);
})

const home = document.getElementById('home')
home.addEventListener('click', ()=>{
  window.location.href='/';
})

const logout = document.getElementById('logout').addEventListener('click', ()=>{
  localStorage.removeItem('uid');
  localStorage.removeItem('user');
})