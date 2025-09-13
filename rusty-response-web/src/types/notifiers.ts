import type { IUser } from "../types/api";
import type { IServer } from "./servers";

export interface INotifyOperator {
    name: string;
    fields: {
        name: string;
        type: string;
    }[];
}
export type TProvider = 'telegram' | 'discord'; // todo: | 'bitrix'

export interface ITelegramCredentials {
	chat_id: number | null,
	token: string | null
}
export interface IDiscordCredentials {
	chat_id: number | null,
	token: string | null
}

export interface INotify {
	id: number,
	user_id: IUser['id'],
	server_id: IServer['id'],
	provider: TProvider,
	credentials: ITelegramCredentials | IDiscordCredentials,
	format: string,
	active: boolean,
	created_at: any,
	updated_at: any
}
//todo: date type