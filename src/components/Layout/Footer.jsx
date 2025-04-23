export default function Footer() {
  return (
    <footer className="py-6 px-4 border-t h-18 border-gray-800">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}, MovieApp
      </div>
    </footer>
  );
}
