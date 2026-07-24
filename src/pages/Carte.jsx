import Header from "../components/Header"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet"
import eglises from "../data/eglises"
import { useState } from "react"
import MapController from "../components/MapController"
import L from "leaflet"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { genererPhotos } from "../utils/photo"
const BASE_URL = window.location.origin;

const markerViolet = new L.Icon({
  iconUrl: `${BASE_URL}/icons/marker-violet.png`,
  iconSize: [35, 50],
  iconAnchor: [17, 50],
  popupAnchor: [0, -45],
})

export default function Carte() {
    const [filtre, setFiltre] = useState("monde")
    const [filtreChoisi, setFiltreChoisi] = useState(false)
    const favoris =
  JSON.parse(localStorage.getItem("favoris")) || []

const paysEurope = [
  "France",
  "Belgique",
  "Pays-Bas",
  "Luxembourg",
  "Allemagne",
  "Suisse",
  "Italie",
  "Espagne",
  "Portugal",
  "Autriche",
  "Pologne",
  "République tchèque",
  "Slovaquie",
  "Hongrie",
  "Croatie",
  "Slovénie",
  "Roumanie",
  "Bulgarie",
  "Grèce",
  "Irlande",
  "Royaume-Uni",
  "Norvège",
  "Suède",
  "Finlande",
  "Danemark",
  "Islande"
]

const eglisesFiltrees = eglises.filter((eglise) => {
  if (filtre === "monde") return true

  if (filtre === "france")
    return eglise.pays === "France"

  if (filtre === "europe")
    return paysEurope.includes(eglise.pays)

  if (filtre === "favoris")
    return favoris.includes(eglise.id)

  return true
})
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

const idEglise = searchParams.get("eglise")

const egliseSelectionnee = eglises.find(
  (eglise) => eglise.id === idEglise
)
  return (
    <div className="min-h-screen bg-stone-100">
      <Header />

      <div className="p-10">
        <h1
  className="mb-8 text-6xl font-semibold tracking-wide"
  style={{ fontFamily: "Bookman Old Style, serif" }}
>
          Carte des églises
        </h1>
        <div className="mb-8 flex flex-wrap gap-3">

  <button
    onClick={() => {
  navigate("/carte")
  setFiltre("monde")
  setFiltreChoisi(true)
}}
    className={`rounded-full px-6 py-3 font-semibold shadow-md transition-all duration-300 ${
  !filtreChoisi || filtre === "monde"
    ? "bg-[#CA7CDF] text-white"
    : "bg-white text-gray-700 hover:bg-[#F3E3F8]"
}`}
  >
    🌍 Monde
  </button>

  <button
    onClick={() => {
  navigate("/carte")
  setFiltre("europe")
  setFiltreChoisi(true)
}}
    className={`rounded-full px-6 py-3 font-semibold shadow-md transition-all duration-300 ${
  !filtreChoisi || filtre === "europe"
    ? "bg-[#CA7CDF] text-white"
    : "bg-white text-gray-700 hover:bg-[#F3E3F8]"
}`}
    
  >
    🇪🇺 Europe
  </button>

  <button
    onClick={() => {
  navigate("/carte")
  setFiltre("france")
  setFiltreChoisi(true)
}}
    className={`rounded-full px-6 py-3 font-semibold shadow-md transition-all duration-300 ${
  !filtreChoisi || filtre === "france"
    ? "bg-[#CA7CDF] text-white"
    : "bg-white text-gray-700 hover:bg-[#F3E3F8]"
}`}
  >
    🇫🇷 France
  </button>

  <button
    onClick={() => {
  navigate("/carte")
  setFiltre("favoris")
  setFiltreChoisi(true)
}}
    className={`rounded-full px-6 py-3 font-semibold shadow-md transition-all duration-300 ${
  !filtreChoisi || filtre === "favoris"
    ? "bg-[#CA7CDF] text-white"
    : "bg-white text-gray-700 hover:bg-[#F3E3F8]"
}`}
  >
    ❤️ Favoris
  </button>

</div>

        <MapContainer
  center={
  egliseSelectionnee
    ? [egliseSelectionnee.latitude, egliseSelectionnee.longitude]
    : [48.8566, 2.3522]
}
zoom={egliseSelectionnee ? 14 : 6}
  className="h-[700px] rounded-2xl"
>
  <TileLayer 
    attribution='&copy; OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <MapController
  filtre={filtre}
  egliseSelectionnee={egliseSelectionnee}
/>
  {eglisesFiltrees.map((eglise) => (
  <Marker
  key={eglise.id}
  position={[eglise.latitude, eglise.longitude]}
  icon={markerViolet}
>
    <Popup minWidth={240} maxWidth={240}>
  <Link to={`/eglise/${eglise.id}`}>

    <img
      loading="lazy"
      decoding="async"
      src={genererPhotos(eglise.dossier, eglise.nbPhotos)[0]}
      alt={eglise.nom}
      className="h-52 w-full rounded-lg object-cover"
    />

    <div className="mt-2">

      <h3 className="text-lg font-bold text-[#CA7CDF]">
  {eglise.nom}
</h3>

      <p className="text-gray-600">
        {eglise.ville} • {eglise.pays}
      </p>

    </div>

  </Link>
</Popup>
  </Marker>
))}
</MapContainer>

      </div>
    </div>
  )
}