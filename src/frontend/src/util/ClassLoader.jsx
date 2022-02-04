import MUtil from 'util/mm.jsx'
import Class from 'service/class-service.jsx';
const _mm = new MUtil();
const _class = new Class();

class ClassLoader {
    constructor(props) {
        super(props);
        try {
            this.state = {
                list: [],
                userID: _mm.getStorage('userInfo').data.user.id,
                api_token: _mm.getStorage('userInfo').data.token,
                role: _mm.getStorage('userInfo').data.user.groups[0],
                classrooms: _mm.getStorage('classrooms').data,
            };
        } catch (e) {
            this.state = {
                list: [],
                userID: '',
                api_token: '',
                role: '',
                classrooms: '',
            };
        }
    }

    loadClassList(state) {
        let UserInfo = {};
        UserInfo.api_token = state.api_token;
        UserInfo.userID = state.userID;

        // if classrooms exist, do not call ajax again
        if (window.localStorage.getItem('classrooms')) {
            _mm.removeStorage('classrooms');
        }

        _class.getClassList(UserInfo).then(res => {
            _mm.setStorage('classrooms', res);
            this.setState({ list: JSON.parse(window.localStorage.getItem('classrooms')) });

        }, errMsg => {
            _mm.errorTips(errMsg);
            this.setState({
                list: []
            })

        });

        return this.state;
    }
}

export default ClassLoader;