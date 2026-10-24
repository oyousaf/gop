import SectionDivider from "./SectionDivider";

export default function Banner() {
  return (
    <SectionDivider
      id="welcome"
      label="Welcome"
      lines={["مرحبا", "أهلا و سهلا"]}
      className="pt-16 md:pt-24"
    />
  );
}
