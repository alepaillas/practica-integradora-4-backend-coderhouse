import { Router } from "express";
import usersControllers from "../controllers/users.controllers.mjs";
import productsControllers from "../controllers/products.controllers.mjs";
import {
  authorization,
  passportCall,
} from "../middlewares/passport.middleware.mjs";

const router = Router();

router.post(
  "/users",
  passportCall("jwt"),
  authorization(["admin"]),
  usersControllers.createMockUsers,
);

router.post(
  "/products",
  passportCall("jwt"),
  authorization(["admin"]),
  productsControllers.createMockProducts, // Add the new route
);

export default router;
