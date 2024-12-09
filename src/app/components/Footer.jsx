import { useEffect, useState } from "react";
import moment from "moment-hijri"; 
import { socialLinks } from "../utils/constants";

moment.locale("ar"); 

const getIslamicDate = () => {
  const islamicDate = moment().format('iD iMMMM iYYYY');
  return islamicDate;
};

export default function Footer() {
  const [islamicDate, setIslamicDate] = useState("");

  useEffect(() => {
    setIslamicDate(getIslamicDate());
  }, []);

  return (
    <footer className="py-8 bg-background text-white text-center">
      <p className="text-2xl mb-2">
        &copy; {new Date().getFullYear()} حدائق الجنة
      </p>
      <p className="text-xl mb-2">All Rights Reserved</p>
      <p className="text-2xl mb-6">{islamicDate}</p>

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
