import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import Calendar from 'react-calendar';
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
            classID: this.props.match.params.classID,
            role: _mm.getStorage('userInfo').data.user.groups[0],
            taskID: 0,
            taskList: [],
            date: new Date(),
            targetName: null,
            targetDetail: null,
            counter: 0

        };
        this.handleChange = this.handleChange.bind(this);
        this.selectedStudent = [];
        this.selectedScore = [];
        this.currentTaskIndex = 0;
    }
    componentDidMount() {
        this.checkLogin();
        this.loadStudentListInTarget();
        this.refs.assignBtn.disabled = true;
    }

    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }

    handleChange(event) {
        this.setState({ taskID: event.target.value });
        console.log(this.state.taskList);
        for (var i = 0; i < this.state.taskList.length; i += 1) {
            if (this.state.taskList[i]['id'] == event.target.value) {
                this.currentTaskIndex = i;
            }
        }

        if (event.target.value > 0 && this.selectedStudent.length > 0) {
            this.refs.assignBtn.disabled = false;
        } else {
            this.refs.assignBtn.disabled = true;
        }

    }

    loadTaskList() {
        let Info = {};
        Info.api_token = this.state.api_token;
        Info.profID = this.state.targetID;
        _class.getTaskList(Info).then(res => {
            console.log("DATA")
            console.log(res.data);
            this.setState({
                taskList: res.data
            });
        }, errMsg => {
            _mm.errorTips(errMsg);
        });
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

    onInputChange(e) {
        let inputScore = e.target.value,
            inputStudent = e.target.title,
            inputName = e.target.name;
        console.log(inputScore);
        console.log(inputStudent);
        console.log(inputName);
        if (inputName == "selected") {
            if (this.selectedStudent.indexOf(inputStudent) > -1) {
                let index = this.selectedStudent.indexOf(inputStudent);
                let index2 = this.selectedScore.indexOf(inputScore);
                this.selectedStudent.splice(index, 1);
                this.selectedScore.splice(index2, 1)
                if (this.selectedStudent.length == 0) {
                    this.refs.assignBtn.disabled = true;
                }
            } else {
                this.selectedStudent = this.selectedStudent.concat(inputStudent);
                this.selectedScore = this.selectedScore.concat(inputScore);
                if (this.state.taskID > 0) {
                    this.refs.assignBtn.disabled = false;
                }
            }

        }
        console.log(this.selectedStudent);
        console.log(this.selectedScore);
    }

    onInputKeyUp(e) {
        if (e.keyCode === 13) {
            this.onSubmit(e);
        }
    }

    onSubmit(e) {
        e.preventDefault();
        let loginInfo = {
            api_token: this.state.api_token,
            userID: this.state.userID,
            taskID: this.state.taskID
        };
        console.log('task: ' + this.state.taskID + ' student: ' + this.selectedStudent);

        // set due date
        let dueDate = new Date(this.state.date);
        dueDate = dueDate.getFullYear() + '-' + (dueDate.getMonth() + 1) + '-' + dueDate.getDate()

        let data = {
            "class_id": Number(this.state.classID),
            "assigned_student": Number(this.selectedStudent),
            "task_id": Number(this.state.taskID),
            "status": "0",
            "scores_id": Number(this.selectedScore),
            "due_date": dueDate
        }
        console.log("This is taskID", data);
        console.log("STRINGIFY");
        console.log(JSON.stringify(data));

        _class.assignTask(loginInfo, JSON.stringify(data)).then((res) => {
            _mm.successTips(res.message);

            // reset back
            for (let i = 0; i < this.selectedStudent.length; i++) {
                this.refs['student' + this.selectedStudent[i]].checked = false;
            }
            this.selectedStudent = [];
            this.setState({
                taskID: 0
            });
            this.refs.assignBtn.disabled = true;
            $('#calendarModal').modal('hide');
            $("[data-dismiss=modal]").trigger({ type: "click" })
        }, (errMsg) => {
            console.log("There has been an error.");
            console.log(errMsg);
            _mm.errorTips(errMsg);

            // reset back
            for (let i = 0; i < this.selectedStudent.length; i++) {
                this.refs['student' + this.selectedStudent[i]].checked = false;
            }
            this.selectedStudent = [];
            this.setState({
                taskID: 0
            });
            this.refs.assignBtn.disabled = true;
            $('#calendarModal').modal('hide');
            $("[data-dismiss=modal]").trigger({ type: "click" })
        });

    }

    dateChange(currentDate) {
        this.setState({ date: currentDate });
    }

    loadStudentListInTarget() {
        this.refs.loader.black();
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        UserInfo.userID = this.state.userID;
        UserInfo.classID = this.state.classID;
        UserInfo.pLevel = this.state.pLevel;
        UserInfo.profID = this.state.targetID;

        _class.getPList(UserInfo).then(res => {
            console.log("PLIST");
            console.log(res.data);
            this.loadTaskList();
            this.setState({ list: res.data });
            this.refs.loader.hide();
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);

        });
    }

    render() {
        const tasklist = this.state.taskList.map((task, index) => {

            return (
                <option key={index} name="taskID" value={task.id}>{task.name}</option>
            )
        });

        return (
            <div id="page-wrapper" style={{ marginTop: "0px" }}>
                <div style={{ float: "right", marginTop: "70px" }}>
                    <p>
                        <div className="dot-green" title="Done" style={{ borderRadius: "100%", border: "none" }}></div>
                        <span className="text-bold">{'Proficient'}</span>
                    </p>
                    <p>
                        <div className="dot-yellow" title="In progress" style={{ borderRadius: "100%", border: "none" }}></div>
                        <span className="text-bold">{'Almost Proficient'}</span>
                    </p>
                    <p>
                        <div className="dot-red" title="Have not started" style={{ borderRadius: "100%", border: "none" }}></div>
                        <span className="text-bold">{'Non-Proficient'}</span>
                    </p>
                </div>
                <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "20px", marginTop: "70px" }}>Target {this.state.targetName}</h1>
                <h1 className="display-5" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px" }}>{this.state.targetDetail}</h1>

                <select value={this.state.taskID} onChange={this.handleChange}><option>Select Module Here</option>
                    {
                        tasklist
                    }
                </select>
                <button className="btn btn-primary" style={{ marginLeft: "20px", padding: "0px", paddingLeft: "35px", paddingRight: "35px" }} ref="assignBtn" data-toggle="modal" data-target="#calendarModal">Assign Module</button>

                <div ref="calendarModal" className="modal fade" id="calendarModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalLabel">Select Due Date</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>

                            </div>
                            <div className="modal-body">
                                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                                    <Calendar
                                        onChange={e => this.dateChange(e)}
                                        value={this.state.date}
                                        minDate={new Date()}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" class="btn btn-primary" onClick={e => this.onSubmit(e)}>Assign Modules</button>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="row">
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    {
                        this.state.list.map((student, index) => {
                            return (
                                <div className="card col-md-3" key={index} style={{ padding: "0px", marginLeft: "10px", marginBottom: "10px" }}>
                                    <div className="card-header" style={{ backgroundColor: "#019DF4" }}>
                                        <span className="text-white" style={{ fontWeight: "bold", fontSize: "30px" }}>
                                            {student.student_id.first_name + " " + student.student_id.last_name}
                                            <input type="checkbox"
                                                name="selected"
                                                className="big-checkBox"
                                                title={student.student_id.id}
                                                value={student.scores_id.id}
                                                placeholder="checkbox"
                                                ref={'student' + student.student_id.id}
                                                onKeyUp={e => this.onInputKeyUp(e)}
                                                onChange={e => this.onInputChange(e)}
                                                style={{ border: "none", color: "black", float: "right" }} />
                                        </span>
                                    </div>
                                    <div className="card-body" style={{ backgroundColor: "#02D0FF", padding: "0" }}>
                                        <div className="content-left col-md-6 display-inline" style={student.scores_id.orginal_proficient ? (student.scores_id.orginal_proficient == "0" ? { backgroundColor: "#02B385" } : { backgroundColor: "#BC0000" }) : {}} >
                                            <p className="text-center text-white text-25" >{student.scores_id.orginal_proficient ? (student.scores_id.orginal_proficient == "0" ? 'P' : 'NP') : {}}</p>
                                            <p className="text-white" style={{ fontSize: "15px", marginLeft: "15px" }}>Original Score</p>
                                        </div>
                                        <div className="col-md-6 display-inline" style={student.scores_id.currentscore ? (student.scores_id.currentscore > 75 ? { backgroundColor: "#02B385" } : (student.scores_id.currentscore > 40 ? { backgroundColor: "#FFD800" } : { backgroundColor: "#BC0000" })) : {}}>
                                            <p className="text-center text-white text-25" >{student.scores_id.currentscore == 0 ? '-' : student.scores_id.currentscore}</p>
                                            <p className="text-white" style={{ fontSize: "15px", marginLeft: "15px" }}>Current Score</p>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    }
                </div>
                <button type="button" className="btn btn-primary btn-lg" style={{ marginTop: "0px", backgroundColor: "#02D0FF" }}>
                    <span onClick={() => this.props.history.goBack()}>Back</span>
                </button>
            </div>

        );
    }
}

export default TargetDetail;
