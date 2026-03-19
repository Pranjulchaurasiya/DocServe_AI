import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const UPI_ID = 'techbug@upi'
const UPI_NAME = 'TechBug DocServe'

export default function Payment() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const cost = state?.cost
  const pages = state?.pages
  const name = state?.name

  const [txnId, setTxnId] = useState('')
  const [ssFile, setSsFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ssFile) { setError('Please upload your payment screenshot.'); return }

    setUploading(true)
    setError('')
    setProgress(30)

    try {
      const ssPath = `payments/${orderId}_${Date.now()}_${ssFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('payments')
        .upload(ssPath, ssFile, { contentType: ssFile.type })

      if (uploadError) throw uploadError
      setProgress(70)

      const { data: { publicUrl: ssUrl } } = supabase.storage
        .from('payments')
        .getPublicUrl(ssPath)

      const { error: dbError } = await supabase
        .from('orders')
        .update({
          payment_ss_url: ssUrl,
          transaction_id: txnId,
          status: 'payment_submitted',
        })
        .eq('id', orderId)

      if (dbError) throw dbError
      setProgress(100)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Payment Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Your order ID is:</p>
        <code className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-blue-600 font-mono text-sm block mb-6">{orderId}</code>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Save this ID to track your order. We'll process it shortly.</p>
        <button onClick={() => navigate('/order-status')} className="btn-primary">Track My Order</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Payment</h1>
        <p className="text-gray-500 dark:text-gray-400">Pay via UPI and upload your payment screenshot.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-xs text-blue-600 truncate max-w-[120px]">{orderId}</span>
            </div>
            {name && <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{name}</span></div>}
            {pages && <div className="flex justify-between"><span className="text-gray-500">Pages</span><span className="font-medium">{pages}</span></div>}
            <div className="border-t dark:border-gray-700 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-xl text-blue-600">{cost ? `₹${cost}` : 'TBD'}</span>
            </div>
          </div>
        </div>

        <div className="card text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Pay via UPI</h3>
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-4xl">📱</span>
          </div>
          <p className="text-xs text-gray-500 mb-1">UPI ID</p>
          <p className="font-mono font-semibold text-blue-600 text-sm">{UPI_ID}</p>
          <p className="text-xs text-gray-400 mt-1">{UPI_NAME}</p>
          {cost && (
            <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500">Amount to pay</p>
              <p className="font-bold text-blue-600 text-lg">₹{cost}</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <h3 className="font-semibold text-gray-900 dark:text-white">Upload Payment Proof</h3>

        <div>
          <label className="label">Transaction ID (optional)</label>
          <input
            className="input-field"
            placeholder="UPI transaction reference number"
            value={txnId}
            onChange={e => setTxnId(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Payment Screenshot *</label>
          <input
            type="file"
            accept="image/*"
            className="input-field cursor-pointer"
            onChange={e => setSsFile(e.target.files[0])}
            required
          />
          {ssFile && <p className="text-xs text-green-600 mt-1">✓ {ssFile.name}</p>}
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

        {uploading && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Uploading...</span><span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={uploading}>
          {uploading ? 'Submitting...' : 'Submit Payment Proof'}
        </button>
      </form>
    </div>
  )
}
