import { useState, useRef, useEffect } from "react"
import { genererPhotos } from "../utils/photo"

export default function PhotoViewer({
  photoOuverte,
  setPhotoOuverte,
  eglise,
  photoActive,
  setPhotoActive,
}) {
  if (!photoOuverte) return null

  const photos = genererPhotos(
    eglise.dossier,
    eglise.nbPhotos
  )

  const niveauxZoom = [1, 1.5, 2, 3]

  const [zoomIndex, setZoomIndex] = useState(0)

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })

  const imageRef = useRef(null)

  const wrapperRef = useRef(null)

  useEffect(() => {
    setZoomIndex(0)

    setPosition({
      x: 0,
      y: 0,
    })
  }, [photoActive])

  function zoom() {
    if (zoomIndex === niveauxZoom.length - 1) {
      setZoomIndex(0)

      setPosition({
        x: 0,
        y: 0,
      })

      return
    }

    setZoomIndex(zoomIndex + 1)
  }

  function limiter(x, y) {
    const wrapper = wrapperRef.current

    const image = imageRef.current

    if (!wrapper || !image)
      return { x, y }

    const scale =
      niveauxZoom[zoomIndex]

    const largeur =
      image.offsetWidth * scale

    const hauteur =
      image.offsetHeight * scale

    const maxX = Math.max(
      0,
      (largeur - wrapper.offsetWidth) / 2
    )

    const maxY = Math.max(
      0,
      (hauteur - wrapper.offsetHeight) / 2
    )

    return {
      x: Math.min(
        maxX,
        Math.max(-maxX, x)
      ),

      y: Math.min(
        maxY,
        Math.max(-maxY, y)
      ),
    }
  }

  function scroll(e) {
    if (zoomIndex === 0) return

    e.preventDefault()

    const vitesse = 0.9

    const nouveau = limiter(
      position.x - e.deltaX * vitesse,
      position.y - e.deltaY * vitesse
    )

    setPosition(nouveau)
  }

  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) return

    wrapper.addEventListener(
      "wheel",
      scroll,
      {
        passive: false,
      }
    )

    return () =>
      wrapper.removeEventListener(
        "wheel",
        scroll
      )
  }, [position, zoomIndex])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={() => setPhotoOuverte(false)}
    >
      <button
        onClick={() => setPhotoOuverte(false)}
        className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#CA7CDF]/85 text-3xl text-white transition hover:bg-[#B765D3]"
      >
        ✕
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()

          setPhotoActive(
            photoActive === 0
              ? photos.length - 1
              : photoActive - 1
          )

          setZoomIndex(0)
          setPosition({ x: 0, y: 0 })
        }}
        className="absolute left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#CA7CDF]/85 text-4xl text-white transition hover:bg-[#B765D3]"
      >
        ‹
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()

          setPhotoActive(
            photoActive === photos.length - 1
              ? 0
              : photoActive + 1
          )

          setZoomIndex(0)
          setPosition({ x: 0, y: 0 })
        }}
        className="absolute right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#CA7CDF]/85 text-4xl text-white transition hover:bg-[#B765D3]"
      >
        ›
      </button>

      <div
        ref={wrapperRef}
        onClick={(e) => {
          e.stopPropagation()
          zoom()
        }}
        className="flex h-full w-full items-center justify-center overflow-hidden"
      >
        <img
          loading="lazy"
          decoding="async"
          ref={imageRef}
          src={photos[photoActive]}
          alt={eglise.nom}
          draggable={false}
          className="select-none rounded-2xl shadow-2xl transition-transform duration-300 ease-out"
          style={{
            maxHeight: "90vh",
            maxWidth: "90vw",

            transform: `
              translate(${position.x}px, ${position.y}px)
              scale(${niveauxZoom[zoomIndex]})
            `,

            cursor:
              zoomIndex === niveauxZoom.length - 1
                ? "zoom-out"
                : "zoom-in",
          }}
        />
      </div>

      <div className="absolute bottom-6 right-6 rounded-full bg-black/50 px-4 py-2 text-lg font-semibold text-white backdrop-blur">
        {photoActive + 1} / {photos.length}
      </div>
    </div>
  )
}