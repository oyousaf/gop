export default function Banner() {
  return (
    <div id="welcome" className="w-full h-72 flex justify-center items-center bg-gradient-to-r from-background to-teal-700 relative overflow-hidden shadow-lg">
      <div className="text-center font-custom-font text-4xl md:text-6xl text-white leading-tight px-6 md:px-12">
        <span className="block">مرحبا</span>
        <span className="block mt-4">أهلا و سهلا</span>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black opacity-40"></div>
    </div>
  );
}
