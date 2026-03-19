import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { PDFDocument } from 'pdf-lib'

const COST_PER_PAGE = 20

export default function Upload() {
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({ name: '', phone: '', instructions: '' })
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  // 📄 Handle file selection
  const handleFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setError('')

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowed.includes(f.type)) {
      setError('Only PDF or DOC/DOCX files are allowed.')
      return
    }

    if (f.size > 40 * 1024 * 1024) {
      setError('File size must be under 40MB.')
      return
    }

    setFile(f)

    // 📊 Count PDF pages
    if (f.type === 'application/pdf') {
      try {
        const buffer = await f.arrayBuffer()
        const pdf = await PDFDocument.load(buffer)
        setPages(pdf.getPageCount())
      } catch {
        setPages(null)
        setError('Could not read PDF page count.')
      }
    } else {
      setPages(null)
    }
  }

  // 🚀 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) return setError('Please select a file.')
    if (!form.name || !form.phone) return setError('Name and phone required.')

    setUploading(true)
    setError('')
    setProgress(20)

    try {
      // 📁 File upload to Supabase
      const fileName = `${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('uploads') // ✅ bucket name
        .upload(fileName, file)

      if (uploadError) throw uploadError

      setProgress(50)

      // 🔗 Get public URL
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)

      const fileURL = data.publicUrl

      // 💰 Calculate cost
      const cost = pages ? pages * COST_PER_PAGE : null

      setProgress(75)

      // 🗄️ Save to database
      const { data: order, error: dbError } = await supabase
        .from('orders')
        .insert([
          {
            name: form.name,
            phone: form.phone,
            instructions: form.instructions,
            file_url: fileURL,
            pages: pages ?? null,
            cost: cost,
            status: 'pending'
            
          }
        ])
        .select()
        .single()

      if (dbError) throw dbError

      setProgress(100)

      // ➡️ Navigate to payment page
      navigate(`/payment/${order.id}`, {
        state: { cost, pages }
      })

    } catch (err) {
      console.error(err)
      setError(err.message)
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Upload Document</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Upload Box */}
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed p-6 text-center cursor-pointer rounded-lg"
        >
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFile}
          />

          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>Click to upload PDF/DOC</p>
          )}
        </div>

        {/* Cost */}
        {file && (
          <div className="p-4 bg-gray-100 rounded">
            <p>Pages: {pages ?? 'Auto detect'}</p>
            <p>Rate: ₹20/page</p>
            <p className="font-bold">
              Total: {pages ? `₹${pages * COST_PER_PAGE}` : 'TBD'}
            </p>
          </div>
        )}

        {/* Inputs */}
        <input
          placeholder="Name"
          className="border p-2 w-full"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <textarea
          placeholder="Instructions"
          className="border p-2 w-full"
          value={form.instructions}
          onChange={e => setForm({ ...form, instructions: e.target.value })}
        />

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Progress */}
        {uploading && (
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-500 h-2"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>

      </form>
    </div>
  )
}