// import React, { useState } from "react";
// import axios from "axios";

// const UploadVoice = () => {
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("voice", file);
//       formData.append("from", localStorage.getItem("loggedInUserUsername"));
//       formData.append("to", localStorage.getItem("selectedUserUsername"));

//       await axios.post("http://localhost:4000/upload-voice", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Clear file input and any previous errors
//       setFile(null);
//       setError(null);

//       console.log("Voice uploaded successfully.");
//       window.location.reload();
//     } catch (error) {
//       setError("Error uploading voice.");
//       console.error("Error uploading voice:", error);
//     }
//   };

//   return (
//     <>
//       {file ? (
//         <>
//           {file.name}
//           <button onClick={() => setFile(null)}>Cancel</button>
//           <button onClick={handleUpload}>Send</button>
//         </>
//       ) : (
//         <>
//           <label
//             htmlFor="voiceUpload"
//             className="px-2 py-1 border-2 border-gray-700 rounded-md"
//           >
//             Voice
//           </label>
//           <input
//             id="voiceUpload"
//             type="file"
//             accept="audio/mp3"
//             onChange={handleFileChange}
//             style={{ visibility: "hidden", display: "none" }}
//           />
//         </>
//       )}
//     </>
//   );
// };

// export default UploadVoice;
