import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { MdHome } from "react-icons/md";
import { BiSolidCollection } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import toast, { Toaster } from "react-hot-toast";
import {
  collectionsState,
  initialCollectionsState,
  itemsState,
} from "../atoms/atoms";
import { BACKEND_URL } from "../config";
import { FileUploadComponent } from "./FileUploadComponent";

export const SidebarWrapper = () => {
  const [newCollectionName, setNewCollectionName] = useState("New Collection");
  const [collapsed, setCollapsed] = useState(false);
  const collections = useRecoilValue(collectionsState);
  const setCollections = useSetRecoilState(collectionsState);
  const setInitialCollections = useSetRecoilState(initialCollectionsState);
  const items = useRecoilValue(itemsState);
  const itemRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(`${BACKEND_URL}/getAllCollections`, {
          token: token,
        })
        .then((response) => {
          setCollections(response.data);
        });
    }
  }, [items]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(`${BACKEND_URL}/getAllCollections`, {
          token: token,
        })
        .then((response) => {
          setInitialCollections(response.data);
        });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // collections.forEach((collection) => {
  //   const setCollectionSingle = useRecoilValue(
  //     collectionsStateFamily(collection.collectionName)
  //   );
  //   setCollectionSingle(collection);
  // });

  return (
    <Sidebar
      collapsed={collapsed}
      collapsedWidth={"50px"}
      // toggled={true}
      // breakPoint={"md"}
      g={{
        [`.${sidebarClasses.container}`]: {
          height: "100vh",
          borderWidth: "0px",
          position: "relative",
          backgroundColor: "#f9fbfd",
        },
      }}
    >
      <h1
        className="pl-8 text-3xl font-bold text-transparent bg-clip-text pt-7"
        style={{
          backgroundImage: `linear-gradient(to right, #5080ed, #bb6c9f, #d56675)`,
          backgroundSize: "100% 100%",
          animation: "gradientAnimation 5s ease-in-out infinite alternate",
        }}
      >
        {collapsed ? "P" : "Pocket-Drive"}
      </h1>
      <FileUploadComponent collapsed={collapsed} />
      <input type="file" placeholder="NEW" style={{ display: "none" }}></input>
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: "#020917",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <MenuItem
          component={<Link to="/home" />}
          icon={<MdHome />}
          rootStyles={{ ".ps-menu-button": { paddingLeft: "0px" } }}
        >
          {" "}
          Home{" "}
        </MenuItem>
        <SubMenu label="Collections" icon={<BiSolidCollection />}>
          {collections.map((collection, index) => {
            if (
              collection.collectionName === "Favourites" ||
              collection.collectionName === "Bin"
            )
              return null;
            return (
              <MenuItem
                key={index}
                component={
                  <Link
                    to={`/collections/${collection.collectionName
                      .split(" ")
                      .join("-")}`}
                  />
                }
              >
                {" "}
                {collection.collectionName}{" "}
              </MenuItem>
            );
          })}
          <MenuItem>
            <div className="flex items-center gap-2">
              <input
                placeholder="+ New Collection"
                className="p-1 border-none rounded w-36 focus:border-transparent focus:outline-none"
                onChange={(e) => setNewCollectionName(e.target.value)}
                ref={itemRef}
              ></input>
              <button
                className="flex items-center justify-center w-8 h-8 border-2 rounded border-slate-300 active:border-black"
                onClick={async () => {
                  const toastId = toast.loading("Creating collection");
                  try {
                    const response = await axios.post(
                      `${BACKEND_URL}/createCollection`,
                      {
                        token: localStorage.getItem("token"),
                        collectionName: newCollectionName,
                      }
                    );
                    setCollections(response.data);
                    itemRef.current.value = "";
                    toast.success("Collection created", {
                      id: toastId,
                    });
                  } catch (error) {
                    if (error.response) {
                      return toast.error(error.response.data.message, {
                        id: toastId,
                      });
                    } else if (error.request) {
                      return toast.error("No Response Received", {
                        id: toastId,
                      });
                    } else {
                      return toast.error("Request Error:" + error.message, {
                        id: toastId,
                      });
                    }
                  }
                }}
              >
                <TiTick />
              </button>
              <Toaster />
            </div>
          </MenuItem>
        </SubMenu>
        <MenuItem
          component={<Link to="/collections/Favourites" />}
          icon={<IoIosHeart />}
        >
          {" "}
          Favourites{" "}
        </MenuItem>
        <MenuItem component={<Link to="/Bin" />} icon={<RiDeleteBin7Fill />}>
          {" "}
          Bin{" "}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
