import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-gray-900 dark:text-white">DocServe <span className="text-blue-600">AI</span></span>
          <p className="text-sm text-gray-500 mt-1">Smart document services by TechBug</p>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/upload" className="hover:text-blue-600 transition-colors">Upload</Link>
          <Link to="/order-status" className="hover:text-blue-600 transition-colors">Orders</Link>
          <Link to="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
        </div>
        <p className="text-xs text-gray-400">© 2026 TechBug. All rights reserved.</p>
      </div>
    </footer>
  )
}
