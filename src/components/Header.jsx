import { Link, NavLink } from "react-router-dom"
import logo from "../assets/logo.png"

export default function Header() {
  const lien =
    "rounded-full px-5 py-2 transition duration-200"

  const lienActif =
    "bg-[#CA7CDF] text-white shadow"

  const lienInactif =
    "hover:bg-[#F3E3F8]"

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EF] shadow-sm">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-8">

        <Link to="/">
          <img
            src={logo}
            alt="Eglise"
            className="h-30 w-auto py-1 transition duration-300 hover:scale-105"
          />
        </Link>

        <nav className="flex gap-4 text-lg">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${lien} ${
                isActive ? lienActif : lienInactif
              }`
            }
          >
            Accueil
          </NavLink>

          <NavLink
            to="/favoris"
            className={({ isActive }) =>
              `${lien} ${
                isActive ? lienActif : lienInactif
              }`
            }
          >
            Favoris
          </NavLink>

          <NavLink
            to="/carte"
            className={({ isActive }) =>
              `${lien} ${
                isActive ? lienActif : lienInactif
              }`
            }
          >
            Carte
          </NavLink>

        </nav>

      </div>
    </header>
  )
}