import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Class from 'service/class-service.jsx';
import MUtil from 'util/mm.jsx'

const _mm = new MUtil();
const _class = new Class();

import './style2.scss'

class Quiz {

        
    constructor() {

                }
    // Creates and returns a Key: Value pair for each assessment, with the key being the test's respective proficiency
    // correct corresponds to A, B, C, D
    Assessments(param) {
        const quiz = new Map();
        let questions = [
            {
                question : "Add 2/3 to 3/4 (B)",
                choiceA : "5/7",
                choiceB : "17/12",
                choiceC : "13/12",
                choiceD : "9/8",
                correct : 2
            },{
                question : "Add 5/6 to 3/6 (A)",
                choiceA : "8/6",
                choiceB : "4/3",
                choiceC : "9/10",
                choiceD : "18/30",
                correct : 1
            },{
                question : "Subtract 3/4 from 9/10 (C)",
                choiceA : "12/14",
                choiceB : "27/40",
                choiceC : "6/40",
                choiceD : "40/6",
                correct : 3
            },{
                question : "Subtract 1/4 from 2/3 (B)",
                choiceA : "2/12",
                choiceB : "5/12",
                choiceC : "12/5",
                choiceD : "8/3",
                correct : 2
            },{
                question : "Add 3/4 to 1/2 then subtract 2/3 (B)",
                choiceA : "15/12",
                choiceB : "7/12",
                choiceC : "8/5",
                choiceD : "7/3",
                correct : 2
            }
        ];
        quiz.set("Math-5.NF.2", questions);

        questions = [
            {
                question : "3/4 divided by 2/3 (B)",
                choiceA : "6/12",
                choiceB : "1 1/8",
                choiceC : "2 2/5",
                choiceD : "1/2",
                correct : 2
            },{
                question : "3/5 divided by 1/2 (A)",
                choiceA : "6/5",
                choiceB : "5/6",
                choiceC : "1 1/5",
                choiceD : "3/10",
                correct : 1
            },{
                question : "6/8 divided by 3/4 (C)",
                choiceA : "18/32",
                choiceB : "8/9",
                choiceC : "1",
                choiceD : "4/5",
                correct : 3
            },{
                question : "4/5 divided by 1/3 (D)",
                choiceA : "4/15",
                choiceB : "15/4",
                choiceC : "2 2/5",
                choiceD : "12/5",
                correct : 4
            },{
                question : "9/10 divided by 1/10 (D)",
                choiceA : "9/100",
                choiceB : "100/9",
                choiceC : "90/10",
                choiceD : "9",
                correct : 4
            }
        ];
        quiz.set("Math-6.NS.1", questions)

        questions = {
                realQuiz : false,
                question : "Sample Question",
                choiceA : "N/A",
                choiceB : "N/A",
                choiceC : "N/A",
                choiceD : "N/A",
                correct : 5
        }
        quiz.set("Sample", questions)
        console.log("THIS IS QUIZ", quiz);
        return quiz.get(param)
    }
   
}

export default Quiz;