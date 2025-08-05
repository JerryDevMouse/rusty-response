import ApiError from "./apiError";

interface IApiRequest {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
}

const apiRequest = async <T = any> (
  endpoint: string,
  { method = 'GET', body }: IApiRequest
): Promise<T> => {
  const response = await fetch(`${import.meta.env.VITE_HOST}${endpoint}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }), 
  })

  if (!response.ok) {
    throw new ApiError(response.statusText, response.status);
  }

  return response.json();
}

export default apiRequest