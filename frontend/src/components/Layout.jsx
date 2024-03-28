import { SidebarWrapper } from "./SidebarWrapper";
import { Appbar } from "./Appbar";
import { useState, useEffect } from "react";

export const Layout = ({ children }) => {
  return (
    <div className="relative flex bg-[#f9fbfd] h-screen">
      <Appbar />
      <SidebarWrapper />
      {children}
      {/* {children && React.cloneElement(children, { state, setState })} */}
    </div>
  );
};
