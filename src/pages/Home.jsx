import Header from "../components/Header"
import EgliseCard from "../components/EgliseCard"
import eglises from "../data/eglises"
import { useState } from "react"

export default function Home() {
    const [paysSelectionne, setPaysSelectionne] = useState("Tous")
    const [typeSelectionne, setTypeSelectionne] = useState("Tous")
    const [tri, setTri] = useState("date")
    let eglisesAffichees = eglises.filter(
  (eglise) =>
    (paysSelectionne === "Tous" ||
      eglise.pays === paysSelectionne) &&
    (typeSelectionne === "Tous" ||
      eglise.type === typeSelectionne)
    )

if (tri === "alpha") {
  eglisesAffichees = [...eglisesAffichees].sort((a, b) =>
    a.nom.localeCompare(b.nom)
  )
}

if (tri === "random") {
  eglisesAffichees = [...eglisesAffichees].sort(
    () => Math.random() - 0.5
  )
}
  return (
    <div className="min-h-screen bg-stone-100">
      <Header />

      <main className="mx-auto max-w-7xl p-10">
        <h2 className="mb-8 text-6xl font-semibold tracking-wide"
    style={{ fontFamily: "Bookman Old Style, serif" }}>
          Découvrez votre collection d'églises
        </h2>
<select
  value={paysSelectionne}
  onChange={(e) => setPaysSelectionne(e.target.value)}
  className="mb-8 rounded-full border border-[#E8D5EF] bg-white px-5 py-3 shadow-md transition-all duration-300 hover:border-[#CA7CDF] focus:border-[#CA7CDF] focus:outline-none"
>
  <option value="Tous">Filtre par pays</option>

  {[...new Set(eglises.map((eglise) => eglise.pays))]
    .sort()
    .map((pays) => (
      <option key={pays}>
        {pays}
      </option>
    ))}
</select>
<select
  value={typeSelectionne}
  onChange={(e) => setTypeSelectionne(e.target.value)}
  className="mb-8 ml-4 rounded-full border border-[#E8D5EF] bg-white px-5 py-3 shadow-md transition-all duration-300 hover:border-[#CA7CDF] focus:border-[#CA7CDF] focus:outline-none"
>
  <option value="Tous">Filtre par type d'église</option>

  {[...new Set(eglises.map((eglise) => eglise.type))]
    .sort()
    .map((type) => (
      <option key={type}>
        {type}
      </option>
    ))}
</select>
<select
  value={tri}
  onChange={(e) => setTri(e.target.value)}
  className="mb-8 ml-4 rounded-full border border-[#E8D5EF] bg-white px-5 py-3 shadow-md transition-all duration-300 hover:border-[#CA7CDF] focus:border-[#CA7CDF] focus:outline-none"
>
  <option value="recent">Tri par défaut</option>

  <option value="alpha">
    🔤 A → Z
  </option>

  <option value="random">
    🎲 Aléatoire
  </option>
</select>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {eglisesAffichees
  .map((eglise) => (
            <EgliseCard
              key={eglise.id}
              eglise={eglise}
            />
          ))}
        </div>
        <div className="mt-16 flex justify-end">
  <div className="text-right">
    <div
      className="text-5xl font-bold italic text-[#CA7CDF]"
      style={{ fontFamily: "Bookman Old Style, serif" }}
    >
      {eglises.length} / ∞
    </div>

    <p className="mt-2 text-gray-500">
      Églises référencées
    </p>
  </div>
</div>
      </main>
    </div>
  )
}