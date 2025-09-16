import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TModalIconName, TModalIconPath } from "../../../types/ui";

interface IModalState {
    text: string,
    iconName: TModalIconPath,
    show: boolean,
    isHiding: boolean
}
interface ISetModalPayload {
    text: IModalState['text'],
    iconName: IModalState['iconName']
} 

const initialState: IModalState = {
    text: '',
    iconName: 'modal/success',
    show: false,
    isHiding: false
}
let hideTimeout: number | null = null;
let removeTimeout: number | null = null;

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModal: (state, action: PayloadAction<ISetModalPayload>) => {
            if (hideTimeout) clearTimeout(hideTimeout)
            if (removeTimeout) clearTimeout(removeTimeout)
            state.text = action.payload.text
            state.iconName = action.payload.iconName
        },
        showModal: (state) => {
            state.show = true;
        },
        startHiding: (state) => {
            state.isHiding = true;
        },
        hideModal: (state) => {
            state.show = false;
            state.isHiding = false;
        },
        clearTimers: () => {
            if (hideTimeout) clearTimeout(hideTimeout)
            if (removeTimeout) clearTimeout(removeTimeout)
            hideTimeout = null;
            removeTimeout = null;
        }
    }
})

export const { setModal, showModal, startHiding, hideModal, clearTimers } = modalSlice.actions;

export const setModalWithTimers = (text: string, iconName: TModalIconName) => {
  return (dispatch: any) => {
    dispatch(clearTimers());
    
    dispatch(setModal({ text, iconName: `modal/${iconName}` }));
    
    setTimeout(() => {
      dispatch(showModal());
      
      hideTimeout = setTimeout(() => {
        dispatch(startHiding());
      }, 1200);
      
      removeTimeout = setTimeout(() => {
        dispatch(hideModal());
      }, 1800);
    }, 0);
  };
};

export default modalSlice.reducer;
