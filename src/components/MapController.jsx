import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

export default function MapController({ filtre, egliseSelectionnee }) {
  const map = useMap()

  useEffect(() => {

    if (egliseSelectionnee) {
      map.flyTo(
        [egliseSelectionnee.latitude, egliseSelectionnee.longitude],
        15,
        {
          animate: true,
          duration: 1.5,
        }
      )
      return
    }

    if (filtre === "france") {
      const france = L.latLngBounds(
        [41.2, -5.8],
        [51.3, 9.8]
      )

      map.setMaxBounds(france)
      map.options.maxBoundsViscosity = 1.0

      map.fitBounds(france, {
        padding: [10, 10],
        animate: true,
      })
    }

    else if (filtre === "europe") {
      const europe = L.latLngBounds(
        [34, -12],
        [72, 32]
      )

      map.setMaxBounds(europe)
      map.options.maxBoundsViscosity = 1.0

      map.fitBounds(europe, {
        padding: [20, 20],
        animate: true,
      })
    }

    else {
      map.setMaxBounds(null)
      map.options.maxBoundsViscosity = 0

      map.setView([20, 0], 2, {
        animate: true,
      })
    }

  }, [filtre, egliseSelectionnee, map])

  return null
}