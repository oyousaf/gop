import SectionDivider from "./SectionDivider";

export default function Banner() {
  return (
    <SectionDivider
      id="welcome"
      label="Welcome"
      lines={["مرحبا", "أهلا و سهلا"]}
      className="mt-25"
    />
  );
}
