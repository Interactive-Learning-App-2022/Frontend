import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';

import MUtil from 'util/mm.jsx'

const _mm = new MUtil();
const _class = new Class();


import PageTitle from 'component/page-title/index.jsx';
import './index.scss'


class ClassList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            userID: _mm.getStorage('userInfo').data.user.id,
            api_token: _mm.getStorage('userInfo').api_token,
            role: _mm.getStorage('userInfo').data.user.groups[0] // Student vs teacher designation in groups

        };
    }
    componentDidMount() {
        this.loadClassList();
        this.checkLogin();
    }

    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }

    loadClassList() {
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        UserInfo.userID = this.state.userID;

        _class.getClassList(UserInfo).then(res => {
            console.log(res)
            console.log(res[0])
            _mm.setStorage('classrooms', res);
            this.setState({ list: res });
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);

        });
    }

    render() {
        return (
            <div id="page-wrapper">
                <PageTitle title="Courses" />
                {
                    this.state.list.map((classrooms, index) => {
                        return (

                            <div className="col-md-4">
                                <Link to={`/classroom/${classrooms.id}`} className="color-box blue">

                                    <p className="grade">
                                        <i className="fa fa-list"></i>
                                        <span> <em>{classrooms.subject}</em> - {classrooms.grade} Grade</span>

                                    </p>
                                    <p className="desc">
                                        <i className="fa fa-building"></i>
                                        <span>{classrooms.room} - Room: {classrooms.school}</span>

                                    </p>

                                    <p className="desc">
                                        <i className="fa fa-calendar"></i>
                                        <span>{classrooms.starts_at} - {classrooms.ends_at}</span>

                                    </p>

                                </Link>
                            </div>


                        );
                    })
                }
            </div>

        );
    }
}

export default ClassList;