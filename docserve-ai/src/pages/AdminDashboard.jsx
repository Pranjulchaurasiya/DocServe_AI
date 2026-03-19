import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAdminAuth } from '../context/AdminAuthContext'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  payment_submitted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState({})
  const [uploadError, setUploadError] = useState({})
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isAdmin) { navigate('/admin'); return }
    fetchOrders()
  }, [isAdmin])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (!error) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const uploadFinalFile = async (orderId, file) => {
    setUploading(prev => ({ ...prev, [orderId]: 10 }))
    setUploadError(prev => ({ ...prev, [orderId]: null }))

    try {
      const filePath = `${orderId}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('final')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError
      setUploading(prev => ({ ...prev, [orderId]: 70 }))

      const { data: { publicUrl } } = supabase.storage
        .from('final')
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from('orders')
        .update({ final_file_url: publicUrl, status: 'approved' })
        .eq('id', orderId)

      if (dbError) throw dbError

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, final_file_url: publicUrl, status: 'approved' } : o))
    } catch (err) {
      console.error(err)
      setUploadError(prev => ({ ...prev, [orderId]: err.message }))
    } finally {
      setUploading(prev => { const n = { ...prev }; delete n[orderId]; return n })
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (!isAdmin) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchOrders} className="btn-secondary text-sm">↻ Refresh</button>
          <button onClick={() => { logout(); navigate('/admin') }} className="btn-secondary text-sm text-red-600">Logout</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'payment_submitted', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 font-mono truncate">{order.id}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><p className="text-xs text-gray-400">Name</p><p className="font-medium">{order.name}</p></div>
                    <div><p className="text-xs text-gray-400">Phone</p><p className="font-medium">{order.phone}</p></div>
                    <div><p className="text-xs text-gray-400">Pages</p><p className="font-medium">{order.pages}</p></div>
                    <div><p className="text-xs text-gray-400">Cost</p><p className="font-medium text-blue-600">{order.cost ? `₹${order.cost}` : 'TBD'}</p></div>
                  </div>
                  {order.instructions && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      📋 {order.instructions}
                    </p>
                  )}
                  {order.transaction_id && (
                    <p className="text-xs text-gray-500 mt-1">Txn ID: <span className="font-mono">{order.transaction_id}</span></p>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  {order.file_url && (
                    <a href={order.file_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs text-center">
                      📄 View Document
                    </a>
                  )}
                  {order.payment_ss_url && (
                    <a href={order.payment_ss_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs text-center">
                      💳 View Payment SS
                    </a>
                  )}

                  {order.status !== 'rejected' && (
                    <>
                      <label className="cursor-pointer">
                        <span className="btn-secondary text-xs block text-center">
                          {uploading[order.id] !== undefined ? `Uploading ${uploading[order.id]}%` : '⬆️ Upload Final File'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={e => e.target.files[0] && uploadFinalFile(order.id, e.target.files[0])}
                        />
                      </label>
                      {uploadError[order.id] && (
                        <p className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">{uploadError[order.id]}</p>
                      )}
                      {order.status !== 'approved' && (
                        <>
                          <button
                            onClick={() => updateStatus(order.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => updateStatus(order.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {order.final_file_url && (
                    <a href={order.final_file_url} target="_blank" rel="noreferrer" className="text-xs text-green-600 text-center">
                      ✓ Final file uploaded
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
