export default async function createRequest(options, callback) {
  const url = `https://my-first-proect.onrender.com${options.url}`;
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: options.body,
    });
    const data = await response.json();
    await callback(data);
  } catch (error) {
    await callback(error);
  }
}
