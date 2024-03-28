import { Item } from "../components";
import { MdDelete } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import { SearchBar, Popup, AddToCollection } from "../components";
import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import toast, { Toaster } from "react-hot-toast";
import { collectionsState, itemsState } from "../atoms/atoms";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Bin = () => {
  const [items, setItems] = useRecoilState(itemsState);
  const [reversedBinItems, setReversedBinItems] = useState([]);

  useEffect(() => {
    const binItems = items.filter((item) => item.deleted);
    setReversedBinItems(binItems.slice().reverse());
  }, [items]);

  return (
    <div className="flex flex-col w-3/5 h-full gap-5 p-5">
      <SearchBar
        onchange={(e) => {
          const binItems = items.filter((item) => item.deleted);
          setReversedBinItems(binItems.slice().reverse());
          setReversedBinItems((prev) =>
            prev.filter((item) => item.name.includes(e.target.value))
          );
        }}
      />
      <div className="w-full p-5 bg-white rounded-xl grow">
        <div className="flex items-center justify-between mb-5">
          <h2 className="relative inline-flex items-center gap-2 text-2xl font-medium text-gray-600">
            Bin
          </h2>
          <div className="flex gap-3">
            <div
              onClick={async () => {
                const toastId = toast.loading("Restoring All...");
                try {
                  const response = await axios.put(
                    `${BACKEND_URL}/restoreAll`,
                    {
                      token: localStorage.getItem("token"),
                    }
                  );
                  setItems((prev) =>
                    prev.map((item) =>
                      item.deleted ? { ...item, deleted: false } : item
                    )
                  );
                  toast.success("Successfully restored all files", {
                    id: toastId,
                  });
                } catch (error) {
                  toast.error("Failed to restore", { id: toastId });
                }
              }}
              className="text-gray-600 cursor-pointer active:text-green-600"
              title="Restore All"
            >
              <TbRestore size={25} />
            </div>
            <div
              onClick={async () => {
                const toastId = toast.loading("Emptying Bin...");
                try {
                  const response = await axios.put(`${BACKEND_URL}/emptyBin`, {
                    token: localStorage.getItem("token"),
                  });
                  setItems((prev) => prev.filter((item) => !item.deleted));
                  toast.success("Successfully emptied bin", { id: toastId });
                } catch (error) {
                  toast.error("Failed to empty bin", { id: toastId });
                }
              }}
              className="text-gray-600 cursor-pointer active:text-red-600"
              title="Empty Bin"
            >
              <MdDelete size={25} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-5">
          {reversedBinItems.map((file, index) => (
            <Item key={index} file={file} collectionName={"Bin"} />
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};
