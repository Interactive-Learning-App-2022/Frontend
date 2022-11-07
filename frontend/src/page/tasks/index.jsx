import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';

import MUtil from 'util/mm.jsx'

const _mm = new MUtil();
const _class = new Class();


import PageTitle from 'component/page-title/index.jsx';
import './index.scss';
import PreLoader from 'component/pre-loader/index.jsx';


class TargetDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            userID: _mm.getStorage('userInfo').data.user.id,
            api_token: _mm.getStorage('userInfo').data.token,
            targetID: this.props.match.params.targetID,
            pLevel: this.props.match.params.pLevel,
            classID: parseInt(this.props.match.params.classID),
            role: _mm.getStorage('userInfo').data.user.groups[0],
            students: [],
            selected: [],
            taskID: 0,
            taskList: []

        };
    }
    componentDidMount() {
        this.checkLogin();
        if (this.state.role == '1') {
            this.loadTasks();
            this.loadStudents();
        } else {
            this.loadStudentTasks();
        }

    }

    parseTime(due_date) {
        let splitDateTime = due_date.split(' ');
        let date = splitDateTime[0].split('-');
        let currentDate = new Date(date[0], date[1] - 1, date[2]);

        return (currentDate.getMonth() + 1) + ' / ' + currentDate.getDate() + ' / ' + currentDate.getFullYear()
    }

    checkDueDate(dueDate) {
        if (Date.parse(dueDate) < Date.parse(this.today)) {
            return true
        } else {
            return false
        }
    }

    checkDue(dueDate, target) {
        // check due date
        if (Date.parse(dueDate) < Date.parse(this.today)) {
            if (target != null) {
                target.className = 'card col-md-3 task-due';
            }
        }
    }

    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }


    getTitle() {
        if (this.state.pLevel = 'p') {
            this.state.title = 'Proficient';
        }
        if (this.state.pLevel = 'ap') {
            this.state.title = 'Almost Proficient';
        }
        if (this.state.pLevel = 'np') {
            this.state.title = 'Not Proficient';
        }
    }


    loadTasks() {
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        UserInfo.classID = this.state.classID;

        _class.getStudentsInTaskPage(UserInfo).then(res => {
            this.setState({ list: res.data })
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);

        });
    }

    loadStudentTasks() {
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        //Class ID is User ID in this case
        UserInfo.userID = this.state.classID;

        _class.getStudentTasks(UserInfo).then(res => {
            console.log("TASKS-PAGE");
            console.log(res.data);
            this.setState({ list: res.data })
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);

        });
    }

    loadStudents() {
        let UserInfo = {};
        UserInfo.classID = this.state.classID;

        _class.getStudentList(UserInfo).then(res => {
            this.setState({ students: res.data })
        }, errMsg => {
            console.log("ERRROR")
            this.setState({
                students: []
            })
            _mm.errorTips(errMsg);

        });
    }

    render() {
        var renderer;

        if (this.state.role == '1') {
            renderer =
                <div id="page-wrapper" style={{ marginTop: "0px" }}>

                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Assigned Tasks</h1>
                    <PreLoader display="none" ref="loader" size="" ></PreLoader>

                    <div className="row">
                        {
                            this.state.students.map((student, index) => {
                                var studenttasks = this.state.list.filter(student_id => student_id.assigned_student.id === student.student_id.id);
                                var notcompletedtasks = studenttasks.filter(completed => completed.status === "0");
                                var inprogresstasks = studenttasks.filter(completed => completed.status === "1");
                                var completedtasks = studenttasks.filter(completed => completed.status === "2");
                                return (
                                    <div className="pull-left card col-md-3" key={index} style={{ padding: "0px", marginLeft: "20px", marginBottom: "20px" }}>
                                        <Link to={`/tasks/${this.state.classID}/${student.student_id.id}`} className="text-muted" style={{ textDecoration: "none" }}>
                                            <div className="card-header" style={{ backgroundColor: "#019DF4" }}>
                                                <p className="text-white" style={{ marginBottom: "0px", fontWeight: "bold", fontSize: "30px" }}>{student.student_id.first_name + " " + student.student_id.last_name}</p>
                                            </div>
                                            {<div className="card-body" style={{ backgroundColor: "#E6E7E9" }}>
                                                <p>
                                                    <div className="dot-green" title="Done" style={{ borderRadius: "100%", border: "none" }}></div>
                                                    <span className="text-bold">{completedtasks.length + ' Completed'}</span>
                                                </p>
                                                <p>
                                                    <div className="dot-yellow" title="In progress" style={{ borderRadius: "100%", border: "none" }}></div>
                                                    <span className="text-bold">{inprogresstasks.length + ' In progress'}</span>
                                                </p>
                                                <p>
                                                    <div className="dot-red" title="Have not started" style={{ borderRadius: "100%", border: "none" }}></div>
                                                    <span className="text-bold">{notcompletedtasks.length + ' Not Started'}</span>
                                                </p>
                                            </div>}
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <button type="button" class="btn btn-primary btn-lg" style={{ marginTop: "20px", backgroundColor: "#02D0FF" }}>
                        <span onClick={() => this.props.history.goBack()}>Back</span>
                    </button>
                </div>;

        } else {
            renderer =
                <div>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "15px", marginTop: "70px" }}>Tasks Assigned</h1>

                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    <div style={{ float: "left" }}>
                        <p>
                            <div className="dot-green" title="Done" style={{ borderRadius: "70%", border: "none" }}></div>
                            <span className="text-bold">{'Completed '}</span>
                        </p>
                        <p>
                            <div className="dot-yellow" title="In progress" style={{ borderRadius: "100%", border: "none" }}></div>
                            <span className="text-bold">{'In Progress '}</span>
                        </p>
                        <p>
                            <div className="dot-red" title="Have not started" style={{ borderRadius: "100%", border: "none" }}></div>
                            <span className="text-bold">{'Not Started '}</span>
                        </p>



                    </div>

                    <div style={{ marginLeft: "150px" }}>
                        <p>
                            <div className="dot-green" title="Done" ></div>
                            <span className="text-bold">{'Proficient'}</span>
                        </p>

                        <p>
                            <div className="dot-yellow" title="Done" ></div>
                            <span className="text-bold">{'Almost Proficient'}</span>
                        </p>
                        <p>
                            <div className="dot-red" title="Done"></div>
                            <span className="text-bold">{'Not Proficient'}</span>
                        </p>
                    </div>

                    <div className="row">

                        {
                            this.state.list.sort((a, b) => Date.parse(a.due_date) - Date.parse(b.due_date)).map((modules, index) => {
                                return (

                                    <div className="card col-md-3" key={index} ref={c => this.checkDue(modules.due_date, c)} style={{ padding: "0px", marginLeft: "20px" }}>
                                        <div className="card-header" style={{ backgroundColor: "#C8C8C8" }}>
                                            <Link to={`/game/${modules.id}`} className="text-muted" style={{ textDecoration: "none" }}>
                                                <p className="text-black" style={{ marginBottom: "0px", fontWeight: "bold", fontSize: "30px" }}>{modules.task_id.name}</p>
                                                <i class="fa fa-circle fa-stack-2x" style={modules.status == 2 ? { left: "100px", color: "#02B385" } : (modules.status == 1 ? { left: "100px", color: "#EF9B0F" } : { left: "100px", color: "#BC0000" })}></i>
                                                <span class="badge badge-dark"> {'Due Date: ' + this.parseTime(modules.due_date)}</span>
                                            </Link>
                                        </div>
                                        <div className="card-body" style={{ backgroundColor: "#02D0FF", padding: "0" }}>
                                            <Link to={`/game/${modules.id}`} className="text-muted" style={{ textDecoration: "none" }}>
                                                <div className="content-left col-md-6 display-inline" style={modules.orginalscore ? (modules.orginalscore > 75 ? { backgroundColor: "#01CF85" } : (modules.orginalscore > 40 ? { backgroundColor: "#FFD800" } : { backgroundColor: "#FE4C4C" })) : {}} >
                                                    <p className="text-center text-white text-25" >{modules.orginalscore ? modules.orginalscore : '-'}</p>
                                                    <p className="text-white" style={{ fontSize: "15px", marginLeft: "15px" }}>Original Score</p>
                                                </div>
                                                <div className="col-md-6 display-inline" style={modules.highestscore ? (modules.highestscore > 75 ? { backgroundColor: "#01CF85" } : (modules.highestscore > 40 ? { backgroundColor: "#FFD800" } : { backgroundColor: "#FE4C4C" })) : {}}>
                                                    <p className="text-center text-white text-25" >{modules.highestscore == 0 ? '-' : modules.highestscore}</p>
                                                    <p className="text-white" style={{ fontSize: "15px", marginLeft: "15px" }}>Best Score</p>
                                                </div>
                                            </Link>
                                        </div>

                                    </div>

                                );
                            })

                        }


                    </div>
                    <button type="button" class="btn btn-primary btn-lg" style={{ marginTop: "100px", backgroundColor: "#02D0FF" }}>
                        <span onClick={() => this.props.history.goBack()}>Back</span>
                    </button>
                </div>;
        }
        return (
            <div id="page-wrapper" style={{ marginTop: "0px" }}>
                {renderer}
            </div>

        );
    }
}

export default TargetDetail;
