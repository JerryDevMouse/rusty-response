import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import useCatchError from "../useCatchError";
import { setSeparateServer, setSeparateServerLoading, setSeparateServerNotifiers } from "../../app/store/slices/serversSlice";
import apiRequest from "../../helpers/apiRequest";
import { API } from "../../constants/api";
import type { IServer } from "../../types/servers";
import type { IResponse } from "../../types/api";
import type { INotify } from "../../types/notifiers";

const useGetServerDataById = (id: IServer["id"]) => {    
  const dispatch = useAppDispatch();
  const servers = useAppSelector((state) => state.servers.servers.list);
  const catchError = useCatchError();

  const fetchNotifiers = useCallback(async () => {
    try {
        const serverNotifiers = await apiRequest<IResponse<INotify>>(
        `${API.notifyServer}${id}?limit=999&offset=0`
        );
        dispatch(setSeparateServerNotifiers(serverNotifiers.items));
    } catch (err) {
        catchError(err);
    }
  }, [id]);

  const fetchServerData = useCallback(async () => {
    try {
      dispatch(setSeparateServerLoading(true));

      const stateServer = servers.find((s) => s.id === id);

      if (stateServer) {
        dispatch(setSeparateServer(stateServer));
        await fetchNotifiers();
        return;
      }

      const serverData = await apiRequest<IServer>(`${API.server}${id}`);
      
      dispatch(setSeparateServer({
          ...serverData,
          notifiers: [],
        }));
      
      await fetchNotifiers();
    } catch (err) {
      catchError(err);
    } finally {
      dispatch(setSeparateServerLoading(false));
    }
  }, [id, servers]);

  useEffect(() => {
    if (id) fetchServerData();
  }, [id]);
};

export default useGetServerDataById;