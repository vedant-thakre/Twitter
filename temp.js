import { useEffect, useState } from "react";
// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
// Images
import curved6 from "assets/images/curved-images/signin.png";
import { batch, useDispatch } from "react-redux";
import { signupAction } from "store/actions/actions";
import { useSelector } from "react-redux";
import { clearMessage } from "store/actions/actions";
import SoftSnackbar from "components/SoftSnackbar";
import SoftSelect from "components/SoftSelect";
import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import { SET_EMAIL } from "store/actions/actions";
import LoadingButton from "common/LoadingButton";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function Basic() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saveLoading = useSelector((state) => state.auth.signinFormSaveLoading);
  const successMessage = useSelector((state) => state.auth.successMessage);
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const closeErrorSB = () => {
    dispatch(clearMessage());
  };
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [register, setRegister] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile_no: "",
    referralCode: "",
    userType: "outsidePractitioner",
  });
  const { firstName, lastName, email, password, mobile_no, referralCode } =
    register;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    let trimmedValue = value.trim();

    if (name === "firstName") {
      if (/^[a-zA-Z]{3,25}$/.test(trimmedValue)) {
        setFirstNameError("");
      } else {
        setFirstNameError(
          "First name must contain only letters and be between 3 and 25 characters"
        );
      }
    } else if (name === "lastName") {
      if (/^[a-zA-Z]{3,25}$/.test(trimmedValue)) {
        setLastNameError("");
      } else {
        setLastNameError(
          "Last name must contain only letters and be between 3 and 25 characters"
        );
      }
    }
    setRegister({ ...register, [name]: trimmedValue });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (successMessage === "SignUp Successfully") {
      console.log(email);
      navigate("/emailVerification");
    }
  }, [successMessage]);

  const validatePassword = () => {
    // Minimum 6 characters
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    // At least one special character
    const specialCharsRegex = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
    if (!specialCharsRegex.test(password)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    // At least two numbers
    const numbersRegex = /\d/g;
    const numbersCount = (password.match(numbersRegex) || []).length;
    if (numbersCount < 1) {
      setPasswordError(
        "Password must contain at least 1 number (2 are recommended)"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignUp = () => {
    const isValidPassword = validatePassword();

    if (isValidPassword) {
      dispatch(SET_EMAIL(email));
      dispatch(signupAction(register));
    }
  };
  return (
    <BasicLayout
      title="Welcome To Umbra"
      description="Please register below"
      image={curved6}
    >
      <Card style={{ marginTop: "-40px" }}>
        <SoftBox p={2.5} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register your clinic
          </SoftTypography>
        </SoftBox>

        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            {/* <SoftBox mb={2}>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
              >
                please select one
              </SoftTypography>
              <SoftSelect
                placeholder="Please select userType"
                onChange={(e) => setRegister({ ...register, ["userType"]: e.value })}
                options={selectData?.UserType}
                isSearchable={false}
              />
            </SoftBox> */}
            <SoftBox mb={2}>
              <SoftInput
                type="text"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={onInputChange}
                error={firstNameError !== ""}
                helperText={firstNameError}
              />
              {firstNameError && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {firstNameError}
                </span>
              )}
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={onInputChange}
                error={lastNameError !== ""}
                helperText={lastNameError}
              />
              {lastNameError && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {lastNameError}
                </span>
              )}
            </SoftBox>
            <SoftBox mb={2}>
              <PhoneInput
                className="stylet"
                name="mobile_no"
                placeholder="Phone number"
                value={mobile_no}
                onChange={(value) =>
                  setRegister({ ...register, ["mobile_no"]: value })
                }
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onInputChange}
              />
            </SoftBox>
            <SoftBox mb={2}>
              {/* <SoftInput
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onInputChange}
                error={passwordError !== ""}
                helperText={passwordError}
              /> */}
              <SoftInput
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={onInputChange}
                icon={{
                  component: passwordVisible ? (
                    <MdVisibilityOff
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <MdVisibility
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  ),
                  direction: "right",
                }}
                error={passwordError !== ""}
                helperText={passwordError}
              />
              {passwordError && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {passwordError}
                </span>
              )}
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="text"
                placeholder="Referral Code (Optional)"
                name="referralCode"
                value={referralCode}
                onChange={onInputChange}
              />
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <LoadingButton
                title={"SIGN UP"}
                variant="gradient"
                color="dark"
                sx={{ width: "100%" }}
                onClick={handleSignUp}
                loading={saveLoading}
              />
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography
                variant="button"
                color="text"
                fontWeight="regular"
              >
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>

      <SoftSnackbar
        color={successMessage !== "" ? "success" : "error"}
        icon="star"
        title="Buser Institute"
        content={errorMessage || successMessage}
        open={errorMessage !== "" || successMessage !== "" ? true : false}
        onClose={closeErrorSB}
        close={closeErrorSB}
        bgWhite
      />
    </BasicLayout>
  );
}

export default Basic;

 .max(100, address1.invalidMsg)

    date_measurements: Yup.string(),


    signupAction

    bca
    info disabled
    schema