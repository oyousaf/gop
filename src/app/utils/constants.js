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
  {
    name: "Accenture",
    reason: "Has a presence in Israel with offices in the country.",
  },
  {
    name: "Activia",
    reason:
      "Parent company Danone is an active Israeli food start-up investor.",
  },
  {
    name: "Adobe",
    reason: "Operates research and development centres in Israel.",
  },
  { name: "AdeS", reason: "Beverage brand owned by Coca-Cola." },
  { name: "AdExtent", reason: "Company based in Tel Aviv, Israel." },
  { name: "Adidas", reason: "Has business operations in Israel." },
  { name: "Aesop", reason: "Is a brand of L’Oreal." },
  { name: "Ahava", reason: "Is an Israeli skincare company." },
  { name: "AirBnb", reason: "Enabled listings in occupied areas." },
  { name: "Aldi", reason: "Has business operations in Israel." },
  { name: "ALDO", reason: "Has business operations in Israel." },
  { name: "Amazon", reason: "Partnerships with Israeli tech companies." },
  { name: "AMD", reason: "Collaborates with Israel in AI." },
  { name: "Amana Tool", reason: "Made in Israel." },
  { name: "Amika", reason: "Manufactured on occupied Palestinian land." },
  {
    name: "American Airlines",
    reason: "Routes between major US cities and Tel Aviv.",
  },
  {
    name: "American Eagle",
    reason: "Supported Israel by showing the flag in the Times Square advert.",
  },
  {
    name: "American Express",
    reason:
      "Providing financial services and credit card facilities to Israeli consumers and businesses.",
  },
  { name: "Anita Gelato", reason: "Company based in Israel." },
  { name: "Apple", reason: "Have R&D centres in the country." },
  { name: "Aquaﬁna", reason: "Owned by PepsiCo." },
  { name: "Aquarius", reason: "Brand owned by Coca-Cola." },
  { name: "Arket", reason: "Owned by H&M." },
  {
    name: "Arsenal FC",
    reason:
      "Partnerships and sponsorships involving Israeli companies and organisations.",
  },
  { name: "Ariel", reason: "Owned by Procter & Gamble (P&G)." },
  {
    name: "Asda",
    reason: "Owned by Walmart, known to sell products sourced from Israel.",
  },
  {
    name: "Asics",
    reason: "Invests in Israeli synthetic spider silk start-up.",
  },
  {
    name: "Audi",
    reason:
      "Vehicles are sold and serviced through authorised dealerships in Israel.",
  },
  {
    name: "Axel Springer",
    reason:
      "Company’s founder, Axel Springer, was known for his support of Israel.",
  },
  {
    name: "AXA",
    reason:
      "Has a presence in Israel through its investments and insurance services.",
  },
  { name: "Axe", reason: "Owned by Unilever." },
  {
    name: "Azrieli Group",
    reason: "An Israeli real estate and holding company.",
  },
  { name: "Bain & Company", reason: "Has an office in Tel Aviv." },
  { name: "Bank Hapoalim", reason: "One of the largest banks in Israel." },
  { name: "Bank Leumi", reason: "One of the largest banks in Israel." },
  { name: "Bank of America", reason: "Invests in Israeli companies." },
  {
    name: "Barclays",
    reason:
      "Provides financial services and has investment activities in Israel.",
  },
  { name: "Barclays Bank", reason: "Funding billions in arms." },
  { name: "Barq’s", reason: "A root beer brand owned by Coca-Cola." },
  {
    name: "Bath & Body Works",
    reason:
      "Owner Les Wexner is an Israeli ally, having long-term business with Jeffrey Epstein.",
  },
  {
    name: "Bayer",
    reason:
      "Operates in the Israeli market through its pharmaceuticals and crop science.",
  },
  { name: "Bershka", reason: "A fashion brand under the INDITEX Group." },
  { name: "Biotherm", reason: "Owned by L’Oréal." },
  { name: "Bimbo", reason: "Invests in Israeli start-ups." },
  {
    name: "BlackRock",
    reason:
      "Debuted an ETF for European investors to directly access Israel’s Tel Aviv 25 stock index.",
  },
  {
    name: "Bloomberg",
    reason: "Provides financial data and news services to Israeli markets.",
  },
  { name: "Boeing", reason: "Supplies Israel with Hellfire missiles." },
  { name: "Bomaja", reason: "Supports Israel." },
  {
    name: "Booking.com",
    reason: "Allows listings in occupied Palestinian territory.",
  },
  {
    name: "Booz Allen Hamilton",
    reason: "Management & IT consulting firm with operations in Israel.",
  },
  {
    name: "Boston Consulting Group (BCG)",
    reason: "Providing consulting services to various Israeli businesses.",
  },
  { name: "Brooke Bond", reason: "Owned by Unilever." },
  {
    name: "Bristol Myers Squibb",
    reason: "Vanguard is the major shareholder.",
  },
  { name: "BMW", reason: "Open support for Israel." },
  { name: "Bulgari", reason: "Parent company LVMH invests heavily in Israel." },
  { name: "Burger King", reason: "Has a presence in Israel." },
  { name: "Burger Rings", reason: "Owned by PepsiCo." },
  { name: "Cappy", reason: "Owned by Coca-Cola." },
  {
    name: "Capital One",
    reason:
      "Has ties with Israel through a $500m loan deal with Elbit Systems Ltd, an Israeli weapons manufacturer.",
  },
  {
    name: "Capri Holdings",
    reason: "Parent company of Michael Kors, Jimmy Choo, and Versace.",
  },
  { name: "Carita Paris", reason: "Owned by L'Oreal Paris." },
  { name: "Carrefour", reason: "Made huge investments into Israel." },
  { name: "Carmel Agrexco", reason: "An Israeli agricultural export company." },
  {
    name: "Caterpillar",
    reason: "Caterpillar equipment is widely used in Israel.",
  },
  { name: "Celine", reason: "Owned by LVMH/Bernard Arnault." },
  { name: "CeraVe", reason: "Is owned by L’Oréal." },
  { name: "Cerelac", reason: "Owned by Nestlé." },
  { name: "Champion", reason: "Collaborated with Coca-Cola." },
  { name: "Chanel", reason: "Pledged $4M donation to Israel." },
  {
    name: "Chapman and Cutler",
    reason: "Law firm represents Israel-based fintechs.",
  },
  { name: "Cheerios", reason: "Owned by Nestlé." },
  { name: "Cheetos", reason: "Owned by PepsiCo." },
  {
    name: "Check Point Software Technologies",
    reason: "Headquartered in Tel Aviv.",
  },
  { name: "Chips Ahoy!", reason: "Owned by Mondelez." },
  { name: "Cinnabon", reason: "Owned by Bimbo." },
  { name: "Citi Bank", reason: "Investments in the Israeli tech sector." },
  {
    name: "Clal Insurance Enterprises",
    reason: "Insurance company headquartered in Tel Aviv.",
  },
  { name: "Clean & Clear", reason: "Brand of Johnson & Johnson." },
  { name: "Clear Blue", reason: "Is owned by Procter and Gamble." },
  {
    name: "Clinique",
    reason:
      "Founder Ronald Lauder is the president of the World Jewish Congress, and chairman of the Jewish National Fund.",
  },
  { name: "Close Up", reason: "Toothpaste brand owned by Unilever." },
  { name: "Cisco", reason: "Major investments in Israeli cybersecurity." },
  { name: "Coach", reason: "Luxury fashion brand owned by Tapestry, Inc." },
  {
    name: "Coca-Cola",
    reason: "Operates a factory in the illegal Israeli settlement of Atarot.",
  },
  { name: "Coffee Mate", reason: "Owned by Nestlé." },
  { name: "Colgate", reason: "Owned by Palmolive." },
  { name: "Comcast", reason: "Donated over $2 million of aid to the IDF." },
  {
    name: "Conde Nast",
    reason: "CEO Stan Duncan supported openly, as mentioned in NYT.",
  },
  { name: "Converse", reason: "Owned by Nike." },
  { name: "Cornetto", reason: "Ice cream brand owned by Wall’s/Unilever." },
  { name: "Costa Coffee", reason: "Posted social media support for Israel." },
  { name: "Côte d’Or", reason: "Chocolate brand owned by Mondelez." },
  { name: "Crest", reason: "Brand owned by Procter & Gamble." },
  {
    name: "Crowne Plaza",
    reason:
      "Connections with Israel and a cessation of weapons and defence trading.",
  },
  {
    name: "Curseforge",
    reason:
      "Overwolf, the parent company of CurseForge, funds the revenue generated from mods to the Israeli defence Forces.",
  },
  {
    name: "CyberArk",
    reason: "Cybersecurity company headquartered in Israel.",
  },
  { name: "Daim Bar", reason: "Owned by Mondelez." },
  { name: "Daimler", reason: "Company with R&D in Tel Aviv." },
  { name: "Dairy Milk", reason: "Owned by Cadbury." },
  { name: "Dasani", reason: "Is a brand of Coca-Cola." },
  { name: "Decathlon", reason: "Company operates stores in Israel." },
  { name: "Del Valle", reason: "Owned by Coca-Cola." },
  { name: "Delilah", reason: "Is an Israeli dates brand." },
  {
    name: "Dell",
    reason: "Founder of Dell is a member of the Friends of the IDF.",
  },
  { name: "Delta Galil Industries", reason: "Israeli-based company" },
  { name: "Dettol", reason: "Is a brand of Reckitt Benckiser (RB)." },
  {
    name: "Deutsche Telekom",
    reason: "Invests in Israeli software company Teridion.",
  },
  { name: "DeviantArt", reason: "Based in Tel Aviv." },
  { name: "DHL Group", reason: "Company with operations in Israel." },
  { name: "Dior", reason: "Owner of Dior’s parent company, LVMH." },
  {
    name: "Disney",
    reason: "Pledging $2m and further initiatives to support Israel.",
  },
  { name: "DLA Piper", reason: "Provides law firm services to Israel." },
  { name: "Domestos", reason: "Owned by Unilever." },
  { name: "Domino’s", reason: "Donating food to Israeli soldiers." },
  { name: "Doritos", reason: "Is a brand of PepsiCo." },
  { name: "Downy", reason: "Owned by Procter and Gamble." },
  { name: "Dr. Fischer", reason: "Headquartered in Israel." },
  { name: "Dr Pepper", reason: "Owned by the Reimann family." },
  { name: "Dreyer’s Grand Ice Cream", reason: "Owned by Nestlé." },
  { name: "DKNY", reason: "Held an IOF Fundraiser in NYC." },
  { name: "Doctor Or", reason: "Headquartered in Israel." },
  { name: "Eli Lilly", reason: "Donated three ICUs to Israel." },
  { name: "El Al Airlines", reason: "Official airline of Israel." },
  {
    name: "Elbit Systems",
    reason: "Electronics company headquartered in Israel.",
  },
  { name: "Elie Tahari", reason: "Founder lives in Israel." },
  { name: "Elementor", reason: "An Israeli company." },
  { name: "EPAM Systems", reason: "Acquires Israel-based start-ups." },
  { name: "Ericsson", reason: "Provides 5G to Israel." },
  {
    name: "Estee Lauder",
    reason: "Owners are the president of the World Jewish Congress.",
  },
  {
    name: "Eucerin",
    reason: "Owned by Beiersdorf Group, which supports Israel.",
  },
  {
    name: "Evian",
    reason: "Owner of Evian, Danone, invests millions in Israel.",
  },
  { name: "Expedia", reason: "Profiting from Israeli settlements." },
  { name: "Fancy Medjoul", reason: "Date company with operations in Israel." },
  { name: "Fanta", reason: "Owned by Coca-Cola." },
  { name: "Fairlife", reason: "Owned by Coca-Cola." },
  { name: "Facebook (Meta)", reason: "Has been censoring neutral content." },
  {
    name: "Ferrero Rocher",
    reason: "Has based its headquarters for Asia in Holon, Israel.",
  },
  {
    name: "Fila",
    reason:
      "The technical sponsor of Maccabi Tel Aviv FC, an Israeli football club, since 2019.",
  },
  {
    name: "First International Bank of Israel",
    reason: "Headquartered in Israel.",
  },
  { name: "Fiverr", reason: "Israeli company." },
  {
    name: "FlixBus",
    reason: "CEO André Schwämmlein voiced support for Israel.",
  },
  { name: "Food to Live", reason: "Sells Israeli dates." },
  {
    name: "Foods Alive",
    reason: "Sells Israeli organic black cumin seed oil.",
  },
  { name: "Fox Corp", reason: "Parent company of Fox News." },
  { name: "Fox News", reason: "Biased reporting and support for Israel." },
  { name: "Fred Joaillier (Fred Jewellery)", reason: "Owned by LVMH." },
  { name: "Frito-Lay (Fritos, Lay's, Cheetos)", reason: "Snack brand owned by PepsiCo." },
  { name: "Funyuns", reason: "Owned by PepsiCo." },
  { name: "Fuze", reason: "Owned by Coca-Cola." },
  {
    name: "Gatorade",
    reason: "Owned by PepsiCo with no direct ties to Israel.",
  },
  {
    name: "Gamida Cell",
    reason: "Biopharmaceutical company headquartered in Israel.",
  },
  {
    name: "GA-DE Cosmetics",
    reason: "Cosmetics brand headquartered in Israel.",
  },
  { name: "Galaxy Chocolate", reason: "A chocolate brand owned by Mars, Inc." },
  { name: "Garnier", reason: "Owned by L’Oréal." },
  {
    name: "General Catalyst",
    reason: "Provide support for the state of Israel and its tech community.",
  },
  {
    name: "General Electric (GE)",
    reason: "Operations and partnerships in Israel.",
  },
  { name: "General Motors", reason: "Operations and partnerships in Israel." },
  { name: "Genesys", reason: "Has an official presence in Israel." },
  { name: "Givenchy", reason: "Owned by LVMH." },
  { name: "Gold Peak", reason: "Owned by Coca-Cola." },
  { name: "Google", reason: "Accused of giving data and providing support." },
  { name: "Grandma’s Cookies", reason: "Owned by Frito-Lay/PepsiCo." },
  { name: "Guerlain", reason: "Owned by LVMH." },
  { name: "H&M", reason: "Encouraging and legitimizing military." },
  {
    name: "Hadiklaim",
    reason: "Date growers cooperative headquartered in Israel.",
  },
  {
    name: "Harel Insurance Investment & Financial Services",
    reason: "Insurance company headquartered in Israel.",
  },
  { name: "Head & Shoulders", reason: "Owned by Procter & Gamble." },
  { name: "Healthy Heights", reason: "Owned by Jewish interests." },
  {
    name: "Henkel",
    reason: "Investing in Israeli technology by backing Feelit.",
  },
  { name: "Hostess", reason: "Owned by Bimbo." },
  { name: "Hotstar", reason: "Streaming service owned by Disney." },
  {
    name: "HP (Hewlett-Packard)",
    reason:
      "Contracted by the Israel Police to provide Data centre Care services.",
  },
  {
    name: "HSBC",
    reason: "Invests in companies selling arms and military equipment.",
  },
  {
    name: "Huggies",
    reason:
      "Founding company Kimberly-Clark received the Jubilee Award by the Israeli Prime Minister Netanyahu.",
  },
  { name: "Hulu", reason: "Broadcasts pro-Israeli adverts." },
  {
    name: "Hyundai",
    reason: "Heavy machinery has been used in the demolition in Jerusalem.",
  },
  {
    name: "IBM",
    reason: "Involvements in Israeli security and military apparatus.",
  },
  { name: "ICL Group", reason: "Israeli multinational manufacturing company." },
  { name: "IKEA", reason: "Donated $1.1 million to Israel." },
  {
    name: "Inditex Group",
    reason:
      "Parent company of brands like Zara, with stores and operations in Israel.",
  },
  { name: "Innocent Smoothies", reason: "Owned by Coca-Cola company." },
  {
    name: "Insight Partners",
    reason: "Venture capital firm with investments in Israeli tech companies.",
  },
  {
    name: "Instagram",
    reason:
      "Platform under Meta, accused of censoring pro-Palestinian content.",
  },
  {
    name: "Intel",
    reason:
      "Significant investments in Israel, totaling more than $50 billion.",
  },
  { name: "Irish Spring", reason: "Owned by Colgate-Palmolive." },
  { name: "IT Cosmetics", reason: "Owned by L’Oréal." },
  { name: "J Street", reason: "Lobbying for Israel." },
  {
    name: "Jaguar",
    reason: "Partners with TCS to open Innovation Programme in Israel.",
  },
  { name: "Jazwares", reason: "Donated to Magen David Adom in Israel." },
  { name: "Jefferies", reason: "Leading advisor to Israeli companies." },
  {
    name: "Johnson & Johnson",
    reason: "Acquires Israeli start-ups for billions of dollars.",
  },
  { name: "Just Beauty", reason: "Owners are funding." },
  {
    name: "Kate Spade",
    reason: "Luxury fashion brand owned by Tapestry, Inc.",
  },
  {
    name: "Karsten Farms",
    reason:
      "Has severed its relations with the Israeli cooperative, Hadiklaim.",
  },
  {
    name: "Kaufland",
    reason: "Owner to invest millions in Israeli technologies.",
  },
  { name: "Keebler", reason: "Owned by Kellogg’s." },
  {
    name: "Kellogg’s",
    reason: "Has provided with $3.8 billion in annual military aid since 2016.",
  },
  { name: "Kenneth Cole", reason: "Supports Israel in new TV commercial." },
  {
    name: "Kenon Holdings",
    reason: "A power generation company with facilities in Israel.",
  },
  { name: "Kenzo", reason: "Owned by LVMH, Bernard Arnault." },
  { name: "Kerastase", reason: "Owned by L’Oréal." },
  { name: "Kevita", reason: "Drink brand owned by PepsiCo." },
  {
    name: "KFC",
    reason: "Founding company Yum Brands is an investor in Israeli start-ups.",
  },
  { name: "Kinder Bueno", reason: "Owned by Ferrero Group." },
  { name: "King Solomon", reason: "Is an Israeli brand." },
  {
    name: "Kimberly Clark",
    reason:
      "Received the Jubilee Award by the Israeli Prime Minister Netanyahu.",
  },
  { name: "Kirks", reason: "Soft drink brand owned by Coca-Cola." },
  { name: "Kleenex", reason: "Owned by Kimberly Clark." },
  { name: "KKR", reason: "Made three investments in Israeli tech companies." },
  { name: "KKW Cosmetics", reason: "Owned by Kim Kardashian." },
  {
    name: "Kinley Water",
    reason: "A brand of bottled water owned by Coca-Cola.",
  },
  { name: "Kitkat", reason: "Owned by Nestle." },
  { name: "Knorr", reason: "Owned by Unilever." },
  { name: "Kolynos", reason: "Owned by Colgate-Palmolive." },
  {
    name: "Krispy Kreme",
    reason:
      "Owners of Krispy Kreme invested and donated through their Alfred Landecker Foundation.",
  },
  { name: "Kurkure", reason: "Snack brand owned by PepsiCo." },
  {
    name: "L’Oréal",
    reason: "Initiated operations in Israel in the mid-1990s.",
  },
  {
    name: "Lacoste",
    reason: "Sponsorship of the Israel Football Association [IFA].",
  },
  { name: "La Roche-Posay", reason: "A skincare brand owned by L’Oréal." },
  {
    name: "Land Rover",
    reason: "Partners with TCS to open Innovation Programme in Israel.",
  },
  {
    name: "Leonardo Hotels",
    reason: "Part of the Fattal Hotels Group, an Israeli hospitality company.",
  },
  { name: "Levissima", reason: "Owned by Nestle." },
  {
    name: "Lidl",
    reason: "Owner is a huge investor in Israeli tech companies.",
  },
  { name: "Life Water", reason: "Owned by PepsiCo." },
  { name: "Limca", reason: "Owned by Coca-Cola." },
  { name: "Lipton", reason: "Owned by Unilever." },
  {
    name: "Loblaws",
    reason: "Are major sponsors of the Walk with Israel organisation.",
  },
  { name: "Louis Vuitton", reason: "Owned by LVMH." },
  {
    name: "Luxottica (EssilorLuxottica)",
    reason: "Buys Israeli hearing tech start-up Nuance.",
  },
  { name: "Lupilu", reason: "Owned by Lidl." },
  { name: "Lux", reason: "Owned by Unilever." },
  { name: "LVMH", reason: "Owned by Bernard Arnault." },
  { name: "M&M", reason: "Chocolate brand owned by Mars." },
  { name: "Maccas", reason: "McDonald’s, known as Maccas in some regions." },
  { name: "Maaza", reason: "Owned by Coca-Cola." },
  { name: "Maggi", reason: "Owned by Nestlé." },
  { name: "Maison Francis Kurkdjian", reason: "Owned by LVMH." },
  {
    name: "Major League Baseball",
    reason: "Allowed to play Israeli national anthem in the games.",
  },
  {
    name: "Mars",
    reason:
      "Investing in the food tech start-up through venture capital partner JVC.",
  },
  { name: "Marc Jacobs", reason: "Owned by LVMH." },
  {
    name: "Marsh McLennan",
    reason: "Acquisition of Re Solutions, reinsurance broker in Israel.",
  },
  {
    name: "Mattel",
    reason: "CEO of the company is Ynon Kreiz, an Israeli-American.",
  },
  { name: "Maybelline", reason: "Owned by L’Oréal." },
  {
    name: "McDermott Will & Emery",
    reason: "Helps investors invest in Israeli companies.",
  },
  { name: "McDonald’s", reason: "Donated meals to the Israeli army." },
  {
    name: "Mehadrin",
    reason: "Israeli-based agriculture company exporting produce globally.",
  },
  { name: "Mellow Yellow", reason: "Owned by PepsiCo." },
  { name: "Mercedes", reason: "Opened a tech hub in Tel Aviv." },
  { name: "Meta", reason: "Runs Facebook and Instagram." },
  {
    name: "Michael Kors",
    reason: "Owned by Capri Holdings, which has business operations in Israel.",
  },
  { name: "Michaels", reason: "CEO of the company supports Israel." },
  { name: "Microsoft", reason: "Collaborates with Israeli tech companies." },
  {
    name: "Migdal Insurance",
    reason: "Israeli insurance and financial services company.",
  },
  { name: "Milka", reason: "Owned by Mondelez." },
  { name: "Milkybar", reason: "Owned by Nestlé." },
  { name: "Minute Maid", reason: "Owned by Coca-Cola." },
  { name: "Minis", reason: "Owned by Nestlé." },
  { name: "Mirinda", reason: "Owned by PepsiCo." },
  {
    name: "Mizrahi Tefahot Bank",
    reason: "One of the largest banks in Israel.",
  },
  { name: "Monki", reason: "Owned by H&M Group." },
  { name: "Monday.com", reason: "Headquartered in Tel Aviv, Israel." },
  { name: "Monster", reason: "Owned by Coca-Cola." },
  {
    name: "Morgan Lewis",
    reason: "Published a letter to openly support Israel.",
  },
  {
    name: "Moroccanoil",
    reason: "Hair & body products brand, manufactured in Israel.",
  },
  { name: "Morrisons", reason: "Source produce from the state of Israel." },
  { name: "Mountain Dew", reason: "Owned by PepsiCo." },
  { name: "Mount Franklin", reason: "Owned by Coca-Cola." },
  {
    name: "Motorola",
    reason:
      "IDF uses Motorola as a main supplier for its communication equipment.",
  },
  { name: "Munchies", reason: "Owned by Frito-Lay, a part of PepsiCo." },
  { name: "MBC TV (Group)", reason: "Published a report in favour of Israel." },
  { name: "Mommy Care", reason: "Owner Joshua Shuki Shaked is an Israeli." },
  {
    name: "MyHeritage",
    reason: "Founded by an Israeli entrepreneur, Gilad Japhet.",
  },
  {
    name: "Next",
    reason:
      "Company’s CEO provides grants for science initiatives and cultural projects in Israel.",
  },
  { name: "Nabisco", reason: "Owned by Mondelez." },
  { name: "NameCheap", reason: "Hosts Israeli propaganda websites." },
  { name: "Nutter Butter", reason: "Owned by Mondelez." },
  {
    name: "No Frills",
    reason:
      "Is a brand of Loblaw Companies Limited, sponsors of the Walk with Israel organisation.",
  },
  { name: "National Geographic", reason: "Owned by Disney." },
  {
    name: "New Balance",
    reason: "Has been a sponsor of the Jerusalem Marathon.",
  },
  { name: "Namshi", reason: "Owned by Noon." },
  { name: "Nutella", reason: "Owned by Ferrero." },
  { name: "Newtons", reason: "Owned by Mondelez." },
  {
    name: "NVIDIA",
    reason:
      "Is building a supercomputer for Israel and partnerships with Israeli tech companies.",
  },
  {
    name: "Netflix",
    reason: "Claim of being 'truly Israeli' on their website.",
  },
  { name: "Nescafe", reason: "Owned by Nestlé." },
  {
    name: "Nestlé",
    reason: "Owns 53.8% share of leading Israeli food manufacturer Osem.",
  },
  { name: "Nesquik", reason: "Owned by Nestlé." },
  {
    name: "Noon.com",
    reason:
      "UAE-based founder Mohamed Alabbar made donations to Israeli 'Charity Project'.",
  },
  {
    name: "Nike",
    reason: "Has sponsorship deals with several Israeli athletes and teams.",
  },
  { name: "Neutrogena", reason: "Owned by L'Oreal." },
  { name: "Nussbeisser", reason: "Owned by Mondelez." },
  { name: "Oreo", reason: "Owned by Mondelez." },
  {
    name: "Overwolf",
    reason: "Israeli tech company specializing in gaming tools and software.",
  },
  { name: "Oral-B", reason: "Owned by Procter & Gamble." },
  { name: "Old Spice", reason: "Owned by Procter & Gamble." },
  { name: "Oysho", reason: "Owned by Inditex." },
  { name: "Oxygeneo", reason: "Made in Israel." },
  { name: "Oracle", reason: "Donated money to Israeli employees." },
  { name: "Ocean Spray", reason: "Is a brand of PepsiCo." },
  {
    name: "Oakley",
    reason: "Owned by EssilorLuxottica that invests in Israeli start-ups.",
  },
  { name: "OROWHEAT", reason: "Owned by Bimbo." },
  {
    name: "P&G (Procter & Gamble)",
    reason:
      "Opened an R&D centre in Tel Aviv and investing $2 billion annually.",
  },
  {
    name: "Pampers",
    reason:
      "Owned by Procter & Gamble, which has business operations in Israel.",
  },
  {
    name: "Purex",
    reason:
      "Owned by Henkel, investing in Israeli technology by backing Feelit.",
  },
  { name: "Pears", reason: "Owned by Unilever." },
  { name: "Pull & Bear", reason: "Owned by Inditex." },
  {
    name: "Paradise Dates",
    reason:
      "Owned by Tnuvot Field, Israel’s 3rd largest exporter of Medjool dates.",
  },
  {
    name: "Pepsi",
    reason:
      "Has a strong and long history of business with Israeli-based SodaStream company.",
  },
  { name: "Persil", reason: "Owned by Unilever." },
  {
    name: "Premium Medjoul",
    reason: "Dates sourced and often exported from Israel.",
  },
  { name: "Popeyes", reason: "Is the sister company of Burger King." },
  {
    name: "Philips",
    reason:
      "Host major facilities like Philips Medical Systems Technologies Ltd. in Haifa, originally established as the Israeli company Elscint.",
  },
  {
    name: "Paramount",
    reason: "Issued a statement on Twitter that they stand with Israel.",
  },
  { name: "Philadelphia Cream Cheese", reason: "Owned by Mondelez." },
  {
    name: "Pizza Hut",
    reason: "Owned by Yum! Brands, actively investing in Israeli start-ups.",
  },
  { name: "Protex", reason: "Owned by Colgate-Palmolive." },
  { name: "Powerade", reason: "Owned by Coca-Cola." },
  { name: "Purina", reason: "Owned by Nestle." },
  {
    name: "Phoenix Holdings",
    reason: "Israeli insurance and financial services company.",
  },
  { name: "Propel", reason: "Owned by PepsiCo." },
  { name: "Pepsodent", reason: "Owned by Unilever." },
  { name: "Pond’s", reason: "Owned by Unilever." },
  {
    name: "Pure Leaf Green Tea",
    reason: "Joint venture between PepsiCo and Unilever.",
  },
  { name: "Prada", reason: "Is a brand of L’Oréal." },
  { name: "Pringles", reason: "Owned by Kellogg’s." },
  { name: "Payoneer", reason: "Israeli-owned financial services company." },
  {
    name: "PureGym",
    reason: "CEO has made public statements to support Israel.",
  },
  { name: "Palladium", reason: "Provides official shoes for Israeli army." },
  { name: "Palmolive", reason: "Owned by Colgate-Palmolive." },
  { name: "Purelife", reason: "Owned by Nestlé." },
  { name: "Pureology", reason: "Part of L’Oréal." },
  { name: "Perk", reason: "Owned by Cadbury." },
  { name: "PUMA", reason: "Sponsors Israeli athletes and teams." },
  { name: "Quaker Oats", reason: "Is a brand of PepsiCo." },
  {
    name: "Qualcomm",
    reason: "Invests millions of dollars in Israeli tech start-ups.",
  },
  { name: "Roladin", reason: "Bakery chain based in Israel." },
  { name: "Ruffles", reason: "Owned by PepsiCo." },
  { name: "Ratiopharm", reason: "Owned by Teva." },
  {
    name: "Range Rover",
    reason:
      "Owned by Jaguar Land Rover partners with TCS to launch the Open Innovation Programme in Israel.",
  },
  {
    name: "Rove Hotels",
    reason: "Founder Mohamed Ali Alabbar donates to Israel.",
  },
  {
    name: "Ray-Ban",
    reason: "Owned by EssilorLuxottica that invests in Israeli start-ups.",
  },
  { name: "Reebok", reason: "Sponsors Israeli team." },
  {
    name: "Revlon",
    reason:
      "Owner Ronald Perelman is a trustee of The Simon Wiesenthal centre.",
  },
  { name: "Ralph Lauren", reason: "Is a brand of L’Oreal." },
  { name: "Ritz", reason: "Owned by Mondelez." },
  { name: "Royal Canin", reason: "Owned by Mars." },
  { name: "Rapunzel Dates", reason: "Dates brand owned by Israel." },
  {
    name: "Sabra Hummus",
    reason:
      "Joint venture between PepsiCo and the Strauss Group, an Israeli company.",
  },
  { name: "Sanpellegrino", reason: "Owned by Nestle." },
  {
    name: "Sara Lee",
    reason: "Owns 30% of Israels leading textile company Delta Galil",
  },
  {
    name: "SAP",
    reason:
      "Donated 6,500 Israeli shekels to Israeli employees after the war started.",
  },
  { name: "Simply", reason: "Owned by Coca-Cola." },
  { name: "Smart Water", reason: "Owned by Coca-Cola." },
  { name: "Sprite", reason: "Owned by Coca-Cola." },
  {
    name: "Spotify",
    reason: "Founder Daniel Ek has expressed support for Israel.",
  },
  {
    name: "Stradivarius",
    reason: "Brand owned by the Inditex Group, has a presence in Israel.",
  },
  { name: "SodaStream", reason: "Israeli-based company." },
  { name: "Swisse", reason: "Sells made in Israel products." },
  { name: "Sensodyne", reason: "Owned by GSK." },
  {
    name: "Siemens",
    reason:
      "Has significant business operations in energy and infrastructure in Israel.",
  },
  { name: "StreamElements", reason: "Founded in Israel." },
  { name: "Schweppes", reason: "Owned by Coca-Cola." },
  { name: "Sunsilk", reason: "Owned by Unilever." },
  { name: "Signal", reason: "Owned by Unilever." },
  { name: "Skittles", reason: "Owned by Mars." },
  { name: "Smart Food", reason: "Owned by PepsiCo." },
  { name: "SABON", reason: "Israeli-based company." },
  { name: "SeboCalm", reason: "Israeli-based skincare company." },
  { name: "SalesForce", reason: "Donated $3 million to Israel." },
  {
    name: "Skechers",
    reason: "President Michael S Greenberg supports Israel.",
  },
  { name: "SoBe", reason: "Owned by PepsiCo." },
  { name: "Schwarzkopf", reason: "Owned by Henkel." },
  { name: "Sunbites Crackers", reason: "Owned by PepsiCo." },
  { name: "Sunlight", reason: "Owned by Unilever." },
  { name: "Stanley Tools", reason: "Made in Israel." },
  { name: "Smarties", reason: "Owned by Nestlé." },
  { name: "SolarEdge", reason: "Israeli-based company." },
  { name: "Sephora", reason: "Owned by LVMH." },
  { name: "Sam’s Club", reason: "Owned by Walmart." },
  {
    name: "Shoppers Drug Mart",
    reason:
      "Owned by Loblaw Companies, which supports initiatives tied to Israel.",
  },
  { name: "Sanex", reason: "Owned by Colgate-Palmolive." },
  {
    name: "Sony",
    reason: "Supports Israel, even posted on Instagram in their favour.",
  },
  { name: "Superbus", reason: "Israeli transportation company." },
  {
    name: "Scotiabank",
    reason:
      "Invested 500 million dollars into Elbit Systems Ltd, which is an Israeli weapons manufacturer.",
  },
  { name: "Sour Patch Kids", reason: "Owned by Mondelez." },
  {
    name: "Starbucks",
    reason:
      "Howard Schultz, Starbucks’ largest private owner, invested $1.7B in Israeli cybersecurity firm Wiz.",
  },
  { name: "Sadaf", reason: "Israeli-owned brand." },
  { name: "Sting", reason: "Owned by PepsiCo." },
  { name: "Shams", reason: "An Israeli brand which sells dates." },
  { name: "Sneakers", reason: "Owned by Mars Inc." },
  { name: "Star Dates", reason: "Israeli dates." },
  { name: "Stride", reason: "Owned by Mondelez." },
  {
    name: "Sunglass Hut",
    reason: "Owned by Luxottica, which invests in Israeli start-ups.",
  },
  { name: "Surf Excel", reason: "Owned by Unilever." },
  {
    name: "Stripe",
    reason: "CEO and co-founder Patrick Collison visits Israel.",
  },
  { name: "SaraLee", reason: "Owned by Bimbo." },
  { name: "Sun Maid", reason: "Owned by Bimbo." },
  { name: "Tang", reason: "Owned by Mondelez." },
  { name: "Tate’s Bake Shop", reason: "Owned by Mondelez." },
  { name: "The Body Shop", reason: "Is a brand of L’Oreal." },
  { name: "TEVA", reason: "Israeli-based pharmaceutical company." },
  {
    name: "Tesco",
    reason: "Has been known to sell products sourced from Israel.",
  },
  { name: "Twitch", reason: "Owned by Amazon." },
  { name: "Thumbs Up", reason: "Owned by Coca-Cola." },
  {
    name: "Twitter / X",
    reason:
      "Has a research and development centre in Israel and collaborates with Israeli tech companies.",
  },
  { name: "Teem", reason: "Owned by PepsiCo." },
  { name: "Tasali Chips", reason: "Owned by PepsiCo." },
  { name: "The Ordinary", reason: "Owned by Estée Lauder." },
  {
    name: "Tim Hortons",
    reason:
      "Company of Burger King, known to provide free food and drinks to IDF.",
  },
  {
    name: "Timberland",
    reason: "CEO Jeffrey Swartz went on a ‘solidarity visit’ to Israel.",
  },
  { name: "Topo Chico", reason: "Owned by Coca-Cola." },
  { name: "Taco Bell", reason: "Owned by Yum! Brands." },
  {
    name: "Taffix",
    reason: "Manufactured by an Israeli company (Nasus Pharma).",
  },
  { name: "Tag Heuer", reason: "Owned by LVMH." },
  { name: "Tamara Barhi", reason: "Dates sourced from Israel." },
  {
    name: "Tata",
    reason:
      "Provides IT and cloud services to the Israeli military and supplies Land Rover vehicles to the Israeli military.",
  },
  {
    name: "Tesla",
    reason: "Announced free use of all its Superchargers in Israel.",
  },
  { name: "Thomas' (Bagel/Biscuits/Muffins)", reason: "Owned by Bimbo." },
  {
    name: "Thompson's WaterSeal",
    reason: "Owned by Sherwin-Williams, supports Israeli military.",
  },
  { name: "Tic Tac", reason: "Owned by Ferrero." },
  { name: "Toblerone", reason: "Owned by Mondelez International." },
  { name: "Tom Ford", reason: "Owned by Estée Lauder." },
  { name: "Tostitos", reason: "Owned by PepsiCo." },
  { name: "Trader Joe’s", reason: "Sells products sourced from Israel." },
  { name: "Trident", reason: "Owned by Mondelez International." },
  { name: "Triscuit", reason: "Owned by Mondelez International." },
  { name: "Tropicana", reason: "Owned by PepsiCo." },
  { name: "Tropico", reason: "Owned by Coca-Cola." },
  { name: "Twix", reason: "Owned by Mars." },
  { name: "Twisties", reason: "Owned by Mondelez." },
  { name: "TUC", reason: "Owned by Mondelez." },
  { name: "Urban Decay", reason: "Is a brand of L’Oreal." },
  {
    name: "Under Armour",
    reason: "Support of various Israeli sports teams and athletes.",
  },
  { name: "Urban Platter", reason: "Sells Israeli Medjool Dates." },
  { name: "Unilever", reason: "Company with operations in Israel." },
  { name: "Vitaminwater", reason: "Owned by Coca-Cola." },
  { name: "Volvo", reason: "Supplied equipment to Israel." },
  { name: "Vicks", reason: "Owned by Procter and Gamble." },
  { name: "Vanguard", reason: "Investment in Israel." },
  {
    name: "Victoria’s Secret",
    reason: "Owner Les Wexner is a supporter of Israel.",
  },
  { name: "Vaseline", reason: "Is a brand of Unilever." },
  { name: "Vogue International", reason: "Owned by Johnson & Johnson." },
  { name: "Volkswagen", reason: "President of the company supported Israel." },
  {
    name: "Waitrose",
    reason: "Has been known to sell products sourced from Israel.",
  },
  { name: "Wall’s", reason: "Owned by Unilever." },
  { name: "Walmart", reason: "Pledged $1m to Israeli victims." },
  {
    name: "Wells Fargo",
    reason:
      "Was part of $500 million loan deal into EBIT Systems Ltd, an Israeli company.",
  },
  { name: "Wheat Thins", reason: "Owned by Mondelez." },
  { name: "Walkers", reason: "Is a brand of PepsiCo." },
  { name: "Warner Chilcott", reason: "Owned by TEVA pharma." },
  { name: "Wild Harvest Organic Tahini", reason: "Produced in Israel." },
  {
    name: "Winston & Strawn",
    reason: "Law firm with services tied to Israel.",
  },
  { name: "Wissotzky Tea", reason: "Israeli tea company." },
  { name: "Wix", reason: "Tech company headquartered in Tel Aviv." },
  { name: "Whatsapp", reason: "Owned by Meta." },
  { name: "Wheel Washing Powder", reason: "Owned by Unilever." },
  {
    name: "Wrigley’s Company",
    reason: "Invested in Israeli food tech start-ups through JVC.",
  },
  { name: "Yves Saint Laurent/YSL", reason: "A brand of L’Oreal." },
  { name: "Yvel", reason: "Luxury Jewellery brand based in Israel." },
  { name: "Yum Foods", reason: "Is an investor in Israeli start-ups." },
  { name: "Zara", reason: "Clothing mocking war by ad campaign." },
  { name: "Zim Shipping", reason: "Israeli shipping company." },
  {
    name: "Ziff Davis",
    reason: "Partnered with BrandStorm Media to launch IGN Israel.",
  },
  {
    name: "Zhou Nutrition",
    reason: "Sources its black seed oil directly from Israel.",
  },
  { name: "Zus Coffee", reason: "Collaborated with Adidas for an event." },
];
