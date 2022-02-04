import React from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx'
import Quiz from 'component/assessments/quiz.jsx';

const _mm = new MUtil();
const _class = new Class();
const _assessment = new Quiz();

import PageTitle from 'component/page-title/index.jsx';
import './index.scss';
import Math from "./math3.jpg";

import PreLoader from 'component/pre-loader/index.jsx';
import { element } from 'prop-types';


class Home extends React.Component {
    constructor(props) {
        super(props);
        // pulls assessmentAssigned ID from url
        this.assessmentID = parseInt(this.props.match.params.assessmentID)
        this.assessment_name = (this.props.match.params.assessmentName)

        // starting answer values
        this.runningQuestion = 0;
        this.answer = "E";

        // refs for the various DOM elements
        this.button = () => {
            console.log("buttons");
        };

        this.start = element => {
            this.start = element;
            console.log("start?", this.start);
        };

        this.quiz = element => {
            this.quiz = element;
        }

        this.question = element => {
            this.question = element;
        }

        this.choiceA = element => {
            this.choiceA = element;
        }

        this.choiceB = element => {
            this.choiceB = element;
        }

        this.choiceC = element => {
            this.choiceC = element;
        }

        this.choiceD = element => {
            this.choiceD = element;
        }

        this.scoreDetails = element => {
            this.scoreDetails = element;
        }

        this.finalDetails = element => {
            this.finalDetails = element;
        }

        // onClick methods
        this.A_click = () => {
            this.answer = 1;
            this.checkAnswer()
        }

        this.B_click = () => {
            this.answer = 2;
            this.checkAnswer()
        }

        this.C_click = () => {
            this.answer = 3;
            this.checkAnswer()
        }

        this.D_click = () => {
            this.answer = 4;
            this.checkAnswer()
        }


        // start of quiz implimentation.

        this.checkAnswer = () => {
            console.log("checking", this.answer, this.questions[this.runningQuestion].correct);
            if (this.answer === this.questions[this.runningQuestion].correct) {
                this.score++;
                console.log("score", this.score)
                this.scoreDetails.innerHTML = "Number Correct: " + this.score;
            }

            if (this.runningQuestion != this.lastQuestion) {

                this.runningQuestion += 1;
                this.renderQuestion()
            }
            else {
                this.question.innerHTML = "Quiz Finished.";
                this.choiceA.style.display = "none";
                this.choiceB.style.display = "none";
                this.choiceC.style.display = "none";
                this.choiceD.style.display = "none";
                this.finalScore()
            }
        }

        this.finalScore = () => {
            const scorePerCent = (100 * this.score / this.questions.length);
            this.finalDetails.innerHTML = "Final Score: " + scorePerCent + "%";
            console.log("This is scorePercent", scorePerCent)
            if (scorePerCent >= 70) {
                console.log("if statement")
                _class.putAssessmentScores(this.props.match.params.assessmentID, '2')
                _class.putProficiencyScores(this.props.match.params.assessmentID, '2')
            }
            else if (scorePerCent >= 60) {
                _class.putAssessmentScores(this.props.match.params.assessmentID, '1')
                _class.putProficiencyScores(this.props.match.params.assessmentID, '1')
            }
            else {
                // Assign the prev test linked if student failed the assessment
                _class.getStudentAssignedAssessments(this.props.match.params.assessmentID, 1)
            }
        }

        this.renderQuestion = () => {
            let q = this.questions[this.runningQuestion]

            this.question.innerHTML = q.question;
            this.choiceA.innerHTML = q.choiceA;
            this.choiceB.innerHTML = q.choiceB;
            this.choiceC.innerHTML = q.choiceC;
            this.choiceD.innerHTML = q.choiceD;
        }

        this.startQuiz = () => {
            this.score = 0;
            this.start.style.display = "none";
            this.runningQuestion = 0
            this.quiz.style.display = "block";
            this.renderQuestion()

        }

        try {
            this.state = {
                username: _mm.getStorage('userInfo').data.user.username,
                userID: _mm.getStorage('userInfo').data.user.id,
                api_token: _mm.getStorage('userInfo').data.token,
                role: _mm.getStorage('userInfo').data.user.groups[0],
                classrooms: _mm.getStorage('classrooms').data,

            };
        } catch (e) {
            this.state = {
                assessment: '',
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

    render() {

        this.questions = _assessment.Assessments(this.assessment_name)
        this.lastQuestion = this.questions.length - 1;
        console.log("logging", this);


        const checkRole = this.state.role;
        if (checkRole == 2) {
            return (
                <div id="page-wrapper" style={{ marginTop: "0px" }}>
                    <h1 className="display-3" style={{ fontWeight: "bold", color: "grey", opacity: "0.3", marginBottom: "50px", marginTop: "70px" }}>
                        Assessment
                    </h1>
                    <PreLoader display="none" ref="loader" size=""></PreLoader>
                    <div>

                    </div>

                    <div id="container">
                        <div id="start" onClick={this.startQuiz} ref={this.start}>Start Quiz!</div>
                        <div id="qImg"><img src={Math} /></div>
                        <div id="quiz" ref={this.quiz} style={{ display: "none" }}>
                            <div id="question" ref={this.question}><p>{this.question}</p></div>

                            <div id="choices">
                                <div className="choice" id="A" onClick={this.A_click} ref={this.choiceA}>{this.choiceA}</div>
                                <div className="choice" id="B" onClick={this.B_click} ref={this.choiceB}>{this.choiceB}</div>
                                <div className="choice" id="C" onClick={this.C_click} ref={this.choiceC}>{this.choiceC}</div>
                                <div className="choice" id="D" onClick={this.D_click} ref={this.choiceD}>{this.choiceD}</div>
                            </div>
                            <div id="progress" ref={this.progress}></div>

                        </div>

                    </div>
                    <div ref={this.scoreDetails}>{this.score}</div>
                    <div ref={this.finalDetails}>{this.finalDetails}</div>

                    <div>


                        <button type="button" class="btn btn-primary btn-lg" style={{ marginTop: "100px", backgroundColor: "#02D0FF" }}>
                            <span onClick={() => this.props.history.goBack()}>Back</span>
                        </button>


                    </div>

                </div>


            );

        }
    }
}

export default Home;