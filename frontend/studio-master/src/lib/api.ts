// frontend/studio-master/src/lib/api.ts

/**
 * A wrapper around the native fetch function to provide consistent error handling.
 * @param url The URL to fetch.
 * @param options The options for the fetch request.
 * @returns A Promise that resolves to the Response object if the request is successful.
 * @throws An error if the request fails or the response is not ok.
 */
export async function fetchWrapper(
  url: string | URL | Request,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData;
      try {
        // Attempt to parse error response as JSON, common for FastAPI
        errorData = await response.json();
      } catch (jsonError) {
        // If response is not JSON or another error occurs during parsing
        console.error('Error parsing JSON error response:', jsonError);
        // Fallback to statusText or a generic message
        throw new Error(response.statusText || 'An API error occurred, and error details could not be parsed.');
      }
      // Prioritize FastAPI's 'detail' field, then a message from errorData, then response.statusText
      throw new Error(errorData?.detail || errorData?.message || response.statusText || 'An API error occurred.');
    }

    return response;
  } catch (error: any) {
    console.error('API fetch error:', error);
    // Re-throw a new error with a user-friendly message
    // If error.message is already set (e.g. from the !response.ok block), use it
    throw new Error(error.message || 'A network error occurred or the API is unreachable.');
  }
}
