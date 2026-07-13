import { useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'

import SearchBar from './components/SearchBar'
import Overlay from './components/Overlay'
import Map from './components/Map'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [mapCenter, setMapCenter] = useState([46.233, 6.32])
  const [zoom, setZoom] = useState(13)

  const handleSelectCity = async (city) => {
    const lat = parseFloat(city.lat)
    const lon = parseFloat(city.lon)
    setMapCenter([lat, lon])
    setZoom(13)

    const [south, north, west, east] = city.boundingbox.map(parseFloat)

    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["name"~"McDonald's",i](${south},${west},${north},${east});
          way["name"~"McDonald's",i](${south},${west},${north},${east});
        );
        out center;
      `

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: 'data=' + encodeURIComponent(overpassQuery)
      })
      const data = await response.json()

      console.log("Données reçues d'Overpass :", data)

      const resultats = data.elements.map((el) => {
        const coords = el.type === 'node'
          ? [el.lat, el.lon]
          : [el.center.lat, el.center.lon]

        return {
          id: el.id,
          name: el.tags?.name || "McDonald's",
          position: coords
        }
      })

      setRestaurants(resultats)

      if (resultats.length === 0) {
        alert("Aucun McDonald's trouvé dans cette ville.")
      }

    } catch (error) {
      console.error("Erreur Overpass :", error)
    }
  }

  return (
    <div className="app-container">
      <SearchBar onSelectCity={handleSelectCity} />
      <Map restaurants={restaurants} center={mapCenter} zoom={zoom} />
      <Overlay />
    </div>
  )
}

export default App