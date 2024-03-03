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

    const sender = localStorage.getItem("loggedInUserUsername");
    const recipient = localStorage.getItem("selectedUserUsername");


    try {
      const response = await axios.post(
        `http://localhost:4000/upload-image?from=${sender}&to=${recipient}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Video uploaded successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="flex items-center">
      {selectedFile ? (
        <>
          {selectedFile.name}{" "}
          <button onClick={() => setSelectedFile(null)}>Cancel</button>{" "}
          <button onClick={uploadFile}>Send</button>
        </>
      ) : (
        <>
          <label htmlFor="videoupload" className="px-2 py-1 border-2 border-gray-700 rounded-md">Video</label>
          <input
            id="videoupload"
            style={{visibility: "hidden", display: "none"}}
            type="file"
            onChange={handleFileChange}
          ></input>
        </>
      )}
    </div>
  );
};

export default VideoUploader;
