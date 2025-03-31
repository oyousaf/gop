import Image from "next/image";
import { PiMosqueFill } from "react-icons/pi";

export const navLinks = [
  { id: "home", name: "Home", href: "/hero" },
  { id: "makkah", name: "🕋", href: "/makkah" },
  { id: "madinah", name: "🕌", href: "/madinah" },
  { id: "aqsa", name: <PiMosqueFill />, href: "/aqsa" },
  { id: "hadith", name: "Hadith", href: "/hadith" },
  { id: "news", name: "News", href: "/news" },
  {
    id: "divestment",
    name: (
      <Image
        src="/images/palestineflag.png"
        alt="Palestine Flag"
        width={30}
        height={30}
        className="object-contain w-auto h-auto"
      />
    ),
    href: "/divestment",
  },
];

import { BsTwitterX, BsYoutube } from "react-icons/bs";

export const socialLinks = [
  {
    name: "Twitter",
    icon: <BsTwitterX size={30} />,
    url: "https://twitter.com/oyousaf_",
  },
  {
    name: "YouTube",
    icon: <BsYoutube size={30} />,
    url: "https://www.youtube.com/@oyousaf_",
  },
];

export const boycott = [
  { name: "5 Star Chocolate", reason: "Owned by Cadbury." },
  { name: "7Days", reason: "Owned by Mondalez." },
  { name: "7Up", reason: "Owned by Pepsi." },
  { name: "Apple", reason: "Has R&D centers in the country." },
  { name: "AirBnb", reason: "Enabled listings in occupied areas." },
  { name: "AMD", reason: "Collaborates with Israel in AI." },
  { name: "Arsenal FC", reason: "Partnerships and sponsorships involving Israeli companies and organizations." },
  { name: "ALDO", reason: "Has business operations in Israel." },
  { name: "Arket", reason: "Owned by H&M." },
  { name: "Axe", reason: "Owned by Unilever." },
  { name: "Adobe", reason: "Operates research and development centers in Israel." },
  { name: "Adidas", reason: "Has business operations in Israel." },
  { name: "ASDA", reason: "Owned by Walmart, known to sell products sourced from Israel." },
  { name: "Aquafina", reason: "Owned by PepsiCo." },
  { name: "Amika", reason: "Manufactured on occupied Palestinian land." },
  { name: "Activia", reason: "Parent company Danone is an active Israeli food start-up investor." },
  { name: "Amana Tool", reason: "Made in Israel." },
  { name: "Azrieli Group", reason: "An Israeli real estate and holding company." },
  { name: "American Eagle", reason: "Supported Israel by showing the flag in Times Square advertisement." },
  { name: "Amazon", reason: "Partnerships with Israeli tech companies." },
  { name: "Ahava", reason: "An Israeli skincare company." },
  { name: "AXA", reason: "Has a presence in Israel through investments and insurance services." },
  { name: "Audi", reason: "Vehicles are sold and serviced through authorized dealerships in Israel." },
  { name: "Bvlgari", reason: "Parent company LVMH invests heavily in Israel." },
  { name: "Barclays", reason: "Funding billions in arms." },
  { name: "Boeing", reason: "Supplies Israel with Hellfire missiles." },
  { name: "Burger King", reason: "Has a presence in Israel." },
  { name: "Coca-Cola", reason: "Operates a factory in the illegal Israeli settlement of Atarot." },
  { name: "Costa Coffee", reason: "Posted social media support." },
  { name: "Caterpillar", reason: "Caterpillar equipment is widely used in Israel." },
  { name: "Chanel", reason: "Pledged $4m donation to Israel." },
  { name: "CyberArk", reason: "Owned by Israeli founders." },
  { name: "DHL Group", reason: "Company with operations in Israel." },
  { name: "Disney", reason: "Pledged $2m and further initiatives to support Israel." },
  { name: "Domino’s", reason: "Donating food to Israeli soldiers." },
  { name: "Estee Lauder", reason: "Owners are the president of World Jewish Congress." },
  { name: "Elbit Systems", reason: "Electronics company headquartered in Israel." },
  { name: "Facebook (Meta)", reason: "Has been censoring neutral content." },
  { name: "Ferrero Rocher", reason: "Has based its headquarters for Asia in Holon, Israel." },
  { name: "Fiverr", reason: "An Israeli company." },
  { name: "Fox News", reason: "Biased news reporting." },
  { name: "General Motors", reason: "Operations and partnerships in Israel." },
  { name: "Google", reason: "Accused of giving data and providing support." },
  { name: "H&M", reason: "Encouraging and legitimizing military." },
  { name: "Intel", reason: "Significant investments in Israel, totaling more than $50 billion." },
  { name: "Instagram", reason: "Platform under Meta." },
  { name: "IKEA", reason: "Donated $1.1 million to Israel." },
  { name: "Johnson & Johnson", reason: "Acquires Israeli start-ups for billions of dollars." },
  { name: "Kinder Bueno", reason: "Owned by Ferrero Group." },
  { name: "Louis Vuitton", reason: "Owned by LVMH." },
  { name: "LVMH", reason: "Owned by Bernard Arnault." },
  { name: "Nestlé", reason: "Invests in Israeli food start-ups." },
  { name: "Nike", reason: "Invests in Israeli synthetic spidersilk startup." },
  { name: "PepsiCo", reason: "Major investor in Israeli companies." },
  { name: "Samsung", reason: "Has R&D centers in Israel." },
  { name: "Starbucks", reason: "Howard Schultz, the former CEO, has openly supported Israel." },
  { name: "Walmart", reason: "Sources products from Israel." },
]