async function testPathServerFn() {
  const url = 'https://jansetu-connect.vercel.app/_server/src_lib_admin_functions_ts_getMyAdminRole_createServerFn_handler';
  console.log('Testing server fn GET on path:', url);
  const res = await fetch(url, {
    method: 'GET',
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response text:', text);
}

testPathServerFn().catch(console.error);
