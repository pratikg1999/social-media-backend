import { Router } from "express"
import multer from "multer";
import authJwt from "../middlewares/auth-jwt";
import controller from "../controllers/user";
import path from "path";

const router = Router();
const storage = multer.diskStorage({
    destination: "public/profileImages",
    filename: function(request, file, cb){
        cb(null, request.userId + path.extname(file.originalname));
    }
});
const profileUpload = multer({storage: storage});

router.get("/getInfo/:id", controller.getInfo);
router.post("/updateInfo", authJwt.verifyToken, profileUpload.single('profileImage') ,controller.updateInfo);
router.get("/getCurrentUserInfo", authJwt.verifyToken, controller.getCurrentUserInfo);

export default router;