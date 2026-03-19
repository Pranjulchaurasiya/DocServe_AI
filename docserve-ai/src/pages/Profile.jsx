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

          {/* Phone — call or WhatsApp */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-lg">📞</div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">+91 9532998196</p>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:+919532998196"
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Call
              </a>
              <a
                href="https://wa.me/919532998196"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Email — opens Gmail compose */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"/>
                <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"/>
                <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
                <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"/>
                <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">solutionsattechbug@gmail.com</p>
            </div>
            <a
              href="https://mail.google.com/mail/?view=cm&to=solutionsattechbug@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Email
            </a>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-[#0A66C2]">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">LinkedIn</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">pranjul-chaurasiya-developers</p>
            </div>
            <a
              href="https://www.linkedin.com/in/pranjul-chaurasiya-developers/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#0A66C2] text-white text-xs font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Connect
            </a>
          </div>

        </div>
      </div>

    </div>
  )
}
