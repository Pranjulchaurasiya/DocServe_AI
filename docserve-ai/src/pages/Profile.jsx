import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'

const skills = ['Python', 'Flask', 'Web Development', 'Firebase', 'React', 'AI/ML']

export default function Profile() {
  const { orderId } = useParams()

  const [profileUrl, setProfileUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  // 🔥 Upload + DB Save
  const handleUpload = async (file) => {
    if (!file) return

    setUploading(true)

    try {
      const fileName = `profile_${Date.now()}_${file.name}`

      // 📤 Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file)

      if (error) throw error

      // 🔗 Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName)

      const imageUrl = urlData.publicUrl

      setProfileUrl(imageUrl)

      // 💾 Save to DB
      await supabase
        .from('orders')
        .update({ profile_url: imageUrl })
        .eq('id', orderId)

    } catch (err) {
      console.log("Upload error:", err.message)
    } finally {
      setUploading(false)
    }
  }

  // 🔥 Fetch on reload
  useEffect(() => {
    const fetchProfile = async () => {
      if (!orderId) return

      const { data, error } = await supabase
        .from('orders')
        .select('profile_url')
        .eq('id', orderId)
        .single()

      if (!error && data?.profile_url) {
        setProfileUrl(data.profile_url)
      }
    }

    fetchProfile()
  }, [orderId])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* 🖼️ Profile Image */}
          <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={profileUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pranjul Chaurasiya
            </h1>

            <p className="text-blue-600 font-medium mt-0.5">
              Developer & Document Service Provider
            </p>

            {/* 📤 Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files[0])}
              className="mt-2 text-sm"
            />

            {uploading && (
              <p className="text-xs text-gray-500 mt-1">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          About TechBug
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          TechBug is a student-driven tech group focused on providing smart digital solutions like document services, AI tools, and web-based platforms.
        </p>
      </div>

      {/* Skills */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Skills & Technologies
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={skill}
              className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Contact
        </h2>

        <div className="space-y-2 text-sm">
          <p>📞 +91 9532998196</p>
          <p>✉️ solutionsattechbug@gmail.com</p>
        </div>
      </div>

    </div>
  )
}