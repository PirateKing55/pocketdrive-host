export const InputBox = ({ label, placeholder, onchange, type }) => {
  return (
    <div>
      <h2 className="text-lg text-[#292929] mb-[5px] font-semibold">{label}</h2>
      <input
        className="w-full h-10 border-2 rounded p-[5px] border-[#eaeaec] mb-[15px]"
        placeholder={placeholder}
        type={type || "text"}
        onChange={onchange}
      ></input>
    </div>
  );
};
