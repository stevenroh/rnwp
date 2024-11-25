export const wpFetch = (
  baseURL: string,
  endpoint: string,
  username?: string, // Optional username
  password?: string, // Optional password
  timeout: number = 5000 // Default timeout
) => {
  const controller = new AbortController();
  const { signal } = controller;

  // Combine baseURL and endpoint
  const url = `${baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  console.log(url);

  // Prepare headers
  const headers: Record<string, string> = {};
  if (username && password) {
    const encodedCredentials = btoa(`${username}:${password}`);
    headers.Authorization = `Basic ${encodedCredentials}`;
  }

  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      controller.abort(); // Abort the fetch
      reject(new Error("Request timed out"));
    }, timeout);
  });

  // Fetch request
  const fetchPromise = fetch(url, {
    method: "GET", // Or "POST", "PUT", etc.
    headers,
    signal,
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

  // Race between fetch and timeout
  return Promise.race([fetchPromise, timeoutPromise])
    .finally(() => clearTimeout(timeout));
};
