import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Collapse,
  Box,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { CameraAlt, CloudUpload, ExpandMore, FitScreen } from "@mui/icons-material";
import axios from "axios";


const theme = createTheme({
  typography: {
    fontFamily: `'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`, // Change this to your preferred font
  },
});

const styles = {
  typographyStyle: {
    fontSize: "14px",
    marginBottom: "15px",
  },
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const handleUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      setImagePreview(URL.createObjectURL(selectedFile));
      setShowSearchButton(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post(
          "https://d0c6-34-145-21-212.ngrok-free.app/process",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.results && response.data.results.length > 0) {
          setResult(response.data.results[0]);
        } else {
          setResult({
            class_name: "ไม่พบข้อมูล",
            description: "กรุณาอัพโหลดภาพใหม่",
            address: "ไม่สามารถระบุที่อยู่ได้",
          });
        }
      } catch (error) {
        console.error(error);
        let errorMessage = {
          class_name: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถประมวลผลภาพได้",
          address: "โปรดลองอีกครั้ง",
        };

        if (error.response) {
          console.error(`Response status: ${error.response.status}`);
          if (error.response.status === 500) {
            errorMessage.description = "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
          } else {
            errorMessage.description = "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์";
          }
        } else if (error.request) {

          console.error("No response received from the server.");
          errorMessage.description = "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้";
        } else {

          console.error("Request setup error:", error.message);
          errorMessage.description = "เกิดข้อผิดพลาดในขณะที่ตั้งค่าคำขอ";
        }

        setResult(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCapture1 = async (captureButton) => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");
      setImagePreview(imageData);
      setShowSearchButton(true);


      const selectedFile = new Blob([imageData], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post(
          "https://d0c6-34-145-21-212.ngrok-free.app/process",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.results && response.data.results.length > 0) {
          setResult(response.data.results[0]);
        } else {
          setResult({
            class_name: "ไม่พบข้อมูล",
            description: "กรุณาอัพโหลดภาพใหม่",
            address: "ไม่สามารถระบุที่อยู่ได้",
          });
        }
      } catch (error) {
        console.error('Error response:', error.response);
        console.error('Request data:', error.config.data);
        let errorMessage = {
          class_name: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถประมวลผลภาพได้",
          address: "โปรดลองอีกครั้ง",
        };

        if (error.response) {

          console.error(`Response status: ${error.response.status}`);
          console.error(`Response data: ${error.response.data}`);
          errorMessage.description = `Server responded with status ${error.response.status}`;
        } else if (error.request) {

          console.error("No response received from the server.");
          errorMessage.description = "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้";
        } else {

          console.error("Request setup error:", error.message);
          errorMessage.description = "เกิดข้อผิดพลาดในขณะที่ตั้งค่าคำขอ";
        }

        setResult(errorMessage);
      } finally {
        setLoading(false);
      }


      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
      setShowVideo(false);

      captureButton.remove();
    }
  };

  const handleCapture = async (captureButton) => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to convert canvas to Blob.");
          return;
        }


        const previewURL = URL.createObjectURL(blob);
        setImagePreview(previewURL);
        setShowSearchButton(true);


        const formData = new FormData();
        formData.append("image", blob, "capture.jpg");

        try {
          const response = await axios.post(
            "https://d0c6-34-145-21-212.ngrok-free.app/process",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (response.data.results && response.data.results.length > 0) {
            setResult(response.data.results[0]);
          } else {
            setResult({
              class_name: "ไม่พบข้อมูล",
              description: "กรุณาอัพโหลดภาพใหม่",
              address: "ไม่สามารถระบุที่อยู่ได้",
            });
          }
        } catch (error) {
          console.error('Error response:', error.response);
          console.error('Request data:', error.config?.data);
          let errorMessage = {
            class_name: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถประมวลผลภาพได้",
            address: "โปรดลองอีกครั้ง",
          };

          if (error.response) {
            console.error(`Response status: ${error.response.status}`);
            console.error(`Response data: ${error.response.data}`);
            errorMessage.description = `Server responded with status ${error.response.status}`;
          } else if (error.request) {
            console.error("No response received from the server.");
            errorMessage.description = "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้";
          } else {
            console.error("Request setup error:", error.message);
            errorMessage.description = "เกิดข้อผิดพลาดในขณะที่ตั้งค่าคำขอ";
          }

          setResult(errorMessage);
        } finally {
          setLoading(false);
        }
      }, "image/jpeg");


      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
      setShowVideo(false);


      captureButton.remove();
    }
  };



  const handleStartCamera = () => {
    setShowVideo(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
        video.onplaying = () => {

          const captureButton = document.createElement('button');
          captureButton.textContent = 'Capture';
          captureButton.style.backgroundColor = 'black';
          captureButton.style.color = 'white';
          captureButton.style.border = 'none';
          captureButton.style.padding = '10px 20px';
          captureButton.style.position = 'relative';
          captureButton.style.left = '50%';
          captureButton.style.bottom = '0px';
          captureButton.style.transform = 'translateX(-50%)';
          captureButton.style.fontSize = '16px';
          captureButton.onclick = () => {
            handleCapture(captureButton);
          };
          document.body.appendChild(captureButton);
        };
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "0px" }}>
        <AppBar position="fix" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075494.png" style={{ height: '40px', marginRight: '10px', transform: 'scaleX(-1)' }} />
            </IconButton>

            <Typography variant="h6" style={{ flexGrow: 1 }}>
              หน้าแรก
            </Typography>
          </Toolbar>
        </AppBar>



        <div
          style={{
            background:
              "url(https://img.freepik.com/premium-photo/happy-family-exploring-national-aquarium-national-aquarium-day_1302613-1180.jpg) no-repeat center center",
            backgroundSize: "cover",
            width: "100vw", // FitScreen equivalent for full viewport width
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Centers the vertical alignment
            alignItems: "center", // Centers the horizontal alignment
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h3" gutterBottom style={{
            fontSize: "36px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
            fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
          }}>
            ThaiOceanicFish.com
          </Typography>
        </div>

        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <Typography
            variant="h3"
            gutterBottom
            style={{ textAlign: 'center' }}
          >
            {!imagePreview ? "ทำความรู้จักสัตว์น้ำหลากหลายชนิด" : "นี่คือสิ่งที่เราค้นพบ"}
          </Typography>

          {imagePreview && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <img
                  src={imagePreview}
                  alt="Uploaded Preview"
                  style={{
                    width: "400px",
                    height: "auto",
                    borderRadius: "5px",
                  }}
                />
              </div>

              <div style={{ flex: "1", padding: "20px" }}>
                {result ? (
                  <div>
                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: "140px",
                        padding: "10px",
                        borderRadius: "100px",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <strong>ชื่อ</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: "14px", margin: "20px" }}
                    >
                      {result.class_name}
                    </Typography>

                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: "140px",
                        padding: "10px",
                        borderRadius: "100px",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <strong>ลักษณะ</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: "14px", margin: "20px" }}
                    >
                      {result && result.info ? result.info.split('\n')[4] : 'No information available'}
                    </Typography>

                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: "140px",
                        padding: "10px",
                        borderRadius: "100px",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <strong>ที่อยู่</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: "14px", margin: "20px" }}
                    >
                      -
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="body2">
                    กรุณาอัพโหลดภาพเพื่อดูข้อมูล
                  </Typography>
                )}

                <div>
                  <Collapse in={detailsExpanded} timeout="auto" unmountOnExit>
                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: "140px",
                        padding: "10px",
                        borderRadius: "100px",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <strong>ชื่อวิทยาศาสตร์</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: "14px", margin: "20px" }}
                    >
                      -
                    </Typography>

                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: "140px",
                        padding: "10px",
                        borderRadius: "100px",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <strong>เพิ่มเติม</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: "14px", margin: "20px" }}
                    >
                      -
                    </Typography>
                  </Collapse>

                  <Button onClick={() => setDetailsExpanded(!detailsExpanded)} variant="text">
                    {detailsExpanded ? "กดเพื่อย่อข้อมูลทั้งหมด" : "กดเพื่อดูข้อมูลเพิ่มเติม"}
                  </Button>
                </div>
              </div>

            </div>
          )}
          {showVideo && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <video
                ref={videoRef}
                style={{
                  width: "30%",
                  height: "auto",
                  borderRadius: "10px",
                  border: "2px solid black",
                  marginTop: "20px",
                }}
              />
            </Box>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          {showSearchButton && (
            <Typography
              variant="contained"
              color="primary"
              onClick={() => console.log("Searching...")}
              style={{
                color: "black",
                marginTop: "20px",
                display: "block",
                margin: "0 auto",
                width: "200px",
                padding: "10px",
                fontSize: "24px",
                textAlign: "center",
              }}
            >
              ค้นหาสัตว์ชนิดอื่น
            </Typography>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
            <Button
              variant="outlined"
              component="label"
              color="primary"
              style={{
                backgroundColor: '#000',
                color: '#fff',
                display: "flex",
                alignItems: "center",
                width: '200px',
                height: '60px',
                fontSize: '18px',
              }}
            >
              <CloudUpload style={{ marginRight: "8px" }} />
              เลือกไฟล์
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<CameraAlt />}
              onClick={handleStartCamera}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                width: '200px',
                height: '60px',
                fontSize: '18px',
              }}
            >
              เปิดกล้อง
            </Button>
          </div>


        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default App;

