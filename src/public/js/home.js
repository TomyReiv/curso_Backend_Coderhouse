const uid = localStorage.getItem("uid");

if (!uid) window.location.href = "/login";

function fetchProduct() {
  const page = document.getElementById("currentPage");
  let pageNumber = parseInt(page.innerHTML, 10);

  function loadPage(pageNumber) {
    fetch(`http://localhost:8080/api/products?limit=6&page=${pageNumber}`)
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

         const cardButton = document.createElement("div");
          cardButton.classList.add("button-card"); 

          const img = document.createElement("img");
          img.src = `./img/${product.thumbnail[0].filename}`;
          img.addEventListener("click", () => {
            window.location.href = `/producto/${product._id}`;
          });

          const productName = document.createElement("h2");
          productName.textContent = product.title;

          const productPrice = document.createElement("p");
          productPrice.textContent = `Precio: ${product.price}`;

          const productDescription = document.createElement("p");
          productDescription.textContent = product.description;

          card.appendChild(img);



          const editButton = document.createElement("button");
          editButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag-check" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>';
          editButton.addEventListener("click", () => {
            const cartProductData = {
              pid: product._id,
              quantity: 1,
            };
            const cartData = {
              userId: uid,
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
                  console.log(data.message);
                  alert('Producto cargado exitosamente')
                })
                .catch((error) => {
                  console.log('Error' ,error);
                });
            } catch (error) {
              console.log(error);
            }
          });


          card.appendChild(productName);
          card.appendChild(productPrice);
          card.appendChild(productDescription);
          card.appendChild(cardButton);
          cardButton.appendChild(editButton);


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
