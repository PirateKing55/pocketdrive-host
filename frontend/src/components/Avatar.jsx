export const Avatar = () => {
  const name = localStorage.getItem("name");
  return (
    <div className="flex items-center justify-center bg-white rounded-full w-14 h-14">
      <span className="text-3xl font-semibold text-gray-600">
        {name[0].toUpperCase()}
      </span>
    </div>
  );
};
