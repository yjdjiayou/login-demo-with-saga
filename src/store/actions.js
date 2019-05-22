import * as types from './action-types';
export default {
    incrementAsync() {
        return {type:types.INCREMENT_ASYNC}
    },
    login(username,password){
        return {type:types.LOGIN_REQUEST,username,password}
    },
    logout(){
        return {type:types.LOGOUT}
    }
}