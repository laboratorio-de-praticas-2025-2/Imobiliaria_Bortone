import Link from "next/link";
import sidebarLinks from "./SidebarLinks";

export default function SidebarNav() {
  return (
    <nav className="mt-10 flex flex-col gap-2 text-white font-medium">
      <h2 className="text-2xl !font-extrabold mb-4 px-6">Navegação</h2>
      {sidebarLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="md:hover:bg-white md:hover:text-[#2E3F7C] md:text-white hover:bg-[var(--primary)] hover:text-white text-[var(--primary)] md:px-6 px-14 py-3"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
