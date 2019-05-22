import * as types from './action-types';
export default function (state={number:0,username:null},action) {
    switch(action.type){
        case types.INCREMENT:
            return {number: state.number+1};
        case types.LOGIN_ERROR:
            return {error: action.error};
        case types.SET_USERNAME:
            return {username: action.username};
        default:
            return state;
    }
}