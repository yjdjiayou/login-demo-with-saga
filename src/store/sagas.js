import {
    call,
    all,
    put,
    take
} from 'redux-saga/effects'
import {
    LOGIN_ERROR,
    LOGOUT,
    LOGIN_REQUEST,
    SET_USERNAME
} from './action-types';
import Api from '../Api'

//首先我们创建了一个独立的 Generator login，它将执行真实的 API 调用并在成功后通知 Store。
function* login(username, password) {
    try {
        //如果 Api 调用成功了，login 将发起一个 LOGIN_SUCCESS action 然后返回获取到的 token。 如果调用导致了错误，将会发起一个 LOGIN_ERROR action。
        const token = yield call(Api.login, username, password);
        return token;
    } catch (error) {
        alert(error);
        //在 login 失败的情况下，它将返回一个 undefined 值，这将导致 loginFlow 跳过当前处理进程并等待一个新的 LOGIN_REQUEST action
        yield put({
            type: LOGIN_ERROR,
            error
        });
    }
}

function* loginFlow() {
    //一旦到达流程最后一步（LOGOUT），通过等待一个新的 LOGIN_REQUEST action 来启动一个新的迭代
    while (true) {
        //loginFlow 首先等待一个 LOGIN_REQUEST action,然后调用一个 call 到 login 任务
        //call 不仅可以用来调用返回 Promise 的函数。我们也可以用它来调用其他 Generator 函数
        //loginFlow 将等待 login 直到它终止或返回（即执行 api 调用后，发起 action 然后返回 token 至 loginFlow）
        const {
            username,
            password
        } = yield take(LOGIN_REQUEST);
        const token = yield call(login, username, password);
        //在 login 失败的情况下，它将返回一个 undefined 值，这将导致 loginFlow 跳过当前处理进程并等待一个新的 LOGIN_REQUEST action
        if (token) {
            yield put({
                type: SET_USERNAME,
                username
            });
            //如果调用 login 成功，loginFlow 将在 DOM storage 中存储返回的 token，并等待 LOGOUT action
            Api.storeItem('token', token);
            //当用户登出，我们删除存储的 token 并等待一个新的用户登录
            yield take(LOGOUT);
            Api.clearItem('token');
            yield put({
                type: SET_USERNAME,
                username: null
            });
        }
    }
}

export default function* rootSaga() {
    yield all([
        loginFlow()
    ])
}