import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import modalReducer from './slices/modalSlice'
import userReducer from './slices/userSlice'
import mybackdropReducer from './slices/mybackdropSlice'
import solutionsReducer from './slices/solutionsSlice'
import textareaReducer from './slices/textareaSlice'
import inputfileuploadReducer from './slices/inputfileuploadSlice'
import solutionDetailReducer from './slices/solutionDetailSlice'
import controlUIReducer from './slices/controlUISlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({

    reducer: {
        cart : cartReducer,
        modal: modalReducer,
        user : userReducer,
        mybackdrop : mybackdropReducer,
        solutions : solutionsReducer,
        textarea : textareaReducer,
        inputfileupload:inputfileuploadReducer,
        solutiondetail : solutionDetailReducer,
        controlUI : controlUIReducer,
        admin : adminReducer
    }

})