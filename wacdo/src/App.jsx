import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import Overlay from './components/Overlay'
import Map from './components/Map'
import 'leaflet/dist/leaflet.css'

function App() {


  return (
    <div>
      <SearchBar/>
      <Map/>
      <Overlay/>
      </div>
     
  
  )
}

export default App
