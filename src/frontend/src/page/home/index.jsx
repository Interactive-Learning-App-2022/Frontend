import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx'

const _mm = new MUtil();
const _class = new Class();


import PageTitle from 'component/page-title/index.jsx';
import './index.scss'
import PreLoader from 'component/pre-loader/index.jsx';


class Home extends React.Component {
    constructor(props) {
        super(props);
        try {
            this.state = {
                list: [],
                username: _mm.getStorage('userInfo').data.user.username,
                userID: _mm.getStorage('userInfo').data.user.id,
                api_token: _mm.getStorage('userInfo').data.token,
                role: _mm.getStorage('userInfo').data.user.groups[0],
                classrooms: _mm.getStorage('classrooms').data,
            };
        } catch (e) {
            this.state = {
                list: [],
                username: '',
                userID: '',
                api_token: '',
                role: '',
                classrooms: '',
            };
        }
    }
    componentDidMount() {
        this.checkLogin();
    }


    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }

    formatTime(startTime, endTime) {
        let start = startTime.split(':');
        let end = endTime.split(':');

        return start[0] + ':' + start[1] + ' - ' + end[0] + ':' + end[1]
    }

    render() {
        const checkRole = this.state.role;
        if (checkRole == 1) {
            return (
                <div id="page-wrapper" style={{ marginTop: "0px" }}>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Home</h1>
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    <div className="row">
                        <h5>Welcome to Interventive Learning.</h5>
                    </div>
                    <div className="row">
                        <p>View your classes in the <Link to={'/courses'}>Classes</Link> section.</p>
                    </div>
                </div>

            );
        } else {
            return (
                <div id="page-wrapper" style={{ marginTop: "0px" }}>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Home</h1>
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    <div className="row">
                        <h5>Welcome to Interventive Learning.</h5>
                    </div>
                    <div className="row">
                        <p>View your classes in the <Link to={'/courses'}>Classes</Link> section.</p>
                    </div>
                    
                </div>

            );
        }

    }
}

export default Home;