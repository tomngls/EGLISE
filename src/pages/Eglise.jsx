import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import eglises from "../data/eglises"
import PhotoViewer from "../components/PhotoViewer"
import Header from "../components/Header"
import { genererPhotos } from "../utils/photo"

export default function Eglise() {
  const { id } = useParams()

  const [photoActive, setPhotoActive] = useState(0)
  const [photoOuverte, setPhotoOuverte] = useState(false)
  const [favori, setFavori] = useState(false)
  const [chargementFavori, setChargementFavori] = useState(true)

  const eglise = eglises.find(
    (eglise) => eglise.id === id
  )

  if (!eglise) {
    return <h1>Église introuvable</h1>
  }

  const photos = genererPhotos(
    eglise.dossier,
    eglise.nbPhotos
  )

  // ─────────────────────────────
  // Récupération des favoris depuis D1
  // ─────────────────────────────
  useEffect(() => {
    async function chargerFavoris() {
      try {
        const response = await fetch("/api/favoris")

        if (!response.ok) {
          throw new Error("Impossible de récupérer les favoris")
        }

        const favoris = await response.json()

        setFavori(
          favoris.includes(Number(id)) ||
          favoris.includes(id)
        )
      } catch (error) {
        console.error(error)
      } finally {
        setChargementFavori(false)
      }
    }

    chargerFavoris()
  }, [id])

  // ─────────────────────────────
  // Gestion du clavier pour les photos
  // ─────────────────────────────
  useEffect(() => {
    if (!photoOuverte) return

    function gererClavier(event) {
      if (event.key === "ArrowLeft") {
        setPhotoActive((photo) =>
          photo === 0 ? photos.length - 1 : photo - 1
        )
      }

      if (event.key === "ArrowRight") {
        setPhotoActive((photo) =>
          photo === photos.length - 1 ? 0 : photo + 1
        )
      }

      if (event.key === "Escape") {
        setPhotoOuverte(false)
      }
    }

    window.addEventListener("keydown", gererClavier)

    return () => {
      window.removeEventListener("keydown", gererClavier)
    }
  }, [photoOuverte, photos.length])

  // ─────────────────────────────
  // Ajouter / retirer un favori
  // ─────────────────────────────
  async function changerFavori() {
    const code = window.prompt(
      "Code à 4 chiffres pour modifier les favoris :"
    )

    if (code === null) return

    if (!/^\d{4}$/.test(code)) {
      window.alert("Le code doit contenir exactement 4 chiffres.")
      return
    }

    const action = favori ? "remove" : "add"

    try {
      setChargementFavori(true)

      const response = await fetch("/api/favoris", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          id,
          action,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        window.alert(
          data.error || "Impossible de modifier les favoris."
        )
        return
      }

      setFavori(!favori)

    } catch (error) {
      console.error(error)
      window.alert("Erreur de connexion au serveur.")
    } finally {
      setChargementFavori(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">

      <Header />

      <main className="mx-auto max-w-7xl p-10">

        <div className="relative mb-8">

          <img
            src={photos[photoActive]}
            alt={eglise.nom}
            onClick={() => setPhotoOuverte(true)}
            className="h-[580px] w-full cursor-pointer rounded-3xl object-cover shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
          />

          <button
            onClick={changerFavori}
            disabled={chargementFavori}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-2xl backdrop-blur-sm transition hover:scale-110 hover:bg-black/60 disabled:opacity-50"
          >
            <span
              className={
                favori
                  ? "text-[#CA7CDF]"
                  : "text-white"
              }
            >
              ♥
            </span>
          </button>

        </div>

        <h1
          className="mb-1 text-6xl font-bold italic text-gray-900"
          style={{ fontFamily: "Bookman Old Style, serif" }}
        >
          {eglise.nom}
        </h1>

        <div className="mb-8 space-y-1">

          <p className="text-xl text-gray-500">
            📍 {eglise.ville} • {eglise.pays}
          </p>

          <p className="text-lg text-gray-500">
            ⛪ {eglise.type}
          </p>

        </div>

        <Link
          to={`/carte?eglise=${eglise.id}`}
          className="inline-flex items-center rounded-full bg-[#CA7CDF] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#B765D3] hover:shadow-xl"
        >
          📍 Voir sur la carte
        </Link>

        <PhotoViewer
          photoOuverte={photoOuverte}
          setPhotoOuverte={setPhotoOuverte}
          eglise={eglise}
          photoActive={photoActive}
          setPhotoActive={setPhotoActive}
        />

      </main>

    </div>
  )
}