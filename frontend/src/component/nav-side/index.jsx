import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx';

const _mm = new MUtil();
const _class = new Class();

class NavSide extends React.Component {
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
        this.loadClassList(this.state);
    }

    loadClassList() {
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
            _mm.setStorage('classrooms', res);
            this.setState({ list: JSON.parse(window.localStorage.getItem('classrooms')) });
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);
        });
    }

    render() {
        var taskRender;
        const checkRole = this.state.role;
        if (checkRole == 1) {
            //  taskRender = (
            //     <NavLink to={`/tasks`} activeClassName="active-menu" >
            //        <li className="list-group-item list-group-item-action" style={{ backgroundColor: "#14497F" }}>
            //            <span style={{ color: "white", fontWeight: "600" }}>Math - A302</span>
            //        </li>
            //    </NavLink>
            //);
        }
        else {
            taskRender = (
                <NavLink to={`/tasks/${this.state.userID}`} activeClassName="active-menu" >
                    <li className="list-group-item list-group-item-action" style={{ backgroundColor: "#14497F" }}>
                        <span style={{ color: "white", fontWeight: "600" }}>Assignments</span>
                    </li>
                </NavLink>
            );
        }



        return (
            <div className="navbar-default navbar-side" style={{ backgroundColor: "#043874" }}>
                <div className="sidebar-collapse">
                    <ul className="nav list-group list-group-flush">
                        <li className="list-group-item list-group-item-action" style={{ backgroundColor: "#043874" }}>
                            <NavLink exact to="/">
                                <i style={{ color: "white", fontWeight: "600" }} className="fa fa-home"></i>
                                <span style={{ color: "white", fontWeight: "600" }}>Home</span>
                            </NavLink>
                        </li>
                        <li className="list-group-item list-group-item-action" style={{ backgroundColor: "#043874" }}>
                            <Link to="/courses">
                                <i style={{ color: "white", fontWeight: "600" }} className="fa fa-bell"></i>
                                <span style={{ color: "white", fontWeight: "600" }}>Classes</span>

                            </Link>
                            <ul className="nav list-group list-group-flush" style={{ marginTop: "15px" }}>
                                {
                                    this.state.list.map((classrooms, index) => {

                                        return (
                                            <a href={`/classroom/${classrooms.id}`} key={index}>
                                                <li className="list-group-item list-group-item-action" key={index} style={{ backgroundColor: "#14497F" }}>
                                                    <span style={{ color: "white", fontWeight: "600" }}>{classrooms.subject.subject + ' - ' + classrooms.room}</span>
                                                </li>
                                            </a>

                                        );
                                    })
                                }
                            </ul>
                        </li>

                        <li className="list-group-item list-group-item-action" style={{ backgroundColor: "#043874" }}>
                            <Link to={this.state.role == 1 ? "/tasks" : `/tasks/${this.state.userID}`}>
                                <i style={{ color: "white", fontWeight: "600" }} className="fa fa-check-square-o"></i>
                                <span style={{ color: "white", fontWeight: "600" }}>Tasks</span>

                            </Link>
                            <ul className="nav list-group list-group-flush" style={{ marginTop: "15px" }}>
                                {
                                    taskRender
                                }
                            </ul>
                        </li>



                    </ul>

                </div>

            </div>
        );
    }
}

export default NavSide;