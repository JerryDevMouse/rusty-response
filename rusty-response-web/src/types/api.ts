export type ApiEndpoints = 'signup' | 'signin' | 'verify' | 'server' | 'notify' | 'notifyServer';

export type TRoutes = {
  [key in ApiEndpoints]: string;
}

export interface IServerError {
  error: string,
  code: string,
  details: string | null
}
export interface IResponse<T = any> {
  items: T[],
  limit: number,
  offset: number,
  total: number
}

export interface IUser {
	id: number,
	username: string,
	role: string,
	created_at: any,
	updated_at: any
}
// todo: write a type for Date when @JerryDevMouse does it