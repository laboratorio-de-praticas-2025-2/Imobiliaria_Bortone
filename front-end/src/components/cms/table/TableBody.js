export default function TableBody({children, table=false}) {
  return (
    <div
      className={`bg-[#E5E5E5] shadow-md w-full ${
        table ? "" : "px-7 pt-7"
      }`}
    >
      {children}
    </div>
  );
}
