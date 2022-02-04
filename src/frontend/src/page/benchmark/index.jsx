import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx'
import TableList from 'util/table-list/index.jsx';

const _mm = new MUtil();
const _class = new Class();

import './index.scss'
import PreLoader from 'component/pre-loader/index.jsx';



class Benchmark extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            details: [],
            count: 0,
            scores: {},
            classID: this.props.match.params.classID,
            pLevel: this.props.match.params.pLevel,
            userID: _mm.getStorage('userInfo').data.user.id,
            api_token: _mm.getStorage('userInfo').data.token,
            role: _mm.getStorage('userInfo').data.user.groups[0],
            title: '',
            selected: [],
            taskID: 0,
            taskList: []

        };
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        this.refs.loader.black();
        this.checkLogin();
        this.loadClassList();

    }
    handleChange(event) {
        this.setState({ taskID: event.target.value });
    }


    loadClassList() {
        let UserInfo = {};
        UserInfo.api_token = this.state.api_token;
        UserInfo.userID = this.state.userID;
        UserInfo.classID = this.state.classID;

        _class.getAllPList(UserInfo).then(res => {

            // Grab distinct proficiencies
            let plist = [];
            let pscores = {};
            console.log("PREFILTER");
            console.log(res.data);
            for (var i = 0; i < res.data.length; i++) {
                if (!this.contains(res.data[i].proficiency_id.id, plist)) {
                    plist.push(res.data[i]);
                    pscores[res.data[i].proficiency_id.id] = { 'name': res.data[i].proficiency_id.name, 'p': 0, 'ap': 0, 'np': 0 };
                }
            }

            // Populate total scores of proficient, ap, np
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].scores_id.is_proficient == '0')
                    pscores[res.data[i].proficiency_id.id]['p'] += 1;
                else if (res.data[i].scores_id.is_proficient == '1')
                    pscores[res.data[i].proficiency_id.id]['ap'] += 1;
                else
                    pscores[res.data[i].proficiency_id.id]['np'] += 1;
            }

            console.log('SCORES');
            console.log(pscores);

            this.setState({ list: plist, scores: pscores });
            this.refs.loader.hide();
        }, errMsg => {
            this.setState({
                list: []
            })
            _mm.errorTips(errMsg);
        });
    }

    // Helper function for finding unique proficiencies
    contains(search, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].proficiency_id.id === search) return true;
        }
        return false;
    }

    checkLogin() {
        if (localStorage.getItem("userInfo") === null) {
            window.location.href = '/login';
        }
    }

    onInputChange(e) {
        let inputValue = e.target.value,
            inputName = e.target.name;
        if (inputName == "selected") {
            this.setState({
                selected: this.state.selected.concat(inputValue)
            });
            console.log(inputValue);
        } else {
            this.setState({
                [inputName]: inputValue
            });
        }


        console.log(inputName);
    }

    onInputKeyUp(e) {
        if (e.keyCode === 13) {
            this.onSubmit();
        }
    }

    onSubmit() {
        let loginInfo = {
            api_token: this.state.api_token,
            userID: this.state.userID,
            taskID: this.state.taskID
        };
        let data = {
            "task": {
                "class_id": this.state.classID,
                "students_id": this.state.selected
            }
        }
        console.log(data);
        _class.assignTask(loginInfo, JSON.stringify(data)).then((res) => {
            _mm.successTips(res.message);

        }, (errMsg) => {
            _mm.errorTips(errMsg.message);
        });

    }

    goTo(e, link) {
        e.preventDefault();
        if (e.target.tagName == 'TD') {
            window.location.assign(link);
        }

    }


    render() {


        let listBody;
        if (this.state.role == '1') {
            listBody = this.state.list.map((target, index) => {
                return (
                    <tr ref={node => this.node = node} key={index} onClick={e => { this.goTo(e, `/classroom/${this.state.classID}/${target.proficiency_id.id}`) }} id={index}>
                        <td className="text-center">{target.proficiency_id.name}</td>
                        <td>
                            {target.proficiency_id.description}
                            <button type="button" class="btn btn-dark" style={{ borderRadius: "25px", float: "right", fontSize: "13px", margin: "0px", paddingTop: "1px", paddingBottom: "1px", paddingRight: "15px", paddingLeft: "15px" }} data-toggle="modal" data-target={'#moreDetailsModal' + target.id}>
                                More Details
                        </button>
                            <div class="modal fade" id={'moreDetailsModal' + target.id} tabindex="1" role="dialog" data-id={'span' + index} aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="moreDetailsModalLabel">{'Target ' + target.proficiency_id.id}</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true" id="close">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            {target.details}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="text-center" style={this.state.scores[target.proficiency_id.id].p != 0 ? { backgroundColor: "#01CF85" } : { backgroundColor: "#01CF85" }}>{this.state.scores[target.proficiency_id.id].p}</td>
                        <td className="text-center" style={this.state.scores[target.proficiency_id.id].ap != 0 ? { backgroundColor: "#FFD800" } : { backgroundColor: "#FFD800" }}>{this.state.scores[target.proficiency_id.id].ap}</td>
                        <td className="text-center" style={this.state.scores[target.proficiency_id.id].np != 0 ? { backgroundColor: "#FE4C4C" } : { backgroundColor: "#FE4C4C" }}>{this.state.scores[target.proficiency_id.id].np}</td>
                        <td className="text-center">{target.no_scores}</td>
                    </tr>
                );
            });
        } else {

            /* listBody = this.state.list.map((target, index) => {
                 return (
                     <tr key={index}>
                         <td className="text-center"> {target.name} </td>
                         <td>{target.description}</td>
                         {
                             target.scores.map((score, index) => (
 
                                 <td key={index} className="text-center" style={score.score ? (score.score > 75 ? { backgroundColor: "#01CF85" } : (score.score > 40 ? { backgroundColor: "#FFD800" } : { backgroundColor: "#FE4C4C" })) : {}}>{score.score == 0 ? "-" : score.score}</td>
 
                             ))
                         }
 
 
                     </tr>
                 );
             });*/
        }



        let renderer;

        if (this.state.role == '1') {
            renderer =
                <TableList tableHeads={['Targets', 'Description', 'Proficient', 'Almost Proficient', 'Non Proficient', 'Missing Score']}>
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    {listBody}
                </TableList>;
        } else {
            renderer =
                <TableList tableHeads={['Targets', 'Description', 'Scores']}>
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    {listBody}
                </TableList>;

        }


        return (
            <div id="page-wrapper">
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
                <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>{'Proficiency Overview'}</h1>
                {renderer}
                <button type="button" class="btn btn-primary btn-lg" style={{ marginTop: "50px", backgroundColor: "#02D0FF" }}>
                    <span onClick={() => this.props.history.goBack()}>Back</span>
                </button>
            </div>

        );
    }
}
export default Benchmark;
