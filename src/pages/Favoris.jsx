import eglises from "../data/eglises"
import Header from "../components/Header"
import EgliseCard from "../components/EgliseCard"
import { useState } from "react"


export default function Favoris() {
    const [paysSelectionne, setPaysSelectionne] = useState("Tous")
  const favoris =
    JSON.parse(localStorage.getItem("favoris")) || []

  const eglisesFavorites = eglises.filter((eglise) =>
    favoris.includes(eglise.id)
  )

  return (
    <div className="min-h-screen bg-stone-100">
        <Header />

<main className="mx-auto max-w-7xl p-10">
      <h1
  className="mb-8 text-6xl font-bold tracking-wide"
  style={{ fontFamily: "Bookman Old Style, serif" }}
>
  <span className="mr-2 text-6xl not-italic">💜</span>
  <span className="italic">Mes favoris</span>
</h1>
      <select
  value={paysSelectionne}
  onChange={(e) => setPaysSelectionne(e.target.value)}
  className="mb-8 rounded-xl border bg-white px-4 py-3 shadow"
>
  <option>Tous</option>

  {[...new Set(eglisesFavorites.map((eglise) => eglise.pays))]
    .sort()
    .map((pays) => (
      <option key={pays}>
        {pays}
      </option>
    ))}
</select>

      {eglisesFavorites.length === 0 ? (
        <p className="text-xl text-gray-600">
          Vous n'avez encore aucune église en favori.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  {eglisesFavorites
  .filter(
    (eglise) =>
      paysSelectionne === "Tous" ||
      eglise.pays === paysSelectionne
  )
  .map((eglise) => (
    <EgliseCard
      key={eglise.id}
      eglise={eglise}
    />
  ))}
</div>
                  )}
    </main>
  </div>
  )
}