import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducer/authReducer';
import postReducer from './reducer/postReducer';
/**
 * stepfor state mangement
 * submit action //ye redux me thnk me like rounter
 * handle action// ye reducer me slice me add case 
 * register ->reducer //stor 
 * final apply to page dispatch using
 */
export const store=configureStore({
    reducer:{
        auth:authReducer,
        post: postReducer,
    }
})