(async () => {
  try {
    // 1. Get CSRF Token
    const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;

    // 2. Attempt Login with Wrong Password
    const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': csrfRes.headers.get('set-cookie') || ''
      },
      body: new URLSearchParams({
        csrfToken: csrfToken,
        email: 'test@example.com',
        password: 'wrongpassword',
        redirect: 'false' // NextAuth flag to return JSON instead of 302
      }).toString()
    });

    const loginData = await loginRes.json();
    console.log("Login Response Status:", loginRes.status);
    console.log("Login Response Data:", loginData);
  } catch (error) {
    console.error("Test failed:", error);
  }
})();
