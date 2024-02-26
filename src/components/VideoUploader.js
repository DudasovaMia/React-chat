import React, { useState } from "react";
import axios from "axios";

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:4000/upload-video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Video uploaded successfully:", response.data);
      // Optionally, you can handle success and display a message to the user
    } catch (error) {
      console.error("Error uploading video:", error);
      // Handle error and display a message to the user
    }
  };


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default VideoUploader;
