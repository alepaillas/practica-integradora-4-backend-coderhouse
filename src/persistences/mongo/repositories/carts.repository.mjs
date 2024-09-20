import { cartModel } from "../models/cart.model.mjs";
import { productModel } from "../models/product.model.mjs";

const getAll = async () => {
  const carts = await cartModel.find();
  return carts;
};

const getById = async (cid) => {
  const cart = await cartModel.findOne({ _id: cid });
  return cart;
};

const create = async (data) => {
  const cart = await cartModel.create(data);
  return cart;
};

const deleteOne = async (cid) => {
  const cart = await cartModel.deleteOne({ _id: cid });
  if (cart.deletedCount === 0) return false;
  return true;
};

const addProduct = async (cid, pid, quantity = 1) => {
  const product = await productModel.findOne({ _id: pid });
  if (!product) return { product: false };
  const cart = await cartModel.findOne({ _id: cid });
  if (!cart) return { cart: false };

  const productInCart = await cartModel.findOneAndUpdate(
    { _id: cid, "products.product": pid },
    { $inc: { "products.$.quantity": quantity } },
  );

  if (!productInCart) {
    await cartModel.findOneAndUpdate(
      { _id: cid },
      { $push: { products: { product: pid, quantity } } },
    );
  }

  const cartUpdate = await cartModel.findOne({ _id: cid });
  return cartUpdate;
};

const deleteProduct = async (cid, pid) => {
  // Check if cart exists
  const cart = await cartModel.findOne({ _id: cid });
  if (!cart) return { cart: false };

  // Check if product exists in the cart
  const productInCart = cart.products.find(
    (p) => p.product._id.toString() === pid,
  );
  if (!productInCart) return { product: false };

  // Remove product from cart
  const updatedCart = await cartModel.findOneAndUpdate(
    { _id: cid },
    { $pull: { products: { product: pid } } },
    { new: true }, // Return the updated cart
  );

  return updatedCart;
};

const deleteProducts = async (cartId, productIds) => {
  try {
    const cart = await cartModel
      .findByIdAndUpdate(
        cartId,
        {
          $pull: { products: { product: { $in: productIds } } },
        },
        { new: true }, // Ensure the updated document is returned
      )
      .populate("products.product");

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  } catch (error) {
    throw error;
  }
};

const updateProductQuantity = async (cid, pid, newQuantity) => {
  // Check if cart exists
  const cart = await cartModel.findOne({ _id: cid });
  if (!cart) return { cart: false };

  // Check if product exists in the cart
  const productInCart = cart.products.find(
    (p) => p.product._id.toString() === pid,
  );
  if (!productInCart) return { product: false };

  // Update quantity (no negative quantity handling)
  const updatedCart = await cartModel.findOneAndUpdate(
    { _id: cid, "products.product": pid },
    { $set: { "products.$.quantity": newQuantity } },
    { new: true }, // Return the updated cart
  );
  return updatedCart;
};

const clear = async (cid) => {
  const cart = await cartModel.findOne({ _id: cid });
  if (!cart) return {};
  const cartEmpty = await cartModel.findOneAndUpdate(
    { _id: cid },
    { $set: { products: [] } },
    { new: true },
  );
  return cartEmpty;
};

// no funciona
// mongo me devuleve esto
// lo vimos en el after pero lo dejamos pendiente para otra entrega
// porque el profesor tampoco lo pudo resolver
/* {
  "status": "success",
  "payload": {
    "acknowledged": true,
    "modifiedCount": 0,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  }
} */
const update = async (cid, data) => {
  const cart = await cartModel.updateOne(
    { _id: cid },
    { $set: { products: data } },
    { new: true },
  );
  return cart;
};

export default {
  getAll,
  getById,
  create,
  deleteOne,
  deleteProducts,
  addProduct,
  deleteProduct,
  updateProductQuantity,
  clear,
  update,
};
