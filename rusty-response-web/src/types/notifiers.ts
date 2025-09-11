import type { IUser } from "../helpers/types";
import type { IServer } from "./servers";

export interface INotifyOperator {
    name: string;
    fields: {
        name: string;
        type: string;
    }[];
}
export type TProvider = 'telegram' | 'discord'; // todo: | 'bitrix'

export interface INotify {
	id: number,
	user_id: IUser['id'],
	server_id: IServer['id'],
	provider: TProvider,
	credentials: {
		"chat_id": -444444444,
		"token": "TOKEN"
	},
	format: string,
	active: boolean,
	created_at: any,
	updated_at: any
}
//todo: date type