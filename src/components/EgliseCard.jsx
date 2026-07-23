import { Link } from "react-router-dom"
import { genererPhotos } from "../utils/photo"

export default function EgliseCard({ eglise }) {

  console.log("EgliseCard :", eglise)
console.log("dossier :", eglise?.dossier)
console.log("nbPhotos :", eglise?.nbPhotos)

  if (!eglise) {
    return <div>Erreur : église undefined</div>
  }
  return (
    <Link
      to={`/eglise/${eglise.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <img
  loading="lazy"
  decoding="async"
  src={genererPhotos(eglise.dossier, eglise.nbPhotos)[0]}
  alt={eglise.nom}
  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
/>

      <div className="space-y-2 p-6">
        <h3
  className="text-2xl font-bold italic text-gray-900"
  style={{ fontFamily: "Bookman Old Style, serif" }}
>
          {eglise.nom}
        </h3>

        <p className="text-gray-500">
  📍 {eglise.ville} • {eglise.pays}
        </p>
        <p className="text-gray-500">
  ⛪ {eglise.type}
</p>
      </div>
    </Link>
  )
}