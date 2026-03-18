import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
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

  const handleFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setError('')

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(f.type)) {
      setError('Only PDF or DOC/DOCX files are allowed.')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File size must be under 20MB.')
      return
    }

    setFile(f)

    // Count pages for PDF
    if (f.type === 'application/pdf') {
      try {
        const buffer = await f.arrayBuffer()
        const pdf = await PDFDocument.load(buffer)
        setPages(pdf.getPageCount())
      } catch {
        setPages(null)
        setError('Could not read PDF page count. You can still submit.')
      }
    } else {
      // DOC files — estimate or leave null
      setPages(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select a file.'); return }
    if (!form.name || !form.phone) { setError('Name and phone are required.'); return }

    setUploading(true)
    setError('')

    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
        (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        (err) => { setError(err.message); setUploading(false) },
        async () => {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref)
          const cost = pages ? pages * COST_PER_PAGE : null

          const docRef = await addDoc(collection(db, 'orders'), {
            name: form.name,
            phone: form.phone,
            instructions: form.instructions,
            file_url: fileUrl,
            file_name: file.name,
            pages: pages ?? 'unknown',
            cost: cost ?? 'TBD',
            payment_ss_url: '',
            transaction_id: '',
            status: 'pending',
            final_file_url: '',
            created_at: serverTimestamp(),
          })

          navigate(`/payment/${docRef.id}`, { state: { cost, pages, name: form.name } })
        }
      )
    } catch (err) {
      setError(err.message)
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Document</h1>
        <p className="text-gray-500 dark:text-gray-400">Fill in your details and upload your file to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* File drop zone */}
        <div
          onClick={() => fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            file ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
          {file ? (
            <div>
              <div className="text-3xl mb-2">📄</div>
              <p className="font-medium text-blue-700 dark:text-blue-400">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3">☁️</div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Click to upload PDF or DOC</p>
              <p className="text-sm text-gray-400 mt-1">Max 20MB</p>
            </div>
          )}
        </div>

        {/* Cost preview */}
        {file && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pages: <span className="font-semibold text-gray-900 dark:text-white">{pages ?? 'Auto-detect (DOC)'}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Rate: <span className="font-semibold">₹{COST_PER_PAGE}/page</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold text-blue-600">
                {pages ? `₹${pages * COST_PER_PAGE}` : 'TBD'}
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="label">Full Name *</label>
          <input
            className="input-field"
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Phone Number *</label>
          <input
            className="input-field"
            placeholder="10-digit phone number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div>
          <label className="label">Instructions</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Any specific instructions for processing your document..."
            value={form.instructions}
            onChange={e => setForm({ ...form, instructions: e.target.value })}
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

        {uploading && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Uploading...</span><span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit & Proceed to Payment →'}
        </button>
      </form>
    </div>
  )
}
