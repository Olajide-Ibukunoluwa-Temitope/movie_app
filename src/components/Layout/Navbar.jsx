import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/services/auth";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="p-3 sm:p-4 border-b border-gray-800 h-16 sm:h-18 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-yellow-500 font-bold text-lg sm:text-xl cursor-pointer">
              MovieApp
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <Link href="/watchlist" data-testid="watchlist-link">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 group">
                <i className="ri-bookmark-3-line text-lg sm:text-xl group-hover:text-yellow-500"></i>
                <span className="text-sm sm:text-base rounded cursor-pointer group-hover:text-yellow-500">
                  Watchlist
                </span>
              </div>
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 sm:px-4 py-1 rounded cursor-pointer hover:bg-red-700 transition duration-300 text-sm sm:text-base"
            >
              SIGN OUT
            </button>
          ) : (
            <Link href="/auth">
              <span className="bg-red-600 px-3 sm:px-4 py-1 rounded cursor-pointer hover:bg-red-700 transition duration-300 text-sm sm:text-base">
                SIGN IN
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
