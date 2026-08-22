fetch('http://localhost:3000/api/auth/callback/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
}).then(async r => {
  console.log(r.status, await r.text())
})
