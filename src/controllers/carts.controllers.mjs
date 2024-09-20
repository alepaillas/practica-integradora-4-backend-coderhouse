import customErrors from "../errors/customErrors.mjs";
import cartsServices from "../services/carts.services.mjs";
import productsServices from "../services/products.services.mjs";
import ticketServices from "../services/tickets.services.mjs";

// devuelve todos los carritos
const getAll = async (req, res, next) => {
  try {
    const carts = await cartsServices.getAll();
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    next(error);
  }
};

// devuelve el carrito por id
const getById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getById(cid);
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// crea un nuevo carrito
const create = async (req, res, next) => {
  try {
    const cart = await cartsServices.create();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// agrega un producto al carrito
const addProduct = async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartsServices.addProduct(cartId, productId, req.user);
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// elimina del carrito el producto seleccionado
const deleteProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.deleteProduct(cid, pid);
    res.status(201).json({
      status: "success",
      msg: `Product with id: ${pid} deleted from cart.`,
    });
  } catch (error) {
    next(error);
  }
};

// actualiza la cantidad de ejemplares del producto en el carrito
const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const newQuantity = req.body.quantity;

    // Validation: Check if newQuantity is provided and positive
    if (!newQuantity || newQuantity <= 0) {
      throw customErrors.badRequestError("Positive quantity required.");
    }

    const updatedCart = await cartsServices.updateProductQuantity(
      cid,
      pid,
      newQuantity,
    );
    res.status(201).json({ status: "success", payload: updatedCart });
  } catch (error) {
    next(error);
  }
};

// elimina todos los productos del carrito
const clear = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getById(cid);
    const clearedCart = await cartsServices.clear(cid);
    res.status(200).json({ status: "success", payload: clearedCart });
  } catch (error) {
    next(error);
  }
};

// se podria optimizar mucho aqui haciendo 1 sola llamada a la base de datos
// sin embargo, es más "limpio" separar los servicios
const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const email = req.user.email;
    const { removeOutOfStock = false } = req.body || {};

    const cart = await cartsServices.getById(cid);

    // Check product stock and optionally remove out-of-stock items
    const { productsNotInStock, updatedCart } =
      await cartsServices.handleCartStock(cid, removeOutOfStock);

    // Check for an empty cart after potential removal
    if (updatedCart && updatedCart.products.length === 0) {
      throw customErrors.badRequestError("No products in stock in the cart.");
    }

    const total = await cartsServices.getCartTotal(
      updatedCart ? updatedCart._id.toString() : cid,
    );

    /*
    La razón para usar la sintaxis updatedCart ? updatedCart._id.toString() : cid
    es para manejar el caso en el que updatedCart podría ser null o undefined.
    Esto asegura que se pase el ID correcto al método getCartTotal en ambos escenarios:

    Si updatedCart existe: Se pasa el ID de updatedCart.
    Si updatedCart no existe: Se pasa el ID original del carrito (cid).

    Esto es necesario porque updatedCart solo estará definido si removeOutOfStock es true
    y productos fuera de stock fueron removidos del carrito. Si updatedCart no está definido,
    significa que el carrito original no fue modificado y se debe usar su ID.
    */

    // Create the ticket
    const ticket = await ticketServices.createTicket(
      email,
      total,
      updatedCart ? updatedCart._id.toString() : cid,
    );

    // Update product stock
    const productsInCart = updatedCart ? updatedCart.products : cart.products;
    for (const item of productsInCart) {
      const product = item.product;
      const updatedStock = product.stock - item.quantity;
      await productsServices.update(product._id.toString(), {
        stock: updatedStock,
      });
    }

    res.status(200).json({
      status: "success",
      payload: ticket,
      updatedCart,
      productsNotInStock,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  create,
  addProduct,
  deleteProduct,
  updateProductQuantity,
  clear,
  purchaseCart,
};
