import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload = await req.json()
  const order = payload.record

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFY_EMAIL')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DocServe AI <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `📄 New Order from ${order.name}`,
      html: `
        <h2>New Document Request</h2>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Pages:</strong> ${order.pages}</p>
        <p><strong>Cost:</strong> ₹${order.cost}</p>
        <p><strong>Instructions:</strong> ${order.instructions || 'None'}</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <br/>
        <a href="https://doc-serve-ai-ovaz.vercel.app/admin/dashboard">View in Admin Dashboard →</a>
      `,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), { status: 200 })
})
