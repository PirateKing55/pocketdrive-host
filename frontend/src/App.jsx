import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarWrapper, Layout, Appbar } from "./components";
import { Home, Collection, Signup, Signin, Bin } from "./pages";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { collectionsState, collectionsStateFamily } from "./atoms/atoms";

function App() {
  const collections = useRecoilValue(collectionsState);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/bin"
            element={
              <div className="flex bg-[#f9fbfd] h-screen">
                <Layout>
                  <Bin />
                </Layout>
              </div>
            }
          />
          <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          {collections.length > 0 &&
            collections.map((collection, index) => (
              <Route
                key={index}
                path={`/collections/${collection.collectionName
                  .split(" ")
                  .join("-")}`}
                element={
                  <div className="flex bg-[#f9fbfd] h-screen">
                    <Layout>
                      <Collection name={collection.collectionName} />
                    </Layout>
                  </div>
                }
              />
            ))}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
