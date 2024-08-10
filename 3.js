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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import OutlinedCounterCard from "examples/Cards/CounterCards/OutlinedCounterCard";
import TransparentInfoCard from "examples/Cards/InfoCards/TransparentInfoCard";
import ComplexBackgroundCard from "examples/Cards/BackgroundCards/ComplexBackgroundCard";
import DataTable from "examples/Tables/DataTable";

// Referral page components
import ReferralCode from "./components/ReferralCode";
import OutlinedCard from "layouts/ecommerce/referral/components/OutlinedCard";

// Data
import dataTableData from "layouts/ecommerce/referral/data/dataTableData";

// Images
import officeDark from "assets/images/office-dark.jpg";
import lock from "assets/images/illustrations/lock.png";

import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SUCCESS, findOneUserAction } from "store/actions/actions";
import { axiosInstance } from "services/AxiosInstance";
import "./styles.css";

function Referral() {
  const { secondary } = colors;
  const { borderWidth } = borders;
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const token = useSelector((state) => state?.auth?.auth?.idToken);
  const UserId = useSelector((state) => state.auth.auth._id);
  const OwnerRefferalCode = useSelector((state) =>
    state?.auth?.auth?.userdata?.Referralcode
      ? state?.auth?.auth?.userdata?.Referralcode
      : null
  );
  const isFreePlanActive = useSelector(
    (state) => state?.auth?.auth?.userdata?.isFreePlanActive ?? false
  );
  useEffect(() => {
    dispatch(findOneUserAction({ userId: UserId, token }));
    getCustomerCount();
    getTotalCustomerReferralCodeUses();
  }, []);

  const getTotalCustomerReferralCodeUses = async () => {
    try {
      const res = await axiosInstance.get(
        "clinic/totalCustomerReferralCodeUses",
        {
          headers: {
            authorization: token,
          },
        }
      );
      // console.log("customers", res?.data?.data?.totalCustomers);
      if (res.status === 200) {
        setCustomer(res?.data?.data?.totalCustomers);
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const getCustomerCount = async () => {
    try {
      const res = await axiosInstance.get(
        "clinic/total_Get_Amount_Uses_My_Referral_Code",
        {
          headers: {
            authorization: token,
          },
        }
      );
      // console.log("earnings", res?.data?.data?.totalAmount);

      if (res.status === 200) {
        setEarnings(res?.data?.data?.totalAmount);
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isFreePlanActive ? (
        <SoftBox className="lockedPage">
          <img height={250} src={lock} alt="Lock" />
          <SoftTypography fontSize={16} textAlign="center" color="dark">
            Unlock advanced features with our Practitioner basic plan to access
            the sequence generator.
            <br /> Upgrade today for an enhanced experience!
          </SoftTypography>
        </SoftBox>
      ) : (
        <SoftBox my={3}>
          <SoftBox mb={3}>
            <Card>
              <SoftBox p={2}>
                <SoftBox mb={1}>
                  <SoftTypography variant="h5" fontWeight="medium">
                    Referral Program
                  </SoftTypography>
                </SoftBox>
                <SoftTypography
                  variant="body2"
                  fontWeight="regular"
                  color="text"
                >
                  Join Umbra and learn more about the referral program.
                </SoftTypography>
              </SoftBox>
              <SoftBox p={2}>
                <Grid container style={{ justifyContent: "start" }} spacing={3}>
                  <Grid item xs={6} lg={5}>
                    <OutlinedCounterCard
                      count={earnings}
                      prefix="$"
                      title="earnings"
                    />
                  </Grid>
                  <Grid item xs={6} lg={5}>
                    <OutlinedCounterCard count={customer} title="customers" />
                  </Grid>
                </Grid>
                <SoftBox mt={6} mb={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                      <ReferralCode />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <SoftTypography variant="h5" fontWeight="medium">
                        How to use
                      </SoftTypography>
                      <SoftBox mb={2}>
                        <SoftTypography
                          variant="body2"
                          color="text"
                          fontWeight="regular"
                        >
                          Integrate your referral code in 2 easy steps.
                        </SoftTypography>
                      </SoftBox>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                          <SoftBox
                            borderRadius="md"
                            border={`${borderWidth[1]} dashed ${secondary.main}`}
                          >
                            <TransparentInfoCard
                              color="dark"
                              icon="paid"
                              description="1. Create & validate your referral link and get"
                              value={
                                <>
                                  <SoftTypography
                                    component="span"
                                    variant="button"
                                  >
                                    $
                                  </SoftTypography>
                                  0
                                </>
                              }
                            />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <SoftBox
                            borderRadius="md"
                            border={`${borderWidth[1]} dashed ${secondary.main}`}
                          >
                            <TransparentInfoCard
                              color="dark"
                              icon="unarchive"
                              border={`${borderWidth[1]} dashed ${secondary.main}`}
                              description="2. For first purchase made by owner/client you get"
                              value={
                                <>
                                  50
                                  <SoftTypography
                                    component="span"
                                    variant="button"
                                  >
                                    %
                                  </SoftTypography>
                                </>
                              }
                            />
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </SoftBox>
                <Divider />
              </SoftBox>
            </Card>
          </SoftBox>
        </SoftBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Referral;

.lockedPage {
    min-height: 80vh  !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
}

const ReferralProgram = lazy(() => import("../layouts/pages/Referral Program/index"));
                    <Route path="/referral-program" element={<ReferralProgram />} />
