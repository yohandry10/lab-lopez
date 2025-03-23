"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface GoogleMapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialAddress?: string
}

// Declare google as a global variable
declare global {
  interface Window {
    google: any
  }
}

export function GoogleMapPicker({ onLocationSelect, initialAddress = "" }: GoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [searchValue, setSearchValue] = useState(initialAddress)
  const [selectedAddress, setSelectedAddress] = useState("")
  const autocompleteRef = useRef<HTMLInputElement>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

  // Inicializar el mapa
  useEffect(() => {
    // Cargar el script de Google Maps si no está cargado
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBGW3-TcoNINczBPOvOagfgzAK3fXhWI6E&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = initMap
      return () => {
        document.head.removeChild(script)
      }
    } else {
      initMap()
    }
  }, [])

  const initMap = useCallback(() => {
    if (mapRef.current && window.google) {
      // Coordenadas por defecto (Lima, Perú)
      const defaultLocation = { lat: -12.046374, lng: -77.042793 }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      setMap(mapInstance)

      // Crear marcador inicial
      const markerInstance = new window.google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      })

      setMarker(markerInstance)

      // Evento para actualizar la posición al arrastrar el marcador
      markerInstance.addListener("dragend", () => {
        const position = markerInstance.getPosition()
        if (position) {
          const lat = position.lat()
          const lng = position.lng()

          // Obtener la dirección a partir de las coordenadas (geocodificación inversa)
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address
              setSelectedAddress(address)
              onLocationSelect({ lat, lng, address })
            }
          })
        }
      })

      // Configurar autocompletado
      if (autocompleteRef.current) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
          types: ["address"],
          componentRestrictions: { country: "pe" }, // Restringir a Perú
        })

        autocompleteInstance.addListener("place_changed", () => {
          const place = autocompleteInstance.getPlace()

          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()

            // Centrar el mapa en la ubicación seleccionada
            mapInstance.setCenter({ lat, lng })
            mapInstance.setZoom(17)

            // Mover el marcador
            markerInstance.setPosition({ lat, lng })

            // Guardar la dirección seleccionada
            if (place.formatted_address) {
              setSelectedAddress(place.formatted_address)
              onLocationSelect({ lat, lng, address: place.formatted_address })
            }
          }
        })

        setAutocomplete(autocompleteInstance)
      }

      // Evento para añadir marcador al hacer clic en el mapa
      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng && markerInstance) {
          markerInstance.setPosition(event.latLng)

          // Obtener la dirección a partir de las coordenadas
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: event.latLng.toJSON() }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address
              setSelectedAddress(address)
              setSearchValue(address)
              onLocationSelect({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                address,
              })
            }
          })
        }
      })
    }
  }, [onLocationSelect])

  const handleSearch = () => {
    if (autocomplete && searchValue) {
      // El autocompletado se encargará de manejar la búsqueda
      // cuando el usuario seleccione una opción
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={autocompleteRef}
            type="text"
            placeholder="Buscar dirección"
            className="pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Button type="button" onClick={handleSearch}>
          Buscar
        </Button>
      </div>

      <div ref={mapRef} className="w-full h-[300px] rounded-md border border-gray-200"></div>

      {selectedAddress && (
        <div className="mt-2">
          <Label>Dirección seleccionada:</Label>
          <div className="p-2 bg-blue-50 rounded-md text-sm mt-1">{selectedAddress}</div>
        </div>
      )}
    </div>
  )
}

