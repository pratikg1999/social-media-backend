import { Router } from "express"
import multer from "multer";
import authJwt from "../middlewares/auth-jwt";
import controller from "../controllers/user";
import checkBodyParams from "../middlewares/check-body-params";
import path from "path";

const router = Router();
const storage = multer.diskStorage({
    destination: "public/profileImages",
    filename: function (request, file, cb) {
        cb(null, request.userId + path.extname(file.originalname));
    }
});
const profileUpload = multer({ storage: storage });


router.get("/getInfo/:id", authJwt.verifyToken, controller.getInfo);
router.post("/updateInfo", authJwt.verifyToken, profileUpload.single('profileImage'), controller.updateInfo);
router.get("/getCurrentUserInfo", authJwt.verifyToken, controller.getCurrentUserInfo);
router.route("/following")
    .all(authJwt.verifyToken)
    .get(controller.getFollowings)
    .delete(checkBodyParams(...controller.deleteFollowingParams), controller.deleteFollowing)
    .put(checkBodyParams(...controller.putFollowingParams), controller.putFollowing);
    
router.route("/followers")
    .all(authJwt.verifyToken)
    .get(controller.getFollowers);

router.route('/')
    .get(controller.getUsers);

export default router;