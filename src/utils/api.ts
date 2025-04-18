const API_BASE_URL = '/api/proxy/v1'; // Always use the Next.js API route

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('oauthToken'); // Assume the token is stored in localStorage
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  console.log('Using env : ', `${process.env.API_BASE_URL}`);
  console.log('Sending request to:', `${API_BASE_URL}${endpoint}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
