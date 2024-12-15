import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { CameraAlt, CloudUpload } from "@mui/icons-material";
import axios from "axios";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // New state for image preview
  const [showDetails, setShowDetails] = useState(false); // Toggle for details

  const handleUpload = async (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file: ", selectedFile); // Debug: log the selected file
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      setImagePreview(URL.createObjectURL(selectedFile)); // Generate image preview

      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post(
          "https://616a-104-197-61-124.ngrok-free.app/process",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.results) {
          setResults(response.data.results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails); // Toggle details visibility
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Navigation Bar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Thai Oceanic Fish Detection
          </Typography>
          <Button
            color="inherit"
            onClick={() => alert("Navigate to another page")}
          >
            Explore
          </Button>
        </Toolbar>
      </AppBar>

      {/* Title and Background Image */}
      <div
        style={{
          background:
            "url(https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/df/2a/09.jpg) no-repeat center center",
          backgroundSize: "cover",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Thai Oceanic Fish Detection
        </Typography>
        <Typography variant="h6">
          Explore various fish species found in the ocean
        </Typography>
      </div>

      {/* Content Section */}
      <Paper style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom>
          ทำความรู้จักสัตว์น้ำหลากหลายชนิด
        </Typography>

        {/* Action buttons */}
        <div style={{ marginBottom: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAlt />}
            style={{ marginRight: "10px" }}
          >
            ถ่ายรูป
          </Button>
          <label htmlFor="upload-file">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CloudUpload />}
              component="span"
              disabled={loading}
            >
              อัพโหลดรูปภาพ
            </Button>
          </label>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-file"
            type="file"
            onChange={handleUpload}
          />
        </div>

        {/* Image Preview and Details */}
        {imagePreview && (
          <div
            style={{
              display: "flex", // Arrange items horizontally
              alignItems: "flex-start", // Align items to the top
              gap: "20px", // Space between details and image
              marginBottom: "20px",
            }}
          >
            {/* Details Section */}
            <div style={{ flex: "1" }}> {/* Allow details to take up more space */}
            <Typography variant="h6" gutterBottom>
              นี่คือสิ่งที่เราค้นพบ:
            </Typography>
              {showDetails && (
                <ul>
                {results.map((item, index) => (
                  <li key={index}>
                    <strong>{item.class_name}</strong> - Confidence:{" "}
                    {item.confidence}
                    <p>{item.info}</p>
                  </li>
                ))}
              </ul>
              )}
              <Button
                onClick={handleToggleDetails}
                variant="outlined"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                {showDetails ? "กดที่นี่เพื่อย่อข้อมูลทั้งหมด" : "กดที่นี่เพื่อดูข้อมูลเพิ่มเติม"}
              </Button>
            </div>

            {/* Image Preview */}
            <div>
              <Typography variant="h6" gutterBottom>
                {/* Preview: */}
              </Typography>
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                style={{
                  width: "30%", // Adjust the width to make the image smaller
                  height: "auto", // Keep the aspect ratio intact
                  display: "block",
                }}
              />
            </div>
          </div>
        )}

        {loading && (
          <CircularProgress style={{ display: "block", marginTop: "20px" }} />
        )}

      </Paper>
    </div>
  );
};

export default App;
