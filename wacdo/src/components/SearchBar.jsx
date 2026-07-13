import { useState, useEffect } from 'react'

function SearchBar({ onSelectCity }) {
  const [texte, setTexte] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (texte.trim().length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texte)}&format=json&addressdetails=1&limit=5`
        const response = await fetch(url, {
          headers: { 'User-Agent': 'MonAppMcDoReact/1.0 (votre-email@example.com)' }
        })
        const data = await response.json()

        const villes = data.filter((item) =>
          ['city', 'town', 'village', 'municipality', 'administrative'].includes(item.type) ||
          item.class === 'place'
        )

        setSuggestions(villes.length > 0 ? villes : data)
      } catch (error) {
        console.error("Erreur autocomplétion :", error)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [texte])

  const handleSelect = (suggestion) => {
    setTexte(suggestion.display_name)
    setSuggestions([])
    onSelectCity(suggestion)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Entrez une ville..."
      />

      {loading && <div className="search-loading">Recherche...</div>}

      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((s) => (
            <li key={s.place_id} onClick={() => handleSelect(s)}>
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar