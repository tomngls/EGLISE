import { useEffect, useState } from "react"
import eglises from "../data/eglises"
import Header from "../components/Header"
import EgliseCard from "../components/EgliseCard"

export default function Favoris() {
  const [paysSelectionne, setPaysSelectionne] = useState("Tous")
  const [favoris, setFavoris] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    async function chargerFavoris() {
      try {
        const response = await fetch("/api/favoris")

        if (!response.ok) {
          throw new Error("Impossible de récupérer les favoris")
        }

        const data = await response.json()

        setFavoris(data)
      } catch (error) {
        console.error(error)
      } finally {
        setChargement(false)
      }
    }

    chargerFavoris()
  }, [])

  const eglisesFavorites = eglises.filter((eglise) =>
    favoris.includes(eglise.id)
  )

  const paysDisponibles = [
    ...new Set(eglisesFavorites.map((eglise) => eglise.pays)),
  ].sort()

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

        {chargement ? (
          <p className="text-xl text-gray-600">
            Chargement des favoris...
          </p>
        ) : (
          <>
            <select
              value={paysSelectionne}
              onChange={(e) => setPaysSelectionne(e.target.value)}
              className="mb-8 rounded-xl border bg-white px-4 py-3 shadow"
            >
              <option>Tous</option>

              {paysDisponibles.map((pays) => (
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
          </>
        )}

      </main>

    </div>
  )
}