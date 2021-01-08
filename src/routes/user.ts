import { Router } from "express"
import authJwt from "../middlewares/auth-jwt";
import controller from "../controllers/user";
const router = Router();

router.get("/getInfo/:id", controller.getInfo);
router.post("/updateInfo", authJwt.verifyToken, controller.updateInfo);

export default router;