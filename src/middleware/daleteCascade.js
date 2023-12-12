import cartModel from "../models/cart.model.js";
import cartController from "../controllers/cart.controller.js";

export const deleteProductCart = async (req, res, next) => {
  const pid = req.params.pid;
  try {
    const carts = await cartController.get({ "items.pid": pid });

    for (const cart of carts) {
      const updatedItems = cart.items.filter(
        (item) => item.pid.toString() !== pid
      );
      const result = await cartController.findByIdAndUpdate(
        cart._id,
        { $set: { items: updatedItems } },
        { new: true }
      );
      console.log(result);
    }
    console.log(`Producto con pid ${pid} eliminado de todos los carritos`);
    next();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

export const deleteCartUser = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const carts = await cartController.deleteOne({ userId: uid });
    next();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};
