import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/services/auth";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="p-4 border-b border-gray-800 h-18 flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-yellow-500 font-bold text-xl cursor-pointer">
              MovieApp
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <Link href="/watchlist" data-testid="watchlist-link">
              <div className="flex items-center gap-2 px-4 py-2 group">
                <i className="ri-bookmark-3-line text-xxl group-hover:text-yellow-500"></i>
                <span className=" rounded cursor-pointer group-hover:text-yellow-500">
                  Watchlist
                </span>
              </div>
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-1 rounded cursor-pointer hover:bg-red-700 transition duration-300"
            >
              SIGN OUT
            </button>
          ) : (
            <Link href="/auth">
              <span className="bg-red-600 px-4 py-1 rounded cursor-pointer hover:bg-red-700 transition duration-300">
                SIGN IN
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
