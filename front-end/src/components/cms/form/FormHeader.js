"use client";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

export default function FormHeader({ href }) {
  return (
    <div className="w-full flex items-center px-10 py-5 bg-[var(--primary)] rounded-t-4xl">
      <Link
        href={href}
        className="text-white"
      >
        <IoArrowBackOutline size={25}/>
      </Link>
    </div>
  );
}
