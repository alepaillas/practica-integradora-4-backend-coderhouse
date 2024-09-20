import { Router } from "express";
import usersControllers from "../controllers/users.controllers.mjs";

const router = Router();

router.post("/premium/:uid", usersControllers.changeUserRole);

export default router;
