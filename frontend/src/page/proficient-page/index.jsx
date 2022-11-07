// unsure if this actually does anything. Does not appear to be linked to any page

import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx'
const _mm = new MUtil();
const _class = new Class();


import PageTitle from 'component/page-title/index.jsx';
import './index.scss'
import warning from 'tiny-warning';
import PreLoader from 'component/pre-loader/index.jsx';

class ProficientPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: _mm.getStorage('userInfo').data.user.id,
            username: _mm.getStorage('userInfo').data.user.name,
            classID: this.props.match.params.classID,
            api_token: _mm.getStorage('userInfo').data.api_token,
            role: _mm.getStorage('userInfo').data.user.groups[0],
            p_count: 0,
            ap_count: 0,
            np_count: 0,
            proficientLevel: '',
            moduleInfo: [],

            //info student page need
            //Task info (tasks assigned by teacher)
            tasks: []
        }
    }

    componentDidMount() {

        this.loadClassDetail();
        this.checkLogin();
    }

    componentWillmount() {
        this.loadClassDetail();
    }


    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }


    toModule(e, link) {
        e.preventDefault();
        window.location.href = '/' + link;
    }

    loadClassDetail() {
        // If teacher
        if (this.state.role == '1') {
            let classInfo = {};
            this.refs.count1.style.display = "none";
            this.refs.count2.style.display = "none";
            this.refs.count3.style.display = "none";

            this.refs.loader.show();
            this.refs.loader1.show();
            this.refs.loader2.show();
            classInfo.api_token = this.state.api_token;
            classInfo.userID = this.state.userID;
            classInfo.classID = this.state.classID;
            classInfo.pLevel = this.state.proficientLevel;

            let countInfo = {};
            countInfo.p_count = this.state.p_count;
            if (window.localStorage.getItem('proficiencyLevels')) {
                this.setState({
                    p_count: _mm.getStorage('proficiencyLevels').proficientCount,
                    ap_count: _mm.getStorage('proficiencyLevels').almostProficientCount,
                    np_count: _mm.getStorage('proficiencyLevels').notProficientCount
                })
            }

            _class.getProficienyLevels(classInfo).then((res) => {
                this.refs.count1.style.display = "block";
                this.refs.count2.style.display = "block";
                this.refs.count3.style.display = "block";
                this.refs.loader.hide();
                this.refs.loader1.hide();
                this.refs.loader2.hide();

                var studentProficiencyCounts = [];
                var proficient = 0;
                var almostProficient = 0;
                var nonProficient = 0;
                console.log(res);

                // Aggregate response to have proficient and non-proficient counts for each student
                // One record per student will be generated
                res.data.reduce(function (resp, value) {

                    if (!studentProficiencyCounts[value.student_id]) {
                        studentProficiencyCounts[value.student_id] = { studentID: value.student_id, proficientCount: 0, almostProficientCount: 0, notProficientCount: 0 };
                        //studentProficiencyCounts.push(resp[value.student_id]);
                    }
                    if (value.is_proficient == "0") {
                        console.log("PRO");
                        proficient += 1;
                    } else if (value.is_proficient == "1") {
                        console.log("ALM");
                        almostProficient += 1;
                    } else {
                        console.log("NON");
                        nonProficient += 1;
                    }



                }, {});

                this.setState({
                    p_count: proficient,
                    ap_count: almostProficient,
                    np_count: nonProficient
                })

                var proficiencyScores = { proficientCount: 0, almostProficientCount: 0, notProficientCount: 0 };
                let almostProficientThreshold = 0.60; // 60% proficient to be 'almost proficient' (TODO: CHECK WITH LARRY ON THIS VALUE)
                // Aggregate again to get totals for proficient, almost proficient, not proficient
                /*    studentProficiencyCounts.reduce(function (resp, student) {
    
                        // Fully proficient
                        if (student.proficientCount > 0 && student.notProficientCount == 0) {
                            proficiencyScores['proficientCount'] += 1;
                        }
    
                        // Almost proficient
                        else if (student.proficientCount / (student.proficientCount + student.notProficientCount) > almostProficientThreshold) {
                            proficiencyScores['almostProficientCount'] += 1;
                        }
    
                        // Not proficient
                        else {
                            proficiencyScores['notProficientCount'] += 1;
                        }
                    }, {});
    
                    // Add aggregate proficiency scores to memory
                    _mm.setStorage('proficiencyLevels', proficiencyScores);
    
                    // TODO: Store student level information in memory so that when a teacher clicks more details,
                    // they can see more details
    
                    this.setState({
                        p_count: _mm.getStorage('proficiencyLevels').proficientCount,
                        ap_count: _mm.getStorage('proficiencyLevels').almostProficientCount,
                        np_count: _mm.getStorage('proficiencyLevels').notProficientCount
                    })
                }, (errMsg) => {
                    _mm.errorTips(errMsg);
                }); */
            }, {});
        }
    }

    // render page
    render() {
        const checkRole = this.state.role;

        let renderer;


        renderer = (
            <div className="row" style={{ marginTop: "45px" }}>
                <div className="card col-md-3" style={{ padding: "0px", marginLeft: "18px" }}>
                    <Link to={`/classroom/${this.state.classID}/p`} className="text-muted" style={{ textDecoration: "none" }}>
                        <div className="card-header" style={{ backgroundColor: "#02B385" }}>
                            <span className="text-white" style={{ fontWeight: "bold", fontSize: "30px" }}>Proficient</span>
                        </div>
                        <div className="card-body" style={{ backgroundColor: "#01CF85" }}>
                            <PreLoader display="none" ref="loader" size=""></PreLoader>
                            <p className="display-1 text-white" style={{ marginBottom: "0px", fontWeight: "bold" }} ref="count1">{this.state.p_count}</p>
                            <p className="text-white" style={{ fontSize: "25px" }}>Students</p>
                            <a href={`/classroom/${this.state.classID}/p`} className="btn btn-primary" style={{ backgroundColor: "#02B385", border: "none", borderRadius: "25px" }}>More Details</a>
                        </div>
                    </Link>
                </div>
                <div className="card col-md-3" style={{ padding: "0px", marginLeft: "40px", minWidth: "26%" }}>
                    <Link to={`/classroom/${this.state.classID}/ap`} className="text-muted" style={{ textDecoration: "none" }}>
                        <div className="card-header" style={{ backgroundColor: "#EF9B0F" }}>
                            <span className="text-white" style={{ fontWeight: "bold", fontSize: "30px" }}>Almost Proficient</span>
                        </div>
                        <div className="card-body" style={{ backgroundColor: "#FFD800" }}>
                            <PreLoader display="none" ref="loader1" size=""></PreLoader>
                            <p className="display-1 text-white" style={{ marginBottom: "0px", fontWeight: "bold" }} ref="count2">{this.state.ap_count}</p>
                            <p className="text-white" style={{ fontSize: "25px" }}>Students</p>
                            <a href={`/classroom/${this.state.classID}/ap`} className="btn btn-primary" style={{ backgroundColor: "#EF9B0F", border: "none", borderRadius: "25px" }}>More Details</a>
                        </div>
                    </Link>
                </div>
                <div className="card col-md-3" style={{ padding: "0px", marginLeft: "40px" }}>
                    <Link to={`/classroom/${this.state.classID}/np`} className="text-muted" style={{ textDecoration: "none" }}>
                        <div className="card-header" style={{ backgroundColor: "#e82727" }}>
                            <span className="text-white" style={{ fontWeight: "bold", fontSize: "30px" }}>Non-Proficient</span>
                        </div>
                        <div className="card-body" style={{ backgroundColor: "#f57242" }}>
                            <PreLoader display="none" ref="loader2" size=""></PreLoader>
                            <p className="display-1 text-white" style={{ marginBottom: "0px", fontWeight: "bold" }} ref="count3">{this.state.np_count}</p>
                            <p className="text-white" style={{ fontSize: "25px" }}>Students</p>
                            <a href={`/classroom/${this.state.classID}/np`} className="btn btn-primary" style={{ backgroundColor: "#e82727", border: "none", borderRadius: "25px" }}>More Details</a>
                        </div>
                    </Link>
                </div>


            </div>
        );


        //student page


        return (
            <div id="page-wrapper">
                <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>Proficiency Overview</h1>
                {renderer}
                <button type="button" class="btn btn-primary btn-lg" style={{ marginTop: "100px", backgroundColor: "#02D0FF" }}>
                    <span onClick={() => this.props.history.goBack()}>Back</span>
                </button>

            </div>
        );


    }
}

export default ProficientPage;
