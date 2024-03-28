import { IoSearch } from "react-icons/io5";

export const SearchBar = ({ onchange }) => {
  return (
    <div className="flex h-12 gap-4 rounded-3xl bg-white justify-center items-center px-5 ">
      <IoSearch />
      <input
        type="text"
        className="w-full rounded-xl h-12 border-none focus:border-transparent focus:outline-none"
        placeholder="Search in Pocket-Drive"
        onChange={onchange}
      ></input>
    </div>
  );
};
