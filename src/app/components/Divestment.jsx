import { boycott } from "../utils/constants";

export default function Divestment() {
  return (
    <section className="max-w-7xl mx-auto p-6 py-12" id="divestment">
      <h2 className="text-5xl font-bold text-center mb-8">Divestment</h2>
      <p className="md:text-2xl text-lg text-gray-200 leading-relaxed mt-4 mb-6 text-center">
        The growing discourse around divesting in Israeli products and companies
        supporting Israel has gained momentum, especially during the current
        crisis. Esteemed Islamic scholars are advocating for Muslims to avoid
        such brands, highlighting the profound spiritual and historical
        significance of Masjid Al-Aqsa, one of Islam’s holiest sites. In light
        of the suffering faced by our Muslim brothers and sisters in Palestine,
        it becomes a moral obligation to divest in not only Israeli goods but
        also businesses that align with their actions. Collective efforts are
        vital to demonstrate unity and uphold shared values.
      </p>
      <p className="md:text-2xl text-lg text-gray-200 leading-relaxed mt-4 mb-6 text-center">
        The following brands are known to either provide significant support to
        Israel or receive funding from Israeli sources.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {boycott
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((brand, index) => (
          <div
            key={index}
            className="bg-background shadow-md rounded-lg p-6 border border-gray-200 flex flex-col"
          >
            <h3 className="md:text-3xl text-2xl text-red-300 font-semibold mb-4 text-center">
              {brand.name}
            </h3>
            <p className="md:text-2xl text-lg pt-3 text-center flex-grow">
              {brand.reason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
