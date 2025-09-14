export type TFontSize = 'xxl' | 'xl' | 'large' | 'medium' | 'small' | 'tiny';

export type TFontColorShape = 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export type TFontSizeCategories = {
    [key in TFontSize]: number
}

export type TIconName = 'arrow_left' | 'arrow_right' | 'arrow_top' | 'arrow_bottom' | 'avatar' | 'bitrix' | 'date' | 'discord' | 'header_windows' | 'list_sort' | 'no_servers'| 'overview_failed'| 'overview_notifiers'| 'overview_pause'| 'overview_servers'| 'overview_success'| 'plus'| 'search'| 'sidebar_docs'| 'sidebar_notifiers'| 'sidebar_overview'| 'sidebar_servers'| 'telegram' | 'dots' | 'visit' | 'edit' | 'delete' | 'link'

export type TModalIconName = 'copy' | 'error' | 'loading' | 'success'
export type TModalIconPath = `modal/${TModalIconName}`

export type TSidebarNavSection = 'dashboards' | 'pages';
export type TSidebarNavName = 'overview' | 'servers' | 'notifiers' | 'docs';

export type TsidebarNav = {
  [key in TSidebarNavSection]: TSidebarNavName[]
}