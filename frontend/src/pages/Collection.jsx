// import { Item } from "../components";
// import { FaPlus } from "react-icons/fa6";
// import { SearchBar } from "../components";
// import { useState, useRef, useEffect } from "react";
// import { Popup } from "../components";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { useRecoilState } from "recoil";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { collectionsStateFamily } from "../atoms/atoms";
// import { BACKEND_URL } from "../config";

// export const Collection = ({ collection }) => {
//   const itemRef = useRef(null);
//   const [popupVisibility, setPopupVisibility] = useState(false);

//   const [collectionSingle, setCollectionSingle] = useRecoilState(
//     collectionsStateFamily(collection.collectionName)
//   );
//   // setCollectionSingle(collection);
//   const [reversedCollectionItems, setReversedCollectionItems] = useState([]);

//   useEffect(() => {
//     setReversedCollectionItems(collectionSingle.files.slice().reverse());
//   }, [collectionSingle]);

//   useEffect(async () => {
//     try {
//       const response = await axios.post(`${BACKEND_URL}/getAllCollections`, {
//         token: localStorage.getItem("token"),
//       });
//       setCollectionSingle(
//         response.data.filter(
//           (item) => item.collectionName == collection.collectionName
//         )
//       );
//       setReversedCollectionItems(collectionSingle.files.slice().reverse());
//     } catch (err) {
//       console.error("Error fetching collections:", err);
//       toast.error("Failed to fetch files");
//     }
//   }, []);

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
//     <div className="flex flex-col w-3/5 h-full gap-5 p-5">
//       <SearchBar
//         onchange={(e) => {
//           setReversedCollectionItems(collectionSingle.files.slice().reverse());
//           setReversedCollectionItems((prev) => {
//             return prev.filter((item) => item.name.includes(e.target.value));
//           });
//         }}
//       />
//       <div className="w-full p-5 bg-white rounded-xl grow">
//         <h2 className="relative inline-flex items-center gap-2 mb-5 text-2xl font-medium text-gray-600">
//           {collectionSingle.collectionName}
//           <span
//             ref={itemRef}
//             onClick={() => {
//               setPopupVisibility((prev) => !prev);
//             }}
//             className="flex items-center justify-center w-5 h-5 rounded cursor-pointer hover:bg-gray-300"
//           >
//             <HiOutlineDotsVertical />
//           </span>
//           {popupVisibility && (
//             <Popup
//               options={["Share", "Delete", "Rename"]}
//               position={"absolute right-[-70px] top-0"}
//             />
//           )}
//         </h2>
//         <div className="flex flex-wrap gap-5">
//           {reversedCollectionItems.map((file, index) => {
//             return <Item key={index} file={file} />;
//           })}
//           {collectionSingle.collectionName !== "Favourites" &&
//           collectionSingle.collectionName !== "Bin" ? (
//             <button className="flex rounded-md bg-[#fbfbfb] justify-center items-center w-36 h-36 text-5xl text-[#c8c7c7] active:border-2 active:border-black">
//               <FaPlus />
//             </button>
//           ) : null}
//         </div>
//       </div>
//       <Toaster />
//     </div>
//   );
// };

import { Item } from "../components";
import { IoMdHeartDislike } from "react-icons/io";
import { SearchBar, AddToCollection } from "../components";
import { useState, useRef, useEffect } from "react";
import { Popup } from "../components";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useRecoilState, useSetRecoilState } from "recoil";
import toast, { Toaster } from "react-hot-toast";
import { collectionsState, itemsState } from "../atoms/atoms";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Collection = ({ name }) => {
  const itemRef = useRef(null);
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [collections, setCollections] = useRecoilState(collectionsState);
  const setItems = useSetRecoilState(itemsState);
  const [collection, setCollection] = useState({});
  const [reversedCollectionItems, setReversedCollectionItems] = useState([]);

  useEffect(() => {
    const foundCollection = collections.find((x) => x.collectionName === name);
    if (foundCollection) {
      setCollection(foundCollection);
    }
  }, [collections, name]);

  useEffect(() => {
    if (collection && collection.files) {
      setReversedCollectionItems(collection.files.slice().reverse());
      console.log("collection rendered");
    }
  }, [collection]);

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

  return (
    <div className="flex flex-col w-3/5 h-full gap-5 p-5">
      <SearchBar
        onchange={(e) => {
          setReversedCollectionItems(collection.files.slice().reverse());
          setReversedCollectionItems((prev) =>
            prev
              .filter((item) => !item.deleted) // Filter out deleted items first
              .filter((item) => item.name.includes(e.target.value))
          );
        }}
      />
      <div className="w-full p-5 bg-white rounded-xl grow">
        {name === "Favourites" && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="relative inline-flex items-center gap-2 text-2xl font-medium text-gray-600">
              Favourites
            </h2>
            <div
              onClick={async () => {
                const toastId = toast.loading("Please wait...");
                try {
                  const response = await axios.put(
                    `${BACKEND_URL}/removeAllFavourites`,
                    {
                      token: localStorage.getItem("token"),
                    }
                  );
                  setItems((prev) =>
                    prev.map((item) => ({
                      ...item,
                      isFavourite: false,
                    }))
                  );
                  toast.success("Successful", { id: toastId });
                } catch (error) {
                  console.error(error);
                  toast.error("Failed", { id: toastId });
                }
              }}
              className="text-gray-600 cursor-pointer active:text-[#f72d93]"
              title="Unfavourite All"
            >
              <IoMdHeartDislike size={25} />
            </div>
          </div>
        )}
        {name !== "Favourites" && (
          <h2 className="relative inline-flex items-center gap-2 mb-5 text-2xl font-medium text-gray-600">
            {collection.collectionName}
            <span
              ref={itemRef}
              onClick={() => {
                setPopupVisibility((prev) => !prev);
              }}
              className="flex items-center justify-center w-5 h-5 rounded cursor-pointer hover:bg-gray-300"
            >
              <HiOutlineDotsVertical />
            </span>
            {popupVisibility &&
              (name === "Favourites" ? (
                <Popup
                  options={["Remove all from favourites"]}
                  position={"absolute right-[-200px] top-0"}
                />
              ) : (
                <Popup
                  options={["Delete", "Rename"]}
                  position={"absolute right-[-70px] top-0"}
                />
              ))}
          </h2>
        )}
        <div className="flex flex-wrap gap-5">
          {reversedCollectionItems.map((file, index) => {
            if (!file.deleted) {
              return <Item key={index} file={file} collectionName={name} />;
            } else {
              return null;
            }
          })}
          {collection.collectionName !== "Favourites" &&
          collection.collectionName !== "Bin" ? (
            <AddToCollection collectionName={name} />
          ) : null}
        </div>
      </div>
      <Toaster />
    </div>
  );
};
