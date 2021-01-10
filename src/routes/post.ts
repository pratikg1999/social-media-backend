import { Router } from "express"
import multer from "multer";
import path from "path";
import authJwt from "../middlewares/auth-jwt";
import controller from "../controllers/post";
import checkBodyParams from "../middlewares/check-body-params";

const router = Router();
const storage = multer.diskStorage({
    destination: "public/postImages",
    filename: function (request, file, cb) {
        cb(null, (request.userId as string) + Date.now() + path.extname(file.originalname));
    }
});
const postImageUpload = multer({ storage: storage });

router.post("/createPost", authJwt.verifyToken, postImageUpload.single('image'), controller.createPost);
router.get("/fetchPosts", authJwt.verifyToken,  controller.fetchPosts);

router.route("/likes")
    .all(authJwt.verifyToken)
    .put(checkBodyParams(...controller.putLikeParams), controller.putLike)
    .delete(checkBodyParams(...controller.deleteLikeParams), controller.deleteLike);

export default router;