export const generatorProductError = (product) => {
  return `Todos los campos son obligatorios y deben ser validos.
    Listado de campos recibidos en la solicitud:
     - title: ${product.title}
     - description: ${product.description}
     - price: ${product.price}
     - code: ${product.code}
     - stock: ${product.stock}
     - category: ${product.category}
    `;
};
