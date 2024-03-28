import React, { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { BACKEND_URL } from "../config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { itemsState, collectionsState } from "../atoms/atoms";
import { useSetRecoilState, useRecoilState } from "recoil";

export const AddToCollection = ({ collectionName }) => {
  const setItems = useSetRecoilState(itemsState);
  const [collections, setCollections] = useRecoilState(collectionsState);
  const inputRef = useRef(null);
  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const toastId = toast.loading(`Uploading to ${collectionName}`);
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

      const addToCollectionResponse = await axios.post(
        `${BACKEND_URL}/addToCollection`,
        {
          token: localStorage.getItem("token"),
          collectionName: collectionName,
          file: response.data,
        }
      );

      setItems((prev) => [...prev, response.data]);
      setCollections((prev) =>
        prev.map((collection) => {
          if (collection.collectionName === collectionName) {
            return {
              ...collection,
              files: [...collection.files, response.data],
            };
          }
          return collection;
        })
      );
      toast.success(`File uploaded to ${collectionName}`, { id: toastId });
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
        ref={inputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }} // Hide the file input
      />
      <button
        onClick={handleButtonClick}
        className="flex rounded-md bg-[#fbfbfb] justify-center items-center w-36 h-36 text-5xl text-[#c8c7c7] active:border-2 active:border-black"
      >
        <FaPlus />
      </button>
      <Toaster />
    </div>
  );
};
