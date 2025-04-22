import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 border-b border-gray-800 h-18">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-yellow-500 font-bold text-xl cursor-pointer">
              MovieApp
            </span>
          </Link>
        </div>

        {/* <div className="relative w-96">
          <input
            type="text"
            placeholder="Search by movie title"
            className="w-full py-1 px-4 rounded-full bg-white text-gray-800 focus:outline-none"
          />
          <button className="absolute right-0 top-0 mt-1 mr-2">
            <i className="ri-search-2-line text-gray-500"></i>
          </button>
        </div> */}

        <div className="flex items-center space-x-4">
          <Link href="/watchlist">
            <span className=" px-4 py-2 rounded cursor-pointer">Watchlist</span>
          </Link>
          <Link href="/auth">
            <span className="bg-red-600 px-4 py-2 rounded cursor-pointer hover:bg-red-700 transition duration-300">
              SIGN IN
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
