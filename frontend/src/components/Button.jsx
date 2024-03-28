export const Button = ({ label, onclick }) => {
  return (
    <div className="mt-[10px]">
      <button
        className="w-full h-10 text-lg border border-transparent rounded mt-5 bg-[#292929] text-white hover:bg-opacity-95 focus:border-transparent focus:ring-0 active:border-text"
        onClick={onclick}
      >
        {label}
      </button>
    </div>
  );
};
