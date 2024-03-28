import { Item } from "../components";
import { FaPlus } from "react-icons/fa6";
import { SearchBar } from "../components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { itemsState } from "../atoms/atoms";

export const Home = () => {
  const name = localStorage.getItem("name");
  const [items, setItems] = useRecoilState(itemsState);
  const [reversedRecentUploads, setReversedRecentUploads] = useState([]);

  useEffect(() => {
    setReversedRecentUploads(items.slice().reverse());
  }, [items]);

  useEffect(() => {
    axios
      .post(`${BACKEND_URL}/getAllFiles`, {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        setItems(res.data);
        setReversedRecentUploads(res.data.slice().reverse());
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        toast.error("Failed to fetch files");
      });
  }, []);

  const gradientText = (text) => {
    const firstName = text.split(" ")[0];
    return (
      <span
        className="text-5xl font-semibold text-transparent bg-clip-text"
        style={{
          backgroundImage: `linear-gradient(to right, #5080ed, #bb6c9f, #d56675)`,
          backgroundSize: "100% 100%",
          animation: "gradientAnimation 5s ease-in-out infinite alternate",
        }}
      >
        Hello,{" "}
        {firstName[0].toUpperCase() + firstName.slice(1, firstName.length)}
      </span>
    );
  };

  return (
    <div className="flex flex-col w-3/5 h-full gap-5 p-5">
      <SearchBar
        onchange={(e) => {
          setReversedRecentUploads(items.slice().reverse());
          setReversedRecentUploads((prev) =>
            prev
              .filter((item) => !item.deleted) // Filter out deleted items first
              .filter((item) => item.name.includes(e.target.value))
          );
        }}
      />
      <div className="w-full px-10 py-5 bg-white rounded-xl grow">
        <h1 className="mb-2 text-5xl font-bold">{gradientText(name)}</h1>
        <h1 className="text-5xl font-semibold mb-10 text-[#b8b9b8]">
          What do you want to store today?
        </h1>
        <h2 className="mb-5 text-2xl font-medium text-gray-600">
          Your recent uploads:
        </h2>
        <div className="flex flex-wrap gap-5">
          {reversedRecentUploads.map((file) => {
            if (!file.deleted) {
              return <Item key={file.id} file={file} />;
            } else {
              return null;
            }
          })}
          {/* <button className="flex rounded-md bg-[#fbfbfb] justify-center items-center w-36 h-36 text-5xl text-[#c8c7c7] active:border-2 active:border-black">
            <FaPlus />
          </button> */}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
