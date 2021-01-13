import { Router } from "express"
import authJwt from "../middlewares/auth-jwt";
import checkBodyParams from "../middlewares/check-body-params";
import controller from "../controllers/comment";
import multer from "multer";

const router = Router();

const createCommentParams = ["post", "body"]
router.post("/createComment", authJwt.verifyToken, multer().none(), checkBodyParams(...createCommentParams), controller.createComment);

router.route("/:commentId")
    .all(authJwt.verifyToken)
    .delete(controller.deleteComment);

export default router;