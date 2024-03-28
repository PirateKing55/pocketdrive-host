// import React, { useRef } from "react";
// import { FaPlus } from "react-icons/fa6";
// import { BACKEND_URL } from "../config";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { itemsState } from "../atoms/atoms";
// import { useSetRecoilState } from "recoil";

// export const FileUploadComponent = ({ collapsed }) => {
//   const fileInputRef = useRef(null);
//   const setItems = useSetRecoilState(itemsState);

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     const fileName = file.name;

//     // Read the file content
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     const toastId = toast.loading("Uploading file");
//     reader.onload = async (e) => {
//       const fileContent = e.target.result;
//       console.log(fileName);
//       console.log(fileContent);

//       try {
//         const response = await axios.post(`${BACKEND_URL}/uploadFile`, {
//           token: localStorage.getItem("token"),
//           file: file,
//           fileName: fileName,
//           fileOrgName: fileName,
//         });
//         setItems((prev) => [...prev, response.data]);
//         toast.success("File uploaded successfully", { id: toastId });
//       } catch (error) {
//         if (error.response) {
//           console.log("1st");
//           console.log(error.response.data.message);
//           return toast.error(error.response.data.message, {
//             id: toastId,
//           });
//         } else if (error.request) {
//           console.log("2nd");
//           return toast.error("No Response Received", {
//             id: toastId,
//           });
//         } else {
//           console.log("3rd");
//           return toast.error("Request Error:" + error.message, {
//             id: toastId,
//           });
//         }
//       }
//     };
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileUpload}
//         style={{ display: "none" }} // Hide the file input
//       />
//       <button
//         onClick={handleButtonClick}
//         className={`flex items-center justify-center ${
//           collapsed ? "w-12 ml-4" : "w-24 ml-5"
//         } h-12 gap-2 my-5 ml-5 text-xl font-normal text-gray-600 bg-white rounded-lg shadow-md active:shadow-none`}
//       >
//         <FaPlus />
//         {!collapsed && "New"}
//       </button>
//       <Toaster />
//     </div>
//   );
// };

import React, { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { BACKEND_URL } from "../config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { itemsState } from "../atoms/atoms";
import { useSetRecoilState } from "recoil";

export const FileUploadComponent = ({ collapsed }) => {
  const fileInputRef = useRef(null);
  const setItems = useSetRecoilState(itemsState);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const toastId = toast.loading("Uploading file");
    try {
      const selectedFile = event.target.files[0]; // Get the first selected file

      if (!selectedFile) {
        throw new Error("No file selected"); // Handle no file selection
      }

      const formData = new FormData(); // Create a FormData object
      formData.append("token", localStorage.getItem("token")); // Add token
      formData.append("file", selectedFile); // Add the selected file
      formData.append("fileName", selectedFile.name); // Add the file name
      formData.append("fileOrgName", selectedFile.name); // Add the original file name

      const response = await axios.post(`${BACKEND_URL}/uploadFile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set Content-Type header
        },
      });
      setItems((prev) => [...prev, response.data]);
      toast.success("File uploaded successfully", { id: toastId });
    } catch (error) {
      return toast.error(error.response.data.message, {
        id: toastId,
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }} // Hide the file input
      />
      <button
        onClick={handleButtonClick}
        className={`flex items-center justify-center ${
          collapsed ? "w-12 ml-4" : "w-24 ml-5"
        } h-12 gap-2 my-5 ml-5 text-xl font-normal text-gray-600 bg-white rounded-lg shadow-md active:shadow-none`}
      >
        <FaPlus />
        {!collapsed && "New"}
      </button>
      <Toaster />
    </div>
  );
};
