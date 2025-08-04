export interface IChildren {
    children: React.ReactNode
}

export type TFontSize = 'xxl' | 'xl' | 'large' | 'medium' | 'small' | 'tiny';

export type TFontColorShape = 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export type TFontSizeCategories = {
    [key in TFontSize]: number
}

type TFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ApiEndpoints = 'signup' | 'signin' | 'verify' | 'server' | 'notify' | 'notifyServer';

export type TRoutes = {
  [key in ApiEndpoints]: {
    path: string;
    method: TFetchMethod[];
  };
}