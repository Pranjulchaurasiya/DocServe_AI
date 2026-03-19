import { useState } from 'react'
import { supabase } from '../supabase'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳' },
  payment_submitted: { label: 'Payment Submitted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '💳' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '❌' },
}

export default function OrderStatus() {
  const [searchVal, setSearchVal] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchVal.trim()) return
    setLoading(true)
    setError('')
    setOrders([])

    try {
      // Try phone number first
      let { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('phone', searchVal.trim())
        .order('created_at', { ascending: false })

      if (err) throw err

      // If no results, try as UUID order ID
      if (!data || data.length === 0) {
        const { data: byId, error: idErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', searchVal.trim())

        if (idErr) throw idErr
        data = byId || []
      }

      setOrders(data)
      setSearched(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Track Your Order</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your phone number or Order ID to check status.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          className="input-field flex-1"
          placeholder="Phone number or Order ID"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {searched && orders.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 dark:text-gray-400">No orders found for <strong>{searchVal}</strong></p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => {
          const s = statusConfig[order.status] || statusConfig.pending
          return (
            <div key={order.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
                  {s.icon} {s.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-gray-400 text-xs">File</p>
                  <p className="font-medium truncate">{order.file_name || 'Document'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Pages</p>
                  <p className="font-medium">{order.pages}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Cost</p>
                  <p className="font-medium text-blue-600">{order.cost ? `₹${order.cost}` : 'TBD'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
              </div>

              {order.status === 'approved' && order.final_file_url && (
                <a
                  href={order.final_file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center gap-2 text-sm"
                >
                  ⬇️ Download Final File
                </a>
              )}

              {order.status === 'rejected' && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  Your order was rejected. Please contact support.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
