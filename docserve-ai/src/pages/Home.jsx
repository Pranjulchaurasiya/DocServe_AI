import { Link } from 'react-router-dom'

const services = [
  {
    icon: '⌨️',
    title: 'Document Typing',
    desc: 'Professional typing of handwritten or scanned documents with accuracy and speed.',
  },
  {
    icon: '📄',
    title: 'PDF Formatting',
    desc: 'Clean, structured PDF formatting with proper headings, fonts, and layout.',
  },
  {
    icon: '📝',
    title: 'Resume Building',
    desc: 'Modern, ATS-friendly resumes crafted to help you stand out.',
  },
]

const steps = [
  { step: '01', title: 'Upload Document', desc: 'Upload your PDF or DOC file with instructions.' },
  { step: '02', title: 'Get Cost Estimate', desc: 'Automatic page count and cost calculation at ₹20/page.' },
  { step: '03', title: 'Make Payment', desc: 'Pay via UPI and upload your payment screenshot.' },
  { step: '04', title: 'Download Result', desc: 'Receive your processed document once approved.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500/40 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Powered by TechBug
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Smart Document Services,<br />Delivered Fast
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Upload your documents, get instant cost estimates, and receive professionally processed files — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/upload" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg">
              Upload Document
            </Link>
            <Link to="/order-status" className="bg-blue-500/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-500/60 transition-all border border-blue-400">
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Services</h2>
          <p className="text-gray-500 dark:text-gray-400">Professional document services at affordable rates</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.title} className="card hover:shadow-md transition-shadow group">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400">Simple 4-step process</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="card max-w-md mx-auto text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">₹20</div>
          <div className="text-gray-500 dark:text-gray-400 mb-4">per page</div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Simple, transparent pricing. No hidden charges. Cost is calculated automatically based on your document's page count.
          </p>
          <Link to="/upload" className="btn-primary inline-block">Get Started</Link>
        </div>
      </section>
    </div>
  )
}
