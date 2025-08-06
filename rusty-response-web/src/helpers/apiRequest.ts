import ApiError from "./ApiError";
import type { IServerError } from "./types";

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
  
  let responseData = null;
  const isJson = response.headers.get('Content-Type')?.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      responseData = await response.json().catch(() => null);
    }
    if (responseData && typeof responseData === 'object' && 'error' in responseData) {
      const {error, code, details} = responseData as IServerError;
      throw new ApiError(error, Number(code), details);
    } else {
      throw new ApiError(`Response error: ${response.status}`, response.status);
    }
  }

  return response.json();
}

export default apiRequest