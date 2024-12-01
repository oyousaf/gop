import { useEffect, useState } from "react";
import { socialLinks } from "../utils/constants";

const getIslamicDate = () => {
  const islamicDate = new Date().toLocaleDateString("en-GB-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return islamicDate;
};

export default function Footer() {
  const [islamicDate, setIslamicDate] = useState("");

  useEffect(() => {
    setIslamicDate(getIslamicDate());
  }, []);

  return (
    <footer className="py-8 bg-background text-white text-center">
      <p className="text-lg mb-2">
        &copy; {new Date().getFullYear()} حدائق الجنة - All Rights Reserved
      </p>
      <p className="text-sm mb-6">{islamicDate}</p>

      <div className="flex justify-center space-x-6">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl transition-transform transform hover:scale-110"
            aria-label={`Follow us on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
