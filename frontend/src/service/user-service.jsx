import MUtil from 'util/mm.jsx'
import axios from "axios";

const _mm = new MUtil();
const headers = {
    'Content-Type': 'application/json'
}

class User {

    login(loginInfo) {
        return axios.post("http://127.0.0.1:8000/api/auth/login", loginInfo,
            { headers: headers });
    }

    register(userInfo) {
        return axios.post("http://127.0.0.1:8000/api/auth/register", userInfo,
            { headers: headers });
    }

    getUserInfo(param) {

    }

    //check if login data is valid
    checkLoginInfo(loginInfo) {
        let email = $.trim(loginInfo.username),
            password = $.trim(loginInfo.password);
        // validate username
        if (typeof email !== 'string' || email.length === 0) {
            return {
                status: false,
                msg: 'Username cannot be empty'
            }
        }
        //validate password
        if (typeof password !== 'string' || password.length === 0) {
            return {
                status: false,
                msg: 'password cannot be empty'
            }
        }
        return {
            status: true,
            msg: 'pass validation'
        }
    }
    // logout

    logout(UserToken) {
        console.log("test2");
        const auth = {
            headers: {
                'Authorization': `Token ${UserToken}`
            }
        }
        console.log(auth);
        axios.post("http://127.0.0.1:8000/api/auth/logout", null, auth)
    }

    // not used right now, no such a api exist
    getUserList(pageNum) {
        return _mm.request({
            type: 'post',
            url: '/user/list',
            data: {
                pageNum: pageNum
            }
        });
    }
}

export default User;