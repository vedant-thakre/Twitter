import { User } from "../models/userModel.js";
import { ErrorHandler } from "./errorHandler.js";

export const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    console.log("Error : ", error);
    throw new ErrorHandler(500, "Error in generating the Tokens");
  }
};
// export const generateRefreshAndAccessToken = async (userId) => {
//     try {
//         const user = await User.findById(userId);
//         const accessToken =  user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         user.refreshToken = refreshToken;

//         await user.save({ validateBeforeSave: false });

//         return { refreshToken, accessToken };
//     } catch (error) {
//         console.log("Error : ", error)
//         throw new ErrorHandler(500, "Error in generating the Tokens");
//     }
// }
