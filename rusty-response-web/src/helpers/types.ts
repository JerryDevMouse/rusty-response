export interface IChildren {
    children: React.ReactNode
}
export type TSetState<T> = React.Dispatch<React.SetStateAction<T>>

export type TFontSize = 'xxl' | 'xl' | 'large' | 'medium' | 'small' | 'tiny';

export type TFontColorShape = 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export type TFontSizeCategories = {
    [key in TFontSize]: number
}

export type TIconName = 'arrow_left' | 'arrow_right' | 'arrow_top' | 'avatar' | 'bitrix' | 'date' | 'discord' | 'header_windows' | 'list_sort' | 'no_servers'| 'overview_failed'| 'overview_notifiers'| 'overview_pause'| 'overview_servers'| 'overview_success'| 'plus'| 'search'| 'sidebar_docs'| 'sidebar_notifiers'| 'sidebar_overview'| 'sidebar_servers'| 'telegram' | 'dots' | 'visit' | 'edit'

export type TSidebarNavSection = 'dashboards' | 'pages';
export type TSidebarNavName = 'overview' | 'servers' | 'notifiers' | 'docs';

export type TsidebarNav = {
  [key in TSidebarNavSection]: TSidebarNavName[]
}

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

export interface IButtonProps extends IChildren {
  onClick?: VoidFunction,
  type: 'submit' | 'button'
}