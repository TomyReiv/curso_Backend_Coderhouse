(function () {
  const uid = localStorage.getItem("uid");

  const newMessages = document.getElementById("newMessages");
  const username = localStorage.getItem("user");


  const form = document.getElementById("form");


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
        if (data.title) alert("Producto creado exitosamente");
        location.reload();
      })
      .catch((error) => {
        console.error("Error al procesar la solicitud:", error);
      });


    form.reset();
  }); //form global

})(); //Fin de la funcion global

function fetchProduct() {
  const page = document.getElementById("currentPage");
  let pageNumber = parseInt(page.innerHTML, 10);

  function loadPage(pageNumber) {
    fetch(`http://localhost:8080/api/products?page=${pageNumber}&limit=6`)
      .then((response) => response.json())
      .then((data) => {
        const productList = document.getElementById("productList");
        const imgCont = document.getElementById("cart-list");
        productList.innerHTML = "";
        page.innerHTML = "";

        page.textContent = data.page;

        if (data.nextPage) {
          const nextButton = document.getElementById("next-but");
          nextButton.addEventListener("click", () => {
            pageNumber = data.nextPage;
            loadPage(pageNumber);
          });
        }

        if (data.prevPage) {
          const prevButton = document.getElementById("prev-but");
          prevButton.addEventListener("click", () => {
            pageNumber = data.prevPage;
            loadPage(pageNumber);
          });
        }

        data.payload.forEach((product, index) => {
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
            window.location.href = `/edit/${product._id}`;
          });

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Eliminar";
          deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:8080/api/products/${product._id}`, {
              method: "DELETE",
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                alert("Producto eliminado");
                fetchProduct();
              })
              .catch((error) => {
                console.error("Error al procesar la solicitud:", error);
              });
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
  loadPage(pageNumber);
} // Fin del fecth para traer productos

fetchProduct();

const logout = document.getElementById('logout').addEventListener('click', ()=>{
  localStorage.removeItem('uid');
  localStorage.removeItem('user');
})