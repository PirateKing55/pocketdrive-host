// import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { Popup } from "./Popup";
// import { useState, useEffect, useRef } from "react";
// import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { BACKEND_URL } from "../config";
// import { collectionsStateFamily } from "../atoms/atoms";
// import { useSetRecoilState } from "recoil";

// export const Item = ({ file }) => {
//   const [popupVisibility, setPopupVisibility] = useState(false);
//   const [favourite, setFavourite] = useState(file.isFavourite);
//   const setCollectionFavourite = useSetRecoilState(
//     collectionsStateFamily("Favourites")
//   );
//   const itemRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (itemRef.current && !itemRef.current.contains(event.target)) {
//         setPopupVisibility(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [itemRef]);

//   return (
//     <div className="relative flex rounded-md bg-[#fbfbfb] justify-center px-1 py-10 items-center w-36 h-36 overflow-hidden">
//       {file.name}
//       <span
//         onClick={async () => {
//           const toastId = toast.loading("");
//           try {
//             const res = await axios.put(`${BACKEND_URL}/handleFavourite`, {
//               token: localStorage.getItem("token"),
//               file: file,
//             });

//             if (res.data.file.isFavourite) {
//               const response = await axios.post(
//                 `${BACKEND_URL}/addToCollection`,
//                 {
//                   token: localStorage.getItem("token"),
//                   collectionName: "Favourites",
//                   file: file,
//                 }
//               );
//               setCollectionFavourite((prev) => {
//                 return { ...prev, files: [...prev.files, file] };
//               });
//               toast.success("Added to Favourites", { id: toastId });
//             } else if (!res.data.file.isFavourite) {
//               const response = await axios.post(
//                 `${BACKEND_URL}/removeFromCollection`,
//                 {
//                   token: localStorage.getItem("token"),
//                   collectionName: "Favourites",
//                   file: file,
//                 }
//               );

//               setCollectionFavourite((prev) => {
//                 return {
//                   ...prev,
//                   files: prev.files.filter((x) => x.id != file.id),
//                 };
//               });

//               toast.success("Removed from Favourites", { id: toastId });
//             }
//             setFavourite(res.data.file.isFavourite);
//           } catch (error) {
//             console.error("Error handling favourite:", error);
//             toast.error("Failed", { id: toastId });
//           }
//         }}
//         className="absolute flex items-center justify-center cursor-pointer top-[10px] right-8"
//       >
//         {favourite ? <IoIosHeart color="#f72d93" /> : <IoIosHeartEmpty />}
//       </span>
//       <span
//         ref={itemRef}
//         onClick={() => {
//           setPopupVisibility((prev) => !prev);
//         }}
//         className="absolute flex items-center justify-center w-5 h-5 rounded cursor-pointer top-2 right-2 hover:bg-gray-300"
//       >
//         <HiOutlineDotsHorizontal />
//       </span>
//       {popupVisibility && (
//         <Popup
//           options={["Share", "Delete", "Move", "Rename"]}
//           position={"absolute left-36 top-2"}
//         />
//       )}
//       <Toaster />
//     </div>
//   );
// };

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdFileDownload } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import { Popup } from "./Popup";
import { useState, useEffect, useRef } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { collectionsState, itemsState } from "../atoms/atoms";
import { useSetRecoilState, useRecoilState } from "recoil";

