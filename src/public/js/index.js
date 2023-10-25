(function () {
  const socket = io();

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

    socket.emit('new-product', productJSON);
    form.reset();
    title.focus();
  });

  socket.on("products", (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Producto ${index + 1}: ${
        product.title
      }, Precio: ${product.price}`;
      productList.appendChild(listItem);
    });
  });
})();
