export default {
    login(username, password){
        return new Promise(function(resolve,reject){
            setTimeout(()=>{
                if(Math.random()>.5){
                    resolve(username+'-'+password);
                }else{
                    reject('登录失败');
                }
            },1000);
        });
    },
    storeItem(key,value){
        localStorage.setItem(key,value);
    },
    clearItem(){
        localStorage.removeItem('token');
    }
}