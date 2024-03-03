import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("from", localStorage.getItem("loggedInUserUsername"));
      formData.append("to", localStorage.getItem("selectedUserUsername"));

     await axios.post("http://localhost:4000/upload-image", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });

      console.log("Image uploaded successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
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
          <label
            htmlFor="files"
            className="px-2 py-1 border-2 border-gray-700 rounded-md"
          >
            Image
          </label>
          <input
            id="files"
            style={{ visibility: "hidden", display: "none" }}
            type="file"
            onChange={handleFileChange}
          ></input>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
