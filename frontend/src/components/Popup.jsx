import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { collectionsState, itemsState } from "../atoms/atoms";
import { useSetRecoilState, useRecoilState } from "recoil";

export const Popup = ({
  options,
  position,
  setPopupVisibility,
  file,
  collectionName,
}) => {
  const [collections, setCollections] = useRecoilState(collectionsState);

  const setItems = useSetRecoilState(itemsState);
  const itemRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setPopupVisibility(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [itemRef]);

  const handleOptionClick = async (option) => {
    switch (option) {
      case "Delete":
        const toastId = toast.loading("Deleting file...");
        try {
          const response = await axios.put(`${BACKEND_URL}/addToBin`, {
            token: localStorage.getItem("token"),
            file: file,
          });
          setItems((prev) =>
            prev.map((item) =>
              item.id === file.id ? { ...item, deleted: true } : item
            )
          );
          if (collectionName) {
            setCollections((prev) =>
              prev.map((collection) =>
                collection.collectionName === collectionName
                  ? {
                      ...collection,
                      files: collection.files.map((item) =>
                        item.id === file.id ? { ...item, deleted: true } : item
                      ),
                    }
                  : collection
              )
            );
          }
          toast.success("File added to bin", { id: toastId });
        } catch (err) {
          console.error("Error deleting file:", err);
          toast.error("Failed to delete file", { id: toastId });
        }
        break;
      case "Share":
        console.log("Share");
        // Perform share action
        break;
      case "Move":
        console.log("Move");
        // Perform move action
        break;
      case "Rename":
        console.log("Rename");
        // Perform rename action
        break;
      default:
        console.log("Unknown option");
    }
  };
  return (
    <div
      ref={itemRef}
      className={`z-10 bg-white border-gray-200 rounded-md border-[1px] text-base font-normal  ${position}`}
    >
      {options.map((option, index) => (
        <div
          onClick={() => handleOptionClick(option)}
          className={`hover:bg-gray-50 cursor-pointer p-1 flex justify-center active:shadow-inner ${
            index + 1 === options.length
              ? ""
              : "border-b-[1px] border-gray-200 "
          }`}
          key={index}
        >
          {option}
        </div>
      ))}
    </div>
  );
};
