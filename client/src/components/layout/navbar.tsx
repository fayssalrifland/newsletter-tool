import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  
  const links = [
    { href: "/", label: "Filter Newsletter" },
    { href: "/fill-email", label: "Fill Email" },
    { href: "/connect-emails", label: "Connect Emails" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex space-x-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    location === link.href
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
