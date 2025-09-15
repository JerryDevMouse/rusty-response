import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { API } from '../../constants/api';
import lowerFirstLetter from '../../helpers/lowerFirstLetter';
import type { INotify } from '../../types/notifiers';
import apiRequest from '../../helpers/apiRequest';
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter';
import { notifierProviderFields } from '../../constants/notifiers';
import useModalUI from '../useModalUI';
import useCatchError from '../useCatchError';
import toSnakeCase from '../../helpers/toSnakeCase';
import { setSeparateNotifier } from '../../app/store/slices/serversSlice';

const useFormNotifier = (type: 'Create' | 'Edit') => {
    // todo: fetch notify by id, if not in state
    const servers = useAppSelector(state => state.servers.servers.list);
    const separateNotifier = useAppSelector(state => state.servers.separateNotifier.notifier);

    const [optionProvider, setOptionProvider] = useState<string>(
        separateNotifier.provider ? capitalizeFirstLetter(separateNotifier.provider) : 'Telegram'
    );
    const callSetOptionProvider = useCallback((value: string) => setOptionProvider(value), []);

    const [optionServer, setOptionServer] = useState<string>(
        servers.find(s => s.id === separateNotifier.server_id)?.name ?? 'Select Server'
    );
    const callSetOptionServer= useCallback((value: string) => setOptionServer(value), []);

    const {showModal} = useModalUI();
    const catchError = useCatchError();
    const dispatch = useAppDispatch();

    const getOperatorFields = (formData: FormData, operator: INotify['provider']) => {
        const providerFields = notifierProviderFields.find(o => o.name === capitalizeFirstLetter(operator))?.fields;
        
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
            active: Boolean(formData.get('status')),
        }
    } 

    const onSubmitRequest = async (formData: FormData) => {
        const data = getData(formData);
        
        try {
            await apiRequest(`${API.notify}${type === 'Edit' ? separateNotifier.id : ''}`, {
                method: type === 'Create' ? 'POST' : 'PUT',
                body: data
            });
            showModal(
                `Succesfully ${type === 'Create' ? 'created' : 'updated'}`, 
                'success'
            )
            dispatch(setSeparateNotifier({}))
            return true;
        } catch (error) {
            catchError(error);
            return false;
        }
    };

    return {servers, separateNotifier,
        optionProvider, setOptionProvider: callSetOptionProvider,
        optionServer, setOptionServer: callSetOptionServer,
        onSubmitRequest
    }
}

export default useFormNotifier