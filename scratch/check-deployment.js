async function check() {
  const res = await fetch('https://jansetu-connect.vercel.app/admin/dashboard', {
    headers: { 'Cache-Control': 'no-cache' }
  });
  console.log('Dashboard response headers:', Object.fromEntries(res.headers.entries()));
  const html = await res.text();
  console.log('Includes super_admin in HTML/TSR state?', html.includes('super_admin'));
  console.log('HTML length:', html.length);
  
  const loginRes = await fetch('https://jansetu-connect.vercel.app/admin/login', {
    headers: { 'Cache-Control': 'no-cache' }
  });
  console.log('Login status:', loginRes.status);
  const loginHtml = await loginRes.text();
  console.log('Login HTML length:', loginHtml.length);
}

check().catch(console.error);
