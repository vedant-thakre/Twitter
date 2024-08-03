import express from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, logoutUser } from "../controllers/userController.js";
import { generateRefreshAndAccessToken } from "../utils/tokenGenerate.js";

const router = express.Router();

// router.route("/register").post(registerUser);
router.post(
  "/register",
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.post("/login", loginUser);

// secured route
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", generateRefreshAndAccessToken);
router.post("/change-password", verifyJwt, changePassword);
router.get("/profile", verifyJwt, getUserDetails);
router.patch("/edit-profile", verifyJwt, editUserDetails);
router.patch("/edit-avatar", verifyJwt, upload.single("avatar"), updateAvatar);
// router.patch(
//   "/edit-cover-image",
  verifyJwt,
  upload.single("coverImage"),
//   updateCoverImage
// );
// router.get("/channel/:username", verifyJwt, getUserChannelProfile);
// router.get("/history", verifyJwt, getUserWatchHistory);

// dev routes.
// router.get("/dev/test/getalluser", getAllUsers);

export default router;
