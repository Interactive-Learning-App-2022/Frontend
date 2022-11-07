import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx'

const _mm = new MUtil();
const _class = new Class();


import PageTitle from 'component/page-title/index.jsx';
import './index.scss'
import PreLoader from 'component/pre-loader/index.jsx';


class Courses extends React.Component {
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
        this.loadClassList(this.state);
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

    loadClassList() {
        this.refs.loader.black();
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        UserInfo.userID = this.state.userID;
        UserInfo.role = this.state.role;
        UserInfo.username = this.state.username;

        // if classrooms exist, do not call ajax again
        if (window.localStorage.getItem('classrooms')) {
            _mm.removeStorage('classrooms');
        }

        _class.getClassList(UserInfo).then(res => {
            console.log(res);
            this.refs.loader.hide();
            _mm.setStorage('classrooms', res);
            this.setState({ list: JSON.parse(window.localStorage.getItem('classrooms')) });

        }, errMsg => {
            _mm.errorTips(errMsg);
            this.setState({
                list: []
            })

        });
    }

    render() {
        const checkRole = this.state.role;
        if (checkRole == 1) {
            return (
                <div id="page-wrapper" style={{ marginTop: "0px" }}>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "gray", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Your Classes</h1>
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    <div className="row">
                        {
                            this.state.list.map((classrooms, index) => {
                                return (
                                    <div className="card col-md-3" key={index} style={{ padding: "0px", marginLeft: "20px" }}>
                                        <div className="card-header" style={{ backgroundColor: "#019DF4" }}>
                                            <p className="text-white" style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "9px" }}>{classrooms.subject.subject + ' - ' + classrooms.grade.gradenumber + ' Grade'}</p>
                                            <span class="badge badge-dark" style={{ marginLeft: "0px", padding: "5px" }} >{classrooms.room}</span>
                                            <span class="badge badge-dark" style={{ marginLeft: "6px", padding: "5px" }}>{this.formatTime(classrooms.starts_at, classrooms.ends_at)}</span>
                                        </div>

                                        

                                        <Link to={`/classroom/${classrooms.id}`} className="text-muted" style={{ textDecoration: "none" }}>
                                            <div className="card-body" style={{ backgroundColor: "#02D0FF" }}>
                                                <p className="display-1 text-white" style={{ marginBottom: "0px", fontWeight: "bold" }}>{classrooms.users_count}</p>
                                                <p className="text-white" style={{ fontSize: "25px" }}>Students</p>
                                                <a href={`/classroom/${classrooms.id}`} className="btn btn-primary" style={{ backgroundColor: "#019DF4", border: "none", borderRadius: "25px" }}>More Details</a>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

            );
        } else {
            return (
                <div id="page-wrapper" style={{ marginTop: "0px" }}>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Your Classes</h1>
                    <PreLoader display="block" ref="loader" size=""></PreLoader>
                    <div className="row">

                        {
                            this.state.list.map((classrooms, index) => {
                                return (
                                    <div className="card col-md-3" key={index} style={{ padding: "0px", marginLeft: "20px" }}>
                                        <div className="card-header" style={{ backgroundColor: "#019DF4" }}>
                                            <span className="text-white" style={{ fontWeight: "bold", fontSize: "30px" }}>{classrooms.subject + ' - ' + classrooms.grade.gradenumber}</span>
                                        </div>
                                        <Link to={`/classroom/${classrooms.id}`} className="text-muted" style={{ textDecoration: "none" }}>
                                            <div class="card-body" style={{ backgroundColor: "#02D0FF" }}>
                                                <p className="display-2 text-white" style={{ marginBottom: "0px", fontWeight: "bold" }}>{classrooms.room}</p>
                                                <p className="text-white"><i className="fa fa-clock-o" style={{ marginRight: "5px" }}></i>{this.formatTime(classrooms.starts_at, classrooms.ends_at)}</p>
                                                <a href={`/classroom/${classrooms.id}`} className="btn btn-primary" style={{ backgroundColor: "#019DF4", border: "none", borderRadius: "25px" }}>More Details</a>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>


                </div>

            );
        }

    }
}

export default Courses;
