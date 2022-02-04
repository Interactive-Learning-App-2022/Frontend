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
            userID: this.props.match.params.userID,
            api_token: _mm.getStorage('userInfo').data.token,
            targetID: this.props.match.params.targetID,
            pLevel: this.props.match.params.pLevel,
            classID: this.props.match.params.classID,
            role: _mm.getStorage('userInfo').data.user.groups[0],
            selected: [],
            taskID: 0,
            taskList: [],
            studentInfo: ''
        };
        this.today = new Date();
        this.currentTime = this.today.getHours() + ":" + this.today.getMinutes() + ":" + this.today.getSeconds();
        this.mapping = new Map();
    }
    componentDidMount() {
        this.refs.loader.black();
        this.loadStudentListInTarget();
        this.checkLogin();
    }

    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }

    toModule(e, link) {
        e.preventDefault();
        window.location.href = link;
    }

    toRecord(e, link) {
        e.preventDefault();
        window.location.href = '/records/' + link
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

    openModal(e) {
        e.preventDefault();
        _mm.errorTips("Student have not done module yet, check back later!");
    }

    checkDue(dueDate, target) {
        // check due date
        if (Date.parse(dueDate) < Date.parse(this.today)) {
            if (target != null) {
                target.className = 'card col-md-3 task-due';
            }
        }
    }

    checkDueDate(dueDate) {
        if (Date.parse(dueDate) < Date.parse(this.today)) {
            return true
        } else {
            return false
        }
    }

    parseTime(due_date) {
        let splitDateTime = due_date.split(' ');
        let date = splitDateTime[0].split('-');
        let currentDate = new Date(date[0], date[1] - 1, date[2]);

        return (currentDate.getMonth() + 1) + ' / ' + currentDate.getDate() + ' / ' + currentDate.getFullYear()
    }

    getTaskTitle(studentName) {
        if (studentName != null && studentName != '') {
            let splitName = studentName.split(' ');

            return splitName[0] + '\'s Tasks'
        }

    }

    loadStudentListInTarget() {
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        UserInfo.userID = this.state.userID;
        UserInfo.classID = this.state.classID;

        _class.getStudentAssignedAssessments(UserInfo, 0).then(res => {
            console.log("Assessment-DETAIL");
            console.log(res.data);
            this.setState({ list: res.data });
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);

        });
    }

    render() {
        let renderer;
        //if student 

            renderer =
                <div>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "15px", marginTop: "70px" }}>Assessments Assigned</h1>

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
                            this.state.list.map((assessments, index) => {
                                {console.log("assessments list", assessments)}
                                {console.log(index)}
                                return (

                                    <div className="card col-md-3" style={{ padding: "0px", marginLeft: "20px" }}>
                                        <div className="card-header" style={{ backgroundColor: "#C8C8C8" }}>
                                            <Link to={`/assessment/${assessments.class_id.id}/${assessments.assigned_student.id}/${assessments.id}/${assessments.assessment_id.name}`} className="text-muted" style={{ textDecoration: "none" }}>
                                                <p className="text-black" style={{ marginBottom: "0px", fontWeight: "bold", fontSize: "30px" }}>{assessments.assessment_id.name}</p>
                                                <i class="fa fa-circle fa-stack-2x" style={assessments.status == 2 ? { left: "100px", color: "#02B385" } : (assessments.status == 1 ? { left: "100px", color: "#EF9B0F" } : { left: "100px", color: "#BC0000" })}></i>
                                                <span><br/></span>
                                            </Link>
                                        </div>
                                        <div className="card-body" style={{ backgroundColor: "#02D0FF", padding: "0" }}>
                                            <Link to={`/assessment/${assessments.class_id.id}/${assessments.assigned_student.id}/${assessments.id}/${assessments.assessment_id.name}`} className="text-muted" style={{ textDecoration: "none" }}>
                                                <div className="content-left col-md-12 display-inline" style={/*might need to change this line*/ assessments.proficient ? (assessments.proficient == "2" ? { backgroundColor: "#02B385" } : { backgroundColor: "#BC0000" }) : {}} >
                                                    <p className="text-center text-white text-25" >{assessments.proficient ? (assessments.proficient == "2" ? 'P' : 'NP') : {}}</p>
                                                    <p className="text-white" style={{ fontSize: "15px", marginLeft: "15px" }}>Final Score</p>
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
        


        return (
            <div id="page-wrapper" style={{ marginTop: "0px" }}>
                {renderer}
            </div>

        );
    }

}

export default TargetDetail;
