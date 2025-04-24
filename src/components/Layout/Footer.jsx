export default function Footer() {
  return (
    <footer className="py-4 sm:py-6 px-4 sm:px-6 border-t h-16 sm:h-18 border-gray-800">
      <div className="container mx-auto text-center text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()}, MovieApp
      </div>
    </footer>
  );
}
