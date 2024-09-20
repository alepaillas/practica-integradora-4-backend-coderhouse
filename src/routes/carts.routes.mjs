import { Router } from "express";
import cartsControllers from "../controllers/carts.controllers.mjs";
import {
  authorization,
  passportCall,
} from "../middlewares/passport.middleware.mjs";

const router = Router();

// devuelve todos los carritos
router.get(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  cartsControllers.getAll,
);

// devuelve el carrito por id
router.get(
  "/:cid",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.getById,
);

// crea un nuevo carrito
router.post(
  "/",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.create,
);

// agrega un producto al carrito
router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.addProduct,
);

// elimina todos los productos del carrito
router.delete(
  "/:cid",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.clear,
);

// elimina del carrito el producto seleccionado
router.delete(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.deleteProduct,
);

// actualiza la cantidad de ejemplares del producto en el carrito
router.put(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.updateProductQuantity,
);

router.get(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  cartsControllers.purchaseCart,
);

export default router;
