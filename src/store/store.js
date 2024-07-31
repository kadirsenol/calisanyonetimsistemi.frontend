import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './slices/modalSlice'
import userReducer from './slices/userSlice'
import mybackdropReducer from './slices/mybackdropSlice'
import textareaReducer from './slices/textareaSlice'
import inputfileuploadReducer from './slices/inputfileuploadSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({

    reducer: {
        modal: modalReducer,
        user : userReducer,
        mybackdrop : mybackdropReducer,
        textarea : textareaReducer,
        inputfileupload:inputfileuploadReducer,
        admin : adminReducer
    }

})