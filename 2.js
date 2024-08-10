/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://material-ui.com/store/items/soft-ui-pro-dashboard/
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import { useDispatch, useSelector } from "react-redux";

import { axiosInstance } from "services/AxiosInstance";

import { SUCCESS, findOneUserAction } from "store/actions/actions";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";

function ReferralCode() {
  const { secondary } = colors;
  const { borderWidth } = borders;
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.auth?.idToken);
  const UserId = useSelector((state) => state.auth.auth._id);
  const [isCopied, setIsCopied] = useState(false);

  const OwnerRefferalCode = useSelector((state) =>
    state?.auth?.auth?.userdata?.Referralcode
      ? state?.auth?.auth?.userdata?.Referralcode
      : null
  );

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const generateCode = async () => {
    const res = await axiosInstance.get(`auth/ownerGenerateReferralCode`, {
      headers: {
        authorization: token,
      },
    });
    console.log(res, "pres");
    if (res?.status === 200) {
      dispatch(findOneUserAction({ userId: UserId, token }));
    }
    dispatch(SUCCESS(res?.data?.data.message));
  };

  return (
    <>
      <SoftBox lineHeight={1}>
        <SoftTypography variant="h5" fontWeight="medium">
          Referral Code
        </SoftTypography>
        <SoftTypography variant="body2" fontWeight="regular" color="text">
          Copy the code bellow to your registered provider.
        </SoftTypography>
      </SoftBox>
      <SoftBox
        borderRadius="md"
        border={`${borderWidth[1]} dashed ${secondary.main}`}
        pt={2}
        pb={1.5}
        px={2}
        mt={2}
      >
        <SoftBox display="flex" alignItems="center" mb={2}>
          <SoftBox width="70%" mr={1}>
            <SoftInput
              size="small"
              defaultValue={
                OwnerRefferalCode ? OwnerRefferalCode : "generate-code"
              }
              // icon={{ component: "lock", direction: "right" }}
              disabled
            />
          </SoftBox>
          <CopyToClipboard
            text={OwnerRefferalCode}
            onCopy={onCopyText}
            className="Copy"
          >
            <SoftButton
              variant={OwnerRefferalCode ? "outlined" : "gradient"}
              size="small"
              onClick={() => {
                if (!OwnerRefferalCode) {
                  generateCode();
                }
              }}
              color={OwnerRefferalCode ? "secondary" : "dark"}
              sx={{ padding: "0.5rem 1rem" }}
            >
              {OwnerRefferalCode ? (isCopied ? "Copied" : "Copy") : "Generate"}
            </SoftButton>
          </CopyToClipboard>
        </SoftBox>
        <SoftBox mb={0.5} lineHeight={1.2}>
          <SoftTypography component="p" variant="body2" color="text">
            {OwnerRefferalCode
              ? "Click on the copy to copy your referral code and share with other clinics."
              : " You don`t have referral code click on generate to generate your referral code."}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default ReferralCode;
