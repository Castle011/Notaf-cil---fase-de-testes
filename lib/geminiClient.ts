/**
 * Calls the backend Gemini proxy serverless function.
 * @param payload The data to send to the proxy, including model, contents, and config.
 * @returns The JSON response from the proxy.
 */
export async function callGeminiProxy(payload: any) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return body;
}
