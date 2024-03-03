import React, { useState } from "react";
import axios from "axios";

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("from", localStorage.getItem("loggedInUserUsername"));
      formData.append("to", localStorage.getItem("selectedUserUsername"));

      await axios.post("http://localhost:4000/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Video uploaded successfully.");
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
