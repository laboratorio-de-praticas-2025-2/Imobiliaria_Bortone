export default function Body({children, title}) {
  return (
    <div className="h-full">
      <div className=" h-[30vh] w-full bg-[var(--secondary)] flex p-16 items-center text-white font-bold text-3xl">
        <p className="pb-10">{title}</p>
      </div>
      <div className="px-5 mt-[-9vh] flex items-center justify-center w-full">
       {children}
      </div>
    </div>
  );
}
