import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Eglise from "./pages/Eglise"
import Favoris from "./pages/Favoris"
import Carte from "./pages/Carte"

function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/eglise/:id" element={<Eglise />} />
  <Route path="/favoris" element={<Favoris />} />
  <Route path="/carte" element={<Carte />} />
</Routes>
  )
}

export default App