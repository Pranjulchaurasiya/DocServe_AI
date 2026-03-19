const skills = ['Python', 'Flask', 'Web Development', 'Firebase', 'React', 'AI/ML']

export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Profile Photo */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-blue-100">
            <img src="https://rwmssdpbzloafnevnjvc.supabase.co/storage/v1/object/public/profiles/profile_1773945719142_cropped_circle_image.png" alt="Pranjul Chaurasiya" className="w-full h-full object-cover" />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pranjul Chaurasiya</h1>
            <p className="text-blue-600 font-medium mt-0.5">Developer & Document Service Provider</p>
            <div className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">TechBug Organization</span>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">About TechBug</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          TechBug is a student-driven tech group focused on providing smart digital solutions like document services, AI tools, and web-based platforms to simplify everyday problems.
        </p>
      </div>

      {/* Skills */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Skills & Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Services Offered</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: '⌨️', title: 'Document Typing' },
            { icon: '📄', title: 'PDF Formatting' },
            { icon: '📝', title: 'Resume Building' },
          ].map(s => (
            <div key={s.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-lg">📞</div>
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">+91 9532998196</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-lg">✉️</div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">solutionsattechbug@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
