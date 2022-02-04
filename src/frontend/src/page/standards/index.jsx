import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import Calendar from 'react-calendar';

import MUtil from 'util/mm.jsx'

const _mm = new MUtil();
const _class = new Class();


import PageTitle from 'component/page-title/index.jsx';
import './index.scss';
import './standards.js';
import PreLoader from 'component/pre-loader/index.jsx';


class StandardDetail extends React.Component {
    constructor(props) {
        super(props);

        // onClick methods
        this.AssignAssessment = (param) => {

            _class.getAssessment_id(param.proficiency_id.id, param).then((res) => {
                _mm.successTips(res.message);
            }, (errMsg) => {
                console.log("Error. There has been an error.")
                console.log(errMsg)
                _mm.errorTips(errMsg)
            });
            console.log("param", param)
            console.log("Assessment Assigned!")
        }

        this.subject = null;

        this.state = {
            list: [],
            userID: _mm.getStorage('userInfo').data.user.id,
            api_token: _mm.getStorage('userInfo').data.token,
            classID: parseInt(this.props.match.params.classID),
            subjectID: parseInt(this.props.match.params.subjectID),
            role: _mm.getStorage('userInfo').data.user.groups[0],
            students: [],
            selected: [],
            standards: [],
        };
    }
    componentDidMount() {
        this.checkLogin();
        if (this.state.role == '1') {

            this.loadStandards();
            this.loadStudents();

            const script = document.createElement("script");
            //script.src = "./standards.js";
            script.src = "/src/page/standards/standards.js";
            script.async = true;
            document.body.appendChild(script);
        } else {

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

    // loads all subject standards
    loadStandards() {
        let UserInfo = {}
        UserInfo.classID = this.state.classID
        UserInfo.subjectID = this.state.subjectID

        _class.getStudentStandards(UserInfo).then(res => {
            this.setState({ standards: res.data })
        }, errMsg => {
            console.log("Error")
            this.setState({
                standards: []
            })
            _mm.errorTips(errMsg);
        });
        console.log("End of loadStandards")
    }

    render() {
        var renderer;
        var grade = 0;

        if (this.state.role == '1') {
            renderer =
                <div style={{ marginTop: "0px" }}>

                    <div style={{ float: "right" }}>
                        <p>
                            <div className="dot-green" title="Done" style={{ borderRadius: "70%", border: "none" }}></div>
                            <span className="text-bold">{'Proficient '}</span>
                        </p>
                        <p>
                            <div className="dot-yellow" title="In progress" style={{ borderRadius: "100%", border: "none" }}></div>
                            <span className="text-bold">{'Almost Proficient '}</span>
                        </p>
                        <p>
                            <div className="dot-red" title="Have not started" style={{ borderRadius: "100%", border: "none" }}></div>
                            <span className="text-bold">{'Not Proficient '}</span>
                        </p>

                    </div>

                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Standards List</h1>
                    <PreLoader display="none" ref="loader" size="" ></PreLoader>

                    <div className="searchBar">
                        <input type="text" id="myInput" ref="searching" placeholder="Search for names.." title="Type in a name" />
                        <ul id="searchUL">
                            {
                                this.state.students.map((student) => {
                                    return (
                                        <li key={student.student_id.first_name + " " + student.student_id.last_name}><a href={"#" + student.student_id.first_name + " " + student.student_id.last_name}>{student.student_id.first_name + " " + student.student_id.last_name}</a></li>
                                    );
                                })
                            }
                        </ul>
                    </div>

                    <div className="databases">

                        {
                            this.state.students.map((student) => {
                                return (

                                    <div id={student.student_id.first_name + " " + student.student_id.last_name} style={{ height: "100vh", textAlign: "justify" }}>
                                        <div>
                                            <br /><br />

                                            <div style={{ marginTop: 50 }}>
                                                {student.student_id.first_name + " " + student.student_id.last_name}
                                            </div>
                                        </div>

                                        {
                                            this.state.standards.map((standard) => {
                                                { console.log("Standard", standard) }
                                                {
                                                    if (student.student_id.id == standard.student_id.id) {


                                                        if (grade != standard.proficiency_id.grade.gradenumber) {
                                                            grade = standard.proficiency_id.grade.gradenumber;

                                                            return <div>
                                                                <div>{grade} Grade</div>

                                                                <div class="grid-container">

                                                                    <div class="grid-item">

                                                                        {(() => {
                                                                            console.log("if statement")
                                                                            if ((standard.proficient) == '0') {
                                                                                return <div className="dot-red" style={{ borderRadius: "100%", border: "none" }}></div>
                                                                            }
                                                                            else if ((standard.proficient == '1')) {
                                                                                return <div className="dot-yellow" style={{ borderRadius: "100%", border: "none" }}></div>
                                                                            }
                                                                            else if ((standard.proficient == '2')) {
                                                                                return <div className="dot-green" style={{ borderRadius: "100%", border: "none" }}></div>
                                                                            }
                                                                        })()}

                                                                        {standard.proficiency_id.name}</div>

                                                                    <div class="grid-item">
                                                                        <button type="button" style={{ borderRadius: "25px", fontSize: "20px", margin: "0px", paddingTop: "1px", paddingBottom: "1px" }} data-toggle="modal" data-target={'#moreDetailsModalDes' + standard.id}>
                                                                            {standard.proficiency_id.standard_info.standard_name}
                                                                        </button>
                                                                        <div class="modal fade" id={'moreDetailsModalDes' + standard.id} tabindex="1" role="dialog" data-id={'span'} aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
                                                                            <div class="modal-dialog" role="document">
                                                                                <div class="modal-content">
                                                                                    <div class="modal-header">
                                                                                        <h5 class="modal-title" id="moreDetailsModalLabel">{'Description'}</h5>
                                                                                    </div>
                                                                                    <div class="modal-body">
                                                                                        <p>{standard.proficiency_id.description}</p>
                                                                                        <p>{standard.scores_id.currentscore}</p>
                                                                                        <button type="button" style={{ marginLeft: "50px" }} data-dismiss="modal">Go back</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="grid-item">

                                                                        <button type="button" style={{ borderRadius: "25px", fontSize: "20px", margin: "0px", paddingTop: "1px", paddingBottom: "1px" }} data-toggle="modal" data-target={'#moreDetailsModal' + standard.id}>
                                                                            Assign Assessment
                                                                        </button>
                                                                        <div class="modal fade" id={'moreDetailsModal' + standard.id} tabindex="1" role="dialog" data-id={'span'} aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
                                                                            <div class="modal-dialog" role="document">
                                                                                <div class="modal-content">
                                                                                    <div class="modal-header">
                                                                                        <h5 class="modal-title" id="moreDetailsModalLabel">{'Please confirm assessment assignment.'}</h5>
                                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                            <span aria-hidden="true" id="close">&times;</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div class="modal-body">
                                                                                        {console.log("modal data", standard)}
                                                                                        <button type="button" onClick={() => { this.AssignAssessment(standard) }} data-dismiss="modal">Assign</button>
                                                                                        <button type="button" style={{ marginLeft: "50px" }} data-dismiss="modal">Go back</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                        else {
                                                            return <div class="grid-container">
                                                                <div class="grid-item">
                                                                    {(() => {
                                                                        console.log("if statement")
                                                                        if ((standard.proficient) == '0') {
                                                                            return <div className="dot-red" style={{ borderRadius: "100%", border: "none" }}></div>
                                                                        }
                                                                        else if ((standard.proficient == '1')) {
                                                                            return <div className="dot-yellow" style={{ borderRadius: "100%", border: "none" }}></div>
                                                                        }
                                                                        else if ((standard.proficient == '2')) {
                                                                            return <div className="dot-green" style={{ borderRadius: "100%", border: "none" }}></div>
                                                                        }
                                                                    })()}

                                                                    {standard.proficiency_id.name}</div>


                                                                <div class="grid-item">
                                                                    <button type="button" style={{ borderRadius: "25px", fontSize: "20px", margin: "0px", paddingTop: "1px", paddingBottom: "1px" }} data-toggle="modal" data-target={'#moreDetailsModalDes' + standard.id}>
                                                                        {standard.proficiency_id.standard_info.standard_name}
                                                                    </button>
                                                                    <div class="modal fade" id={'moreDetailsModalDes' + standard.id} tabindex="1" role="dialog" data-id={'span'} aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog" role="document">
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="moreDetailsModalLabel">{'Description'}</h5>
                                                                                </div>
                                                                                <div class="modal-body">
                                                                                    <p>{standard.proficiency_id.description}</p>
                                                                                    <button type="button" style={{ marginLeft: "50px" }} data-dismiss="modal">Go back</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div class="grid-item">
                                                                    <button type="button" style={{ borderRadius: "25px", fontSize: "20px", margin: "0px", paddingTop: "1px", paddingBottom: "1px" }} data-toggle="modal" data-target={'#moreDetailsModal' + standard.id}>
                                                                        Assign Assessment
                                                                    </button>
                                                                    <div class="modal fade" id={'moreDetailsModal' + standard.id} tabindex="1" role="dialog" data-id={'span'} aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog" role="document">
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="moreDetailsModalLabel">{'Please confirm assessment assignment.'}</h5>
                                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true" id="close">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div class="modal-body">
                                                                                    <button type="button" onClick={() => { this.AssignAssessment(standard) }} data-dismiss="modal">Assign</button>
                                                                                    <button type="button" style={{ marginLeft: "50px" }} data-dismiss="modal">Go back</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }



                                                    }
                                                }

                                            })}

                                    </div>

                                );
                            })
                        }

                    </div>



                    <button type="button" className="btn btn-primary btn-lg" style={{ marginTop: "20px", backgroundColor: "#02D0FF" }}>
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

export default StandardDetail;



/*<div className="row">
    {
        this.state.students.map((student, index) => {
            var studenttasks = this.state.list.filter(student_id => student_id.assigned_student.id === student.student_id.id);

            return (
                <div id={student.student_id.first_name + " " + student.student_id.last_name} className="pull-left card col-md-3" key={index} style={{ padding: "0px", marginLeft: "20px", marginBottom: "20px" }}>

                        <div className="card-header" style={{ backgroundColor: "#019DF4" }}>
                            <p className="text-white" style={{ marginBottom: "0px", fontWeight: "bold", fontSize: "30px" }}>{student.student_id.first_name + " " + student.student_id.last_name}</p>
                        </div>
                        {<div className="card-body" style={{ backgroundColor: "#E6E7E9" }} >
                        </div>}

                </div>
            );
        })
    }
</div>*/
