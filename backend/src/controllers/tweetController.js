export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [email, username, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ErrorHandler(400, "All fileds are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ErrorHandler(409, "User with email or username already exists");
  }
  //   console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ErrorHandler(400, "Avatar file is required");
  }

  const avatar = await uploadFile(avatarLocalPath);
  const coverImage = await uploadFile(coverImageLocalPath);

  if (!avatar) {
    throw new ErrorHandler(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ErrorHandler(
      500,
      "Something went wrong while registering the user"
    );
  }

  return res
    .status(201)
    .json(new Response(200, createdUser, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email)
    throw new ErrorHandler(400, "Username or Email is Required");

  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!findUser) throw new ErrorHandler(404, "User not Found");

  const isMatch = await findUser.isPasswordCorrect(password);

  if (!isMatch) throw new ErrorHandler(404, "Incorrect Password");

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    findUser._id
  );

  // console.log("Tokens", refreshToken, accessToken);

  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken "
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Response(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Login Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Response(200, {}, "User Logged Out"));
});

/*

avg = 3.00
most = 3.78
best = 2.54
*/