export const Item = ({ file, collectionName }) => {
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [favourite, setFavourite] = useState(false);

  const [collections, setCollections] = useRecoilState(collectionsState);
  const setItems = useSetRecoilState(itemsState);

  useEffect(() => {
    setFavourite(file.isFavourite);
  }, [file]);

  return (
    <div className="relative flex rounded-md bg-[#fbfbfb] justify-center px-1 py-10 items-center w-36 h-36">
      {file.name}
      <span
        onClick={async () => {
          try {
            console.log(file.id);
            const response = await axios.post(`${BACKEND_URL}/download`, {
              token: localStorage.getItem("token"),
              fileId: file.id,
            });

            // // Extract the file buffer from the response
            // const fileBuffer = response.data;

            // // Create a Blob object from the file buffer
            // const blob = new Blob([fileBuffer]);
            // console.log(blob);

            // // Create a temporary anchor element to trigger the file download
            // const anchorElement = document.createElement("a");
            // anchorElement.href = window.URL.createObjectURL(blob);
            // console.log(anchorElement.href);
            // anchorElement.download = "filename"; // Set the filename here

            // // Trigger the click event on the anchor element to start the file download
            // anchorElement.click();

            // Handle successful download response
            const blob = new Blob([response.data], {
              type: response.headers["content-type"],
            });
            // const fileName = getFileNameFromResponse(response); // Implement logic to extract filename from response

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "fileName";
            link.click();
            URL.revokeObjectURL(link.href);
          } catch (error) {
            console.error("Error downloading file:", error);
            // Handle errors here
          }
        }}
        className="text-gray-600 active:text-black absolute flex items-center justify-center cursor-pointer top-[10px] right-14"
      >
        <MdFileDownload />
      </span>
      {/* {name && name === "Bin" ? (
        <span className="text-red-600 active:text-black absolute flex items-center justify-center cursor-pointer top-[10px] right-8">
          <MdDelete />
        </span>
      ) : null}
      {name && name === "Bin" ? (
        <span className="text-green-600 active:text-black absolute flex items-center justify-center cursor-pointer top-[10px] right-2">
          <TbRestore />
        </span>
      ) : null} */}
      {collectionName && collectionName === "Bin" ? (
        <div className="flex justify-center items-center gap-1 absolute top-[10px] right-2">
          <span
            onClick={async () => {
              const toastId = toast.loading("Deleting file...");
              try {
                const res = await axios.put(
                  `${BACKEND_URL}/permanentlyDelete`,
                  {
                    token: localStorage.getItem("token"),
                    file: file,
                  }
                );
                setItems((prev) => prev.filter((item) => item.id !== file.id));
                toast.success("File permanently deleted", { id: toastId });
              } catch (err) {
                console.error("Error deleting file:", err);
                toast.error("Failed to delete file", { id: toastId });
              }
            }}
            className="flex items-center justify-center text-gray-600 cursor-pointer active:text-red-600"
          >
            <MdDelete />
          </span>
          <span
            onClick={async () => {
              const toastId = toast.loading("Restoring file...");
              try {
                const res = await axios.put(`${BACKEND_URL}/restoreFromBin`, {
                  token: localStorage.getItem("token"),
                  file: file,
                });
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === file.id ? { ...item, deleted: false } : item
                  )
                );
                toast.success("File restored", { id: toastId });
              } catch (err) {
                console.error("Error restoring file:", err);
                toast.error("Failed to restore file", { id: toastId });
              }
            }}
            className="flex items-center justify-center text-gray-600 cursor-pointer active:text-green-600"
          >
            <TbRestore />
          </span>
        </div>
      ) : (
        <div className="flex justify-center items-start gap-1 absolute top-[10px] right-2">
          <span
            onClick={async () => {
              const toastId = toast.loading("Please wait...");
              try {
                const res = await axios.put(`${BACKEND_URL}/handleFavourite`, {
                  token: localStorage.getItem("token"),
                  file: file,
                });
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === file.id
                      ? { ...item, isFavourite: res.data.file.isFavourite }
                      : item
                  )
                );

                if (res.data.file.isFavourite) {
                  // const updatedCollections = collections.map((collection) => {
                  //   if (collection.collectionName === "Favourites") {
                  //     return {
                  //       ...collection,
                  //       files: [...collection.files, file],
                  //     };
                  //   } else {
                  //     return collection;
                  //   }
                  // });
                  // setCollections(updatedCollections);
                  toast.success("Added to Favourites", { id: toastId });
                } else if (!res.data.file.isFavourite) {
                  // const updatedCollections = collections.map((collection) => {
                  //   if (collection.collectionName === "Favourites") {
                  //     return {
                  //       ...collection,
                  //       files: collection.files.filter((x) => x.id !== file.id),
                  //     };
                  //   }
                  //   return collection;
                  // });
                  // setCollections(updatedCollections);
                  toast.success("Removed from Favourites", { id: toastId });
                }
                setFavourite(res.data.file.isFavourite);
              } catch (error) {
                console.error("Error handling favourite:", error);
                toast.error("Failed", { id: toastId });
              }
            }}
            className="flex items-center justify-center cursor-pointer"
          >
            {favourite ? <IoIosHeart color="#f72d93" /> : <IoIosHeartEmpty />}
          </span>
          <span
            onClick={() => {
              setPopupVisibility((prev) => !prev);
            }}
            className="flex items-center justify-center w-5 h-5 rounded cursor-pointer hover:bg-gray-300"
          >
            <HiOutlineDotsHorizontal />
          </span>
        </div>
      )}
      {popupVisibility && (
        <Popup
          options={["Delete", "Rename"]}
          position={"absolute left-36 top-2"}
          setPopupVisibility={setPopupVisibility}
          file={file}
          collectionName={collectionName}
        />
      )}
      <Toaster />
    </div>
  );
};
