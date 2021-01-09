import { Router } from "express"
import multer from "multer";
import path from "path";
import authJwt from "../middlewares/auth-jwt";
import controller from "../controllers/post";

const router = Router();
const storage = multer.diskStorage({
    destination: "public/postImages",
    filename: function (request, file, cb) {
        cb(null, request.userId+ Date() + path.extname(file.originalname));
    }
});
const postImageUpload = multer({ storage: storage });

router.post("/createPost", authJwt.verifyToken, postImageUpload.single('image'), controller.createPost);

export default router;