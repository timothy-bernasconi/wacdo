import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function Map({ restaurants, center, zoom = 13 }) {
  return (
    <MapContainer 
  center={center} 
  zoom={zoom} 
  scrollWheelZoom={false}
  style={{ height: '500px', width: '100%' }}
>
      <ChangeView center={center} zoom={zoom} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {restaurants.length === 0 && (
        <Marker position={[46.233, 6.32]}>
          <Popup>Point de départ</Popup>
        </Marker>
      )}

      {restaurants.map((resto) => (
        <Marker key={resto.id} position={resto.position}>
          <Popup>
            <strong>{resto.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map