import { useCallback, useState } from 'react'
import { useAppSelector } from '../../app/store/hooks';
import { API, notifierOperatorsList } from '../../helpers/constants';
import lowerFirstLetter from '../../helpers/lowerFirstLetter';
import type { INotify } from '../../types/notifiers';
import apiRequest from '../../helpers/apiRequest';
import ApiError from '../../helpers/ApiError';
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter';

const useCreateNotifier = () => {
    const servers = useAppSelector(state => state.servers.servers.list);
    const newNotifierServerId = useAppSelector(state => state.servers.new_notifier.server_id);

    const [optionProvider, setOptionProvider] = useState<string>('Telegram');
    const callSetOptionProvider = useCallback((value: string) => setOptionProvider(value), []);

    const [optionServer, setOptionServer] = useState<string>(
        servers.find(s => s.id === newNotifierServerId)?.name ?? 'serverName'
    );
    const callSetOptionServer= useCallback((value: string) => setOptionServer(value), []);

    const toSnakeCase = (str: string) => 
        str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

    const getOperatorFields = (formData: FormData, operator: INotify['provider']) => {
        const providerFields = notifierOperatorsList.find(o => o.name === capitalizeFirstLetter(operator))?.fields;
        
        if (!providerFields) return {};

        const credentials: Record<string, any> = {};

        for (const field of providerFields) {
            const camelName = lowerFirstLetter(field.name).replaceAll(' ', '');
            const value = formData.get(camelName);
            if (value !== null) {
            credentials[toSnakeCase(camelName)] = field.type === 'number' ? Number(value) : value;
        }
    }

    return credentials;
    };
    const getData = (formData: FormData) => {
        const provider = lowerFirstLetter(optionProvider);
        const serverId = servers.find(s => s.name === optionServer)?.id;
        return {
            server_id: serverId,
            provider,
            credentials: getOperatorFields(formData, provider as INotify['provider']),
            format: formData.get('message'),
            active: formData.get('status'),
        }
    } 

    const createNotifier = async (formData: FormData) => {
        const data = getData(formData);
        console.log(data);
        
        try {
            const newNotifier = await apiRequest(API.notify, {
                method: 'POST',
                body: data
            });
            console.log(newNotifier);
        } catch (error) {
            if (error instanceof ApiError) error.log();
        }

    };

    return {servers,
        optionProvider, setOptionProvider: callSetOptionProvider,
        optionServer, setOptionServer: callSetOptionServer,
        createNotifier
    }
}

export default useCreateNotifier