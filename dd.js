import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Pagination } from "antd";
import "antd/dist/antd.css";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useLocation } from "react-router-dom";
import {
  clientVideoMessageTherapyAction,
  setClientInClientGallary,
} from "store/actions/actions";
import { getDoctorPhotoTheraphi } from "store/actions/actions";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CLIENT_FREE_PHOTOS_GALLARY } from "store/actions/actions";
import UploadPhotos from "./UploadPhotos";
import ReactSelect from "react-select";
import { axiosInstance } from "services/AxiosInstance";
import UploadVideos from "./UploadVideos";

import moment from "moment";
import { VIEW_MORE_TABVALUE } from "store/actions/actions";
export const LoaderComponent = () => {
  return (
    <div
      style={{
        color: "#344767",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

const CustomAccordion = styled((props) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({}) => ({
  ".MuiAccordionSummary-content": {
    marginLeft: 0,
    "&:last-of-type": {
      marginBottomLeftRadius: 0,
    },
  },
  ".MuiAccordionSummary-root": {
    height: "52px",
    padding: 0,
    background: "#F3F5F4",
    borderTop: "1px solid #F3F5F4",
    borderLeft: "1px solid #F3F5F4",
    borderRight: "1px solid #F3F5F4",
    borderBottom: "1px solid #F3F5F4",
    overFlow: "hidden",
  },
  ".MuiAccordionSummary-root[aria-expanded=true]": {
    height: "54px",

    backgroundColor: "#F3F5F4",

    borderTop: "1px solid #F3F5F4",
    borderBottom: "1px solid #F3F5F4",

    overFlow: "hidden",
  },

  ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    width: 0,
    height: 0,
  },
  ".MuiAccordionSummary-expandIconWrapper": {
    width: 0,
    height: 0,
  },

  "&:not(:last-child)": {
    borderBottom: 0,
  },
}));

const CustomAccordionSummary = styled((props) => (
  <AccordionSummary
    expandIcon={<i className="fa fa-chevron-down"></i>}
    {...props}
  />
))(({ theme }) => ({
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  borderBottomLeftRadius: "10px",

  backgroundColor: "#e7e7e7",

  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },

  "&[aria-expanded=true]": {
    backgroundColor: "#999999",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
  },

  "& i": {
    width: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "21px",
  },
}));

const CustomAccordionDetails = styled((props) => (
  <AccordionDetails {...props} />
))(() => ({
  backgroundColor: "white",
}));

const ClientGallery = ({ searchTextValue, clinicId }) => {
  const [options, setOptions] = useState([]);
  // const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [openUploadVideoModel, setOpenUploadVideoModel] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect");
  const [expanded, setExpanded] = useState("panel00");
  const [openUploadPhotoModel, setOpenUploadPhotoModel] = useState(
    redirect === "soap" ? true : false
  );
  const [activeList, setActiveList] = useState(
    redirect === "soap" ? "clientPhoto" : "photo"
  );
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [clientValue, setClientValue] = useState("");
  const [searchClientNameValue, setSearchClientNameValue] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.auth?.auth?._id);
  const [clientVideoTherapyData, clientSetVideoTherapyData] = useState([]);
  const token = useSelector((state) => state.auth.auth.idToken);
  const totalCount = useSelector((state) =>
    state.auth.clientPhotoGalley.totalCount
      ? state.auth.clientPhotoGalley.totalCount
      : null
  );
  const doctorPhotolist = useSelector((state) => state?.auth?.doctorPhotolist);
  const clientVideoTherapyGallary = useSelector((state) =>
    state.auth.clientVideoTherapyGallary
      ? state.auth.clientVideoTherapyGallary
      : []
  );
  const clientfreePhotoGallary = useSelector((state) =>
    state.auth.clientfreePhotoGallary ? state.auth.clientfreePhotoGallary : []
  );
  const clientfreeVideoGallary = useSelector((state) =>
    state.auth.clientfreeVideoGallary ? state.auth.clientfreeVideoGallary : []
  );
  const soapSelectedClient = useSelector(
    (state) => state.auth.soapSelectedClient
  );
  const clientInClientGallary = useSelector(
    (state) => state?.auth?.selectClientPhotosAndVideos
  );

  useEffect(() => {
    if (soapSelectedClient && Object.keys(soapSelectedClient).length > 0) {
      setSearchClientNameValue(soapSelectedClient.name);
      setClientValue({
        label: soapSelectedClient.name,
        value: soapSelectedClient._id,
      });
    }
  }, [soapSelectedClient]);

  const fetchList = async () => {
    try {
      const res = await axiosInstance.get(
        `user/practitonerClientList?clinicId=${clinicId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (res.status === 200) {
        setOptions(
          res?.data?.data?.result.map((data, i) => {
            return {
              value: data?._id,
              label: data?.name,
            };
          }) || []
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
    if (activeList === "photo") {
      dispatch(
        getDoctorPhotoTheraphi({
          token: token,
          UserId: userId,
          limit: pageSize,
          pageNo: pageNo,
          searchText: { searchText: searchClientNameValue },
          clinicId: clinicId,
        })
      );
    } else if (activeList === "video") {
      dispatch(
        clientVideoMessageTherapyAction({
          id: userId,
          pageNo: pageNo,
          limit: pageSize,
          token,
          searchText: searchClientNameValue,
          clinicId: clinicId,
        })
      );
    } else if (activeList === "clientPhoto") {
      console.log("clientInClientGallary", clientInClientGallary);
      dispatch(
        CLIENT_FREE_PHOTOS_GALLARY({
          id: clientInClientGallary ? clientInClientGallary?.value : null,
          clinicId: clinicId,
          pageNo: pageNo,
          limit: pageSize,
          searchText: searchClientNameValue,
          token,
        })
      );
    }
  }, [
    pageNo,
    pageSize,
    activeList,
    searchClientNameValue,
    clientInClientGallary,
    clinicId,
  ]);

  const handleChange = (panel) => (e, newPanel) => {
    setExpanded(newPanel ? panel : false);
  };

  const handlePageChange = (value) => {
    setPageNo(value);
  };

  const onShowSizeChange = (current, value) => {
    setPageSize(value);
  };

  const clientCallVideoTherapy = async (e, index) => {
    try {
      const combinedId =
        e?.practitionerId > e?.patient?._id
          ? e?.practitionerId + e?.patient?._id
          : e?.patient?._id + e?.practitionerId;

      const querySnapshot = await getDocs(
        collection(db, "videoChats", combinedId, "messages")
      );
      const messageData = querySnapshot.docs.map((doc) => doc.data());
      const gallaryData = messageData.filter(
        (session) => session.sessionId == e._id && session?.file?.url
      );
      const newGallaryData = gallaryData.slice(0, 4);
      clientSetVideoTherapyData((prevState) => {
        const updatedArray = [...prevState];
        updatedArray[index] = newGallaryData;
        return updatedArray;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const openImageInNewTab = (url) => {
    window.open(url, "_blank");
  };

  const handleContextMenu = (el, e) => {
    el.preventDefault();
    dispatch(VIEW_MORE_TABVALUE(1));
    const link = document.createElement("a");
    if (activeList === "photo") {
      link.href = `${window.location.origin}/#/view-more?root=photo&id=${e?._id}&photosvideos=false`;
    } else if (activeList === "video") {
      link.href = `${window.location.origin}/#/view-more?root=video&id=${e._id}&clientId=${e?.practitionerId}&doctorId=${e?.patient?._id}`;
    } else {
      link.href = `${window.location.origin}/#/view-more?root=photo&id=${e?._id}&photosvideos=true `;
    }
    link.target = "_blank";
    link.click();
  };

  return (
    <Box
      container
      spacing={2}
      sx={{
        width: "100%",
        marginLeft: "3px",
        marginTop: "20px",
      }}
    >
      <FormControl>
        <RadioGroup
          row
          value={activeList}
          onChange={(e) => {
            setActiveList(e.target.value);
          }}
          style={{
            paddingLeft: "13px",
            display: "flex",
            gap: "15px",
            marginBottom: "10px",
          }}
        >
          <FormControlLabel
            value={"photo"}
            control={<Radio />}
            label="Photo Therapy"
          />
          <FormControlLabel
            value={"video"}
            control={<Radio />}
            label="Video Therapy"
          />
          <FormControlLabel
            value={"clientPhoto"}
            control={<Radio />}
            label="Client Photos & Videos"
          />
        </RadioGroup>
      </FormControl>
      <SoftBox sx={{ minHeight: "calc(100vh - 340px)" }}>
        <Box>
          {activeList == "photo" && (
            <SoftBox
              sx={{ width: "270px !important", margin: "-10px 10px 20px 0px" }}
            >
              <ReactSelect
                isSearchable={true}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    width: "100% !important",
                    margin: "10px 0px",
                    minWidth: "10px !important",
                    borderRadius: "8px !important",
                    border: "1px solid #c8c8c8",
                    color: "#c8c8c8",
                    cursor: "pointer",
                    height: "100% !important",
                    borderColor: state.isFocused
                      ? "#35d1f5 !important"
                      : "#c8c8c8 !important",
                    boxShadow: state.isFocused ? "0 0 0 1.5px #35d1f5" : "none",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: "999 !important",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    position: "relative",
                    cursor: state.isDisabled ? "not-allowed" : "pointer",
                    opacity: state.isDisabled ? 0.5 : 1,
                    userSelect: state.isDisabled ? "none" : "auto",
                    transition: "background-color 300ms ease, color 300ms ease",

                    "&:after": {
                      content: "'Press to select'",
                      display: "block",
                      position: "absolute",
                      top: "52%",
                      opacity: 0,
                      transform: "translateY(-50%)",
                      transition: "opacity 300ms ease",
                    },

                    "&:hover, &:focus": {
                      cursor: "pointer",
                    },
                  }),
                }}
                placeholder="Select Client"
                closeMenuOnSelect={true}
                options={options}
                onChange={(e) => {
                  setClientValue(e);
                  console.log(e?.label);
                  setSearchClientNameValue(e?.label);
                  dispatch(setClientInClientGallary(e));
                }}
                value={clientValue ? clientValue : clientInClientGallary}
                isClearable={true}
              />
            </SoftBox>
          )}
          {activeList == "photo" ? (
            doctorPhotolist && doctorPhotolist?.length > 0 ? (
              doctorPhotolist?.map((e, index, grp) => {
                return (
                  <>
                    <Grid container>
                      <>
                        <Grid xs={12}>
                          <CustomAccordion
                            onChange={handleChange(`panel${index}`)}
                            style={{ marginBottom: "5px" }}
                          >
                            <CustomAccordionSummary
                              aria-controls="panel1bh-content"
                              id="panel1a-header"
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "52px",
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    color: "rgb(52, 71, 103)",
                                    margin: "0 1rem",

                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>{e?.patient?.name}</div>
                                </div>

                                <div
                                  style={{
                                    color: "rgb(52, 71, 103)",

                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div style={{ marginRight: "8px" }}>
                                    {moment(e?.visitDate).format("MM-DD-YYYY")}
                                  </div>

                                  <div
                                    style={{
                                      background: "#F3F5F4",
                                      width: "40px",
                                      height: "50px",
                                      fontWeight: "lighter",
                                      overflow: "hidden",
                                      borderTopRightRadius: "10px",
                                      borderBottomRightRadius: "10px",
                                    }}
                                  >
                                    {expanded === `panel${index}` ? (
                                      <ExpandMoreIcon
                                        style={{
                                          marginLeft: "5px",
                                          background: "#F3F5F4",
                                          width: "30px",
                                          height: "50px",
                                          fontWeight: "lighter",

                                          borderTopRightRadius: "10px",
                                          borderBottomRightRadius: "10px",
                                        }}
                                      />
                                    ) : (
                                      <ExpandLessIcon
                                        style={{
                                          marginLeft: "5px",
                                          background: "#F3F5F4",
                                          width: "30px",
                                          height: "50px",
                                          fontWeight: "lighter",
                                          borderTopRightRadius: "10px",
                                          borderBottomRightRadius: "10px",
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CustomAccordionSummary>
                            <CustomAccordionDetails
                              style={{
                                borderLeft: "2px solid #F3F5F4",
                                borderRight: "2px solid #F3F5F4",
                                borderBottom: "2px solid #F3F5F4",
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                              }}
                            >
                              <div className="imageDisplay">
                                <PhotoProvider>
                                  <PhotoView src={e.uploadFront}>
                                    <div className="image-wrap">
                                      <img
                                        src={e.uploadFront}
                                        className="uploadimageshow"
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  </PhotoView>
                                </PhotoProvider>
                                <PhotoProvider>
                                  <PhotoView src={e.uploadBack}>
                                    <div className="image-wrap">
                                      <img
                                        src={e.uploadBack}
                                        className="uploadimageshow"
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  </PhotoView>
                                </PhotoProvider>
                                <PhotoProvider>
                                  <PhotoView src={e.uploadLeft}>
                                    <div className="image-wrap">
                                      <img
                                        src={e.uploadLeft}
                                        className="uploadimageshow"
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  </PhotoView>
                                </PhotoProvider>
                                <PhotoProvider>
                                  <PhotoView src={e.uploadRight}>
                                    <div className="image-wrap">
                                      <img
                                        src={e.uploadRight}
                                        className="uploadimageshow"
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  </PhotoView>
                                </PhotoProvider>
                                <div className="viewmore-wrap">
                                  <SoftButton
                                    style={{ color: "#344767", margin: "1rem" }}
                                    onClick={(el) => handleContextMenu(el, e)}
                                  >
                                    view more
                                  </SoftButton>
                                </div>
                              </div>
                            </CustomAccordionDetails>
                          </CustomAccordion>
                        </Grid>
                      </>
                    </Grid>
                  </>
                );
              })
            ) : (
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                No Found Data
              </p>
            )
          ) : activeList == "video" &&
            clientVideoTherapyGallary &&
            clientVideoTherapyGallary?.length > 0 ? (
            clientVideoTherapyGallary?.map((e, index) => {
              return (
                <>
                  <Grid container>
                    <>
                      <Grid xs={12}>
                        <CustomAccordion
                          onChange={handleChange(`panel${index}`)}
                          style={{ marginBottom: "5px" }}
                          onClick={() => clientCallVideoTherapy(e, index)}
                        >
                          <CustomAccordionSummary
                            aria-controls="panel1bh-content"
                            id="panel1a-header"
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "52px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  color: "rgb(52, 71, 103)",
                                  margin: "0 1rem",

                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div>{e?.patient?.name}</div>
                              </div>

                              <div
                                style={{
                                  color: "rgb(52, 71, 103)",

                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ marginRight: "8px" }}>
                                  {moment(e?.visitDate).format("MM-DD-YYYY")}
                                </div>

                                <div
                                  style={{
                                    background: "#F3F5F4",
                                    width: "40px",
                                    height: "50px",
                                    fontWeight: "lighter",
                                    overflow: "hidden",
                                    borderTopRightRadius: "10px",
                                    borderBottomRightRadius: "10px",
                                  }}
                                >
                                  {expanded === `panel${index}` ? (
                                    <ExpandMoreIcon
                                      style={{
                                        marginLeft: "5px",
                                        background: "#F3F5F4",
                                        width: "30px",
                                        height: "50px",
                                        fontWeight: "lighter",

                                        borderTopRightRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                      }}
                                    />
                                  ) : (
                                    <ExpandLessIcon
                                      style={{
                                        marginLeft: "5px",
                                        background: "#F3F5F4",
                                        width: "30px",
                                        height: "50px",
                                        fontWeight: "lighter",
                                        borderTopRightRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </CustomAccordionSummary>
                          <CustomAccordionDetails
                            style={{
                              borderLeft: "2px solid #F3F5F4",
                              borderRight: "2px solid #F3F5F4",
                              borderBottom: "2px solid #F3F5F4",
                              borderBottomLeftRadius: "10px",
                              borderBottomRightRadius: "10px",
                            }}
                          >
                            <div className="imageDisplay">
                              {clientVideoTherapyData[index] &&
                              clientVideoTherapyData[index]?.length > 0 ? (
                                <>
                                  {clientVideoTherapyData[index].map(
                                    (ele, i) => {
                                      let extension =
                                        ele?.file?.type.split("/");
                                      return (
                                        <>
                                          {extension[0] === "image" ? (
                                            <div
                                              onClick={() =>
                                                openImageInNewTab(
                                                  ele?.file?.url
                                                )
                                              }
                                              className="image-wrap"
                                              key={i}
                                            >
                                              <PhotoProvider>
                                                <PhotoView src={ele?.file?.url}>
                                                  <img
                                                    src={ele?.file?.url}
                                                    className="uploadimageshow"
                                                    alt={`Image ${i}`}
                                                  />
                                                </PhotoView>
                                              </PhotoProvider>
                                            </div>
                                          ) : (
                                            <div
                                              onClick={() =>
                                                openImageInNewTab(
                                                  ele?.file?.url
                                                )
                                              }
                                              className="video_wrap"
                                              key={i}
                                            >
                                              <video
                                                // className="card-content"
                                                height="100%"
                                                width="100%"
                                                autoPlay={false}
                                                muted
                                                controls
                                              >
                                                <source
                                                  src={ele?.file?.url}
                                                  type="video/mp4"
                                                />
                                                Your browser does not support
                                                HTML video.
                                              </video>
                                            </div>
                                          )}
                                        </>
                                      );
                                    }
                                  )}
                                  <div className="viewmore-wrap">
                                    <SoftButton
                                      style={{
                                        color: "#344767",
                                        marginLeft: "1rem",
                                      }}
                                      onClick={(el) => handleContextMenu(el, e)}
                                    >
                                      view more
                                    </SoftButton>
                                  </div>
                                </>
                              ) : (
                                <h5>No Data Found</h5>
                              )}
                            </div>
                          </CustomAccordionDetails>
                        </CustomAccordion>
                      </Grid>
                    </>
                  </Grid>
                </>
              );
            })
          ) : activeList == "clientPhoto" ? (
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={1}
              alignItems={"space-between"}
            >
              <Box display={"flex"} justifyContent={"space-between"} gap={1}>
                <Box
                  width="270px"
                  style={{ marginBottom: "10px" }}
                  mt={`${window.innerWidth < 800 ? "5px" : ""}`}
                >
                  <ReactSelect
                    isSearchable={true}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        width: "100% !important",
                        margin: "0px",
                        minWidth: "10px !important",
                        borderRadius: "8px !important",
                        border: "1px solid #c8c8c8",
                        color: "#c8c8c8",
                        height: "100% !important",
                        borderColor: state.isFocused
                          ? "#35d1f5 !important"
                          : "#c8c8c8 !important",
                        boxShadow: state.isFocused
                          ? "0 0 0 2px #35d1f5"
                          : "none",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: "999 !important",
                      }),

                      option: (provided, state) => ({
                        ...provided,
                        position: "relative",
                        cursor: state.isDisabled ? "not-allowed" : "pointer",
                        opacity: state.isDisabled ? 0.5 : 1,
                        userSelect: state.isDisabled ? "none" : "auto",
                        transition:
                          "background-color 300ms ease, color 300ms ease",

                        "&:after": {
                          content: "'Press to select'",
                          display: "block",
                          position: "absolute",
                          top: "52%",
                          opacity: 0,
                          transform: "translateY(-50%)",
                          transition: "opacity 300ms ease",
                        },

                        "&:hover, &:focus": {
                          cursor: "pointer",
                        },
                      }),
                    }}
                    placeholder="Select Client"
                    closeMenuOnSelect={true}
                    options={options}
                    onChange={(e) => {
                      dispatch(setClientInClientGallary(e));
                      setClientValue(e);
                      setSearchClientNameValue(e?.label);
                    }}
                    value={
                      clientInClientGallary
                        ? clientInClientGallary
                        : clientValue
                    }
                    isClearable={true}
                  />
                </Box>
                <SoftButton
                  onClick={() => setOpenUploadPhotoModel(true)}
                  variant={"gradient"}
                  color="dark"
                  sx={{ width: 100 }}
                  size="small"
                >
                  upload
                </SoftButton>
              </Box>
              <Box width={"100%"}>
                {clientfreePhotoGallary &&
                  clientfreePhotoGallary?.length > 0 &&
                  clientfreePhotoGallary?.map((e, index, grp) => {
                    return (
                      <>
                        <Grid container>
                          <Grid xs={12}>
                            <CustomAccordion
                              onChange={handleChange(`panel${index}`)}
                              style={{ marginBottom: "5px" }}
                            >
                              <CustomAccordionSummary
                                aria-controls="panel1bh-content"
                                id="panel1a-header"
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "52px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "rgb(52, 71, 103)",
                                      margin: "0 1rem",

                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>{e?.patient?.name}</div>
                                    {e.practitionerName && (
                                      <SoftTypography
                                        variant="caption"
                                        ml="15px"
                                        mt="5px"
                                      >
                                        Uploaded By {e.practitionerName}
                                      </SoftTypography>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      color: "rgb(52, 71, 103)",

                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div style={{ marginRight: "8px" }}>
                                      {moment(e?.visitDate).format(
                                        "MM-DD-YYYY"
                                      )}
                                    </div>

                                    <div
                                      style={{
                                        background: "#F3F5F4",
                                        width: "40px",
                                        height: "50px",
                                        fontWeight: "lighter",
                                        overflow: "hidden",
                                        borderTopRightRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                      }}
                                    >
                                      {expanded === `panel${index}` ? (
                                        <ExpandMoreIcon
                                          style={{
                                            marginLeft: "5px",
                                            background: "#F3F5F4",
                                            width: "30px",
                                            height: "50px",
                                            fontWeight: "lighter",

                                            borderTopRightRadius: "10px",
                                            borderBottomRightRadius: "10px",
                                          }}
                                        />
                                      ) : (
                                        <ExpandLessIcon
                                          style={{
                                            marginLeft: "5px",
                                            background: "#F3F5F4",
                                            width: "30px",
                                            height: "50px",
                                            fontWeight: "lighter",
                                            borderTopRightRadius: "10px",
                                            borderBottomRightRadius: "10px",
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CustomAccordionSummary>
                              <CustomAccordionDetails
                                style={{
                                  borderLeft: "2px solid #F3F5F4",
                                  borderRight: "2px solid #F3F5F4",
                                  borderBottom: "2px solid #F3F5F4",
                                  borderBottomLeftRadius: "10px",
                                  borderBottomRightRadius: "10px",
                                }}
                              >
                                <div className="imageDisplay">
                                  <PhotoProvider>
                                    <PhotoView src={e.uploadFront}>
                                      <div className="image-wrap">
                                        <img
                                          src={e.uploadFront}
                                          className="uploadimageshow"
                                          style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: "10px",
                                          }}
                                        />
                                      </div>
                                    </PhotoView>
                                  </PhotoProvider>
                                  <PhotoProvider>
                                    <PhotoView src={e.uploadBack}>
                                      <div className="image-wrap">
                                        <img
                                          src={e.uploadBack}
                                          className="uploadimageshow"
                                          style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: "10px",
                                          }}
                                        />
                                      </div>
                                    </PhotoView>
                                  </PhotoProvider>
                                  <PhotoProvider>
                                    <PhotoView src={e.uploadLeft}>
                                      <div className="image-wrap">
                                        <img
                                          src={e.uploadLeft}
                                          className="uploadimageshow"
                                          style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: "10px",
                                          }}
                                        />
                                      </div>
                                    </PhotoView>
                                  </PhotoProvider>
                                  <PhotoProvider>
                                    <PhotoView src={e.uploadRight}>
                                      <div className="image-wrap">
                                        <img
                                          src={e.uploadRight}
                                          className="uploadimageshow"
                                          style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: "10px",
                                          }}
                                        />
                                      </div>
                                    </PhotoView>
                                  </PhotoProvider>
                                  <div className="viewmore-wrap">
                                    <SoftButton
                                      onClick={(el) => handleContextMenu(el, e)}
                                      style={{
                                        color: "#344767",
                                        margin: "1rem",
                                      }}
                                    >
                                      view more
                                    </SoftButton>
                                  </div>
                                </div>
                              </CustomAccordionDetails>
                            </CustomAccordion>
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
                {clientfreePhotoGallary?.length === 0 && (
                  <SoftTypography variant={"h6"}>
                    No photos available
                  </SoftTypography>
                )}
              </Box>
            </Box>
          ) : activeList == "clientVideo" ? (
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={1}
              alignItems={"flex-end"}
            >
              <Box display={"flex"} justifyContent={"center"} gap={1}>
                <SoftButton
                  variant={"gradient"}
                  color="dark"
                  sx={{ width: 100 }}
                  size="small"
                  onClick={() => setOpenUploadVideoModel(true)}
                >
                  upload
                </SoftButton>
              </Box>
              <Box width={"100%"}>
                {clientfreeVideoGallary &&
                  clientfreeVideoGallary?.length > 0 &&
                  clientfreeVideoGallary?.map((e, index, grp) => {
                    return (
                      <>
                        <Grid container>
                          <Grid xs={12}>
                            <CustomAccordion
                              onChange={handleChange(`panel${index}`)}
                              style={{ marginBottom: "5px" }}
                            >
                              <CustomAccordionSummary
                                aria-controls="panel1bh-content"
                                id="panel1a-header"
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "52px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "rgb(52, 71, 103)",
                                      margin: "0 1rem",

                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <div>{e?.patient?.name}</div>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      color: "rgb(52, 71, 103)",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div style={{ marginRight: "8px" }}>
                                      {moment(e?.visitDate).format(
                                        "MM-DD-YYYY"
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        background: "#F3F5F4",
                                        width: "40px",
                                        height: "50px",
                                        fontWeight: "lighter",
                                        overflow: "hidden",
                                        borderTopRightRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                      }}
                                    >
                                      {expanded === `panel${index}` ? (
                                        <ExpandMoreIcon
                                          style={{
                                            marginLeft: "5px",
                                            background: "#F3F5F4",
                                            width: "30px",
                                            height: "50px",
                                            fontWeight: "lighter",

                                            borderTopRightRadius: "10px",
                                            borderBottomRightRadius: "10px",
                                          }}
                                        />
                                      ) : (
                                        <ExpandLessIcon
                                          style={{
                                            marginLeft: "5px",
                                            background: "#F3F5F4",
                                            width: "30px",
                                            height: "50px",
                                            fontWeight: "lighter",
                                            borderTopRightRadius: "10px",
                                            borderBottomRightRadius: "10px",
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CustomAccordionSummary>
                              <CustomAccordionDetails
                                style={{
                                  borderLeft: "2px solid #F3F5F4",
                                  borderRight: "2px solid #F3F5F4",
                                  borderBottom: "2px solid #F3F5F4",
                                  borderBottomLeftRadius: "10px",
                                  borderBottomRightRadius: "10px",
                                }}
                              >
                                <div className="imageDisplay">
                                  <div className="video_wrap">
                                    <video
                                      src={e.videoOne}
                                      controls
                                      className="uploadimageshow"
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  </div>
                                  <div className="video_wrap">
                                    <video
                                      src={e.videoTwo}
                                      controls
                                      className="uploadimageshow"
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  </div>
                                  <div className="video_wrap">
                                    <video
                                      src={e.videoThree}
                                      controls
                                      className="uploadimageshow"
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </CustomAccordionDetails>
                            </CustomAccordion>
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
                {clientfreeVideoGallary?.length === 0 && (
                  <SoftTypography variant={"h6"}>
                    No Videos available
                  </SoftTypography>
                )}
              </Box>
            </Box>
          ) : (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
              }}
            >
              No Found Data
            </p>
          )}
        </Box>
        {doctorPhotolist.length ? (
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"flex-end"}
            mt={2}
          >
            <Pagination
              pageSize={pageSize}
              total={totalCount}
              current={pageNo}
              onChange={(value) => handlePageChange(value)}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={(current, value) =>
                onShowSizeChange(current, value)
              }
            />
          </Box>
        ) : (
          <></>
        )}
      </SoftBox>

      <Dialog open={openUploadPhotoModel} fullWidth maxWidth="xl">
        <DialogTitle id="alert-dialog-title">
          Upload Photos and Videos
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <UploadPhotos
            onClose={setOpenUploadPhotoModel}
            userId={userId}
            selectedClient={clientInClientGallary}
            options={options}
            clinicId={clinicId}
            isForPractitioner={true}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openUploadVideoModel} fullWidth maxWidth="xl">
        <DialogTitle id="alert-dialog-title">Upload Videos</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <UploadVideos
            onClose={setOpenUploadVideoModel}
            userId={userId}
            options={options}
            clinicId={clinicId}
            isForPractitioner={true}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

ClientGallery.propTypes = {
  tabValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  searchTextValue: PropTypes.string,
  clinicId: PropTypes.string,
  pageSizeHandler: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  pageNoHandler: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
export default ClientGallery;


function* clientFreePhotoGallary({ payload }) {
  const { id, searchText, pageNo, limit, token, clinicId } = payload;
  try {
    const response = yield axiosInstance.get(
      `photoTherapy/ClientPhotoList?searchText=${
        searchText !== undefined ? searchText : ""
      }&pageNo=${pageNo}&limit=${limit}&clinicId=${clinicId}&clientId=${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log("clientFreePhotoGallary", response);

    if (response.status === 200 || response.status === 201) {
      yield put(CLIENT_FREE_PHOTOS_GALLARY_SUCCESS(response.data.data.result));
    }
  } catch (err) {
    yield put(CLIENT_FREE_PHOTOS_GALLARY_SUCCESS([]));
    yield put(ERROR(err.message));
  }
}