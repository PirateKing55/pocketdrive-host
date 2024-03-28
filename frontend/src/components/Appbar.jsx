import { Avatar } from "./Avatar";
import { Logout } from "./Logout";
import Hamburger from "hamburger-react";
import { useState } from "react";

export const Appbar = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="absolute flex items-center justify-center gap-5 top-5 right-5">
      <Avatar />
      <Logout />
      <Hamburger toggled={isOpen} toggle={setOpen} />
    </div>
  );
};
