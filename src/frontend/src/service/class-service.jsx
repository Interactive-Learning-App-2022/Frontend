import MUtil from 'util/mm.jsx'
import axios from "axios";
import { func } from 'prop-types';

const _mm = new MUtil();
const headers = {
    'Content-Type': 'application/json'
}

class Class {
    constructor() {
        this.gradeID = 0; 
    }

    // get class list
    getStudentList(listParam) {
        return axios.get('http://127.0.0.1:8000/api/classes/viewStudentsInClass/?class=' + listParam.classID)
    }

    getClassList(param) {
        let classlist = {};
        if (param.role == 1) {
            classlist = axios.get('http://127.0.0.1:8000/api/classes/viewClasses/').then(res =>
                res.data.filter(classrooms => classrooms.teacher_id === param.userID)
            )
        } else {
            classlist = axios.get('http://127.0.0.1:8000/api/classes/viewCourseEnrollment/').then(res =>
                res.data.filter(classrooms => classrooms.student_id.id === param.userID).map(item => item.class_id)
            )
        }

        return classlist
    }

    getClassDetails(param) {
        return axios.get('http://127.0.0.1:8000/api/classes/viewClasses/' + param.classID + '/')
    }

    // Return list of student's proficiency levels in a given class
    getProficienyLevels(param) {
        return axios.get('http://127.0.0.1:8000/api/classes/viewCouseProficiency/' + param.classID + '/')
    }

    getPList(param) {
        return axios.get('http://127.0.0.1:8000/api/proficiencies/viewMyProficiencies/?class=' + param.classID + "&prof=" + param.profID);
    }

    getAllPList(param) {
        return axios.get('http://127.0.0.1:8000/api/proficiencies/viewMyProficiencies/?class=' + param.classID);
    }

    getTaskLocation(param) {
        return axios.get('http://127.0.0.1:8000/api/tasks/viewTasks/' + param.taskID + '/')
    }

    assignTask(param, param1) {
        console.log("PARAM");
        console.log(param1);
        return axios.post('http://127.0.0.1:8000/api/tasks/viewAssignNewTask/', param1, { headers: headers })
    }

    getTaskList(param) {
        return axios.get('http://127.0.0.1:8000/api/tasks/viewTasks/?proficiency_id=' + param.profID)
    }

    getStudentsInTaskPage(param) {
        console.log(param);
        let tasks = axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedTasks/?class=' + param.classID);
        return tasks
    }

    getStudentTasks(param) {
        console.log("PARAM:");
        console.log(param);
        let tasks = axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedTasks/?student=' + param.userID);
        return tasks
    }

    getAssignedTask(param) {
        let task = axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedTasks/' + param.taskID + '/')
        console.log("tasks", task)
        return task
    }

    putNewTaskStatus(param) {
        return axios.put('http://127.0.0.1:8000/api/tasks/viewAssignedTasks/' + param.taskID + '/', param.data,
            { headers: headers });
    }

    getStudentAssignedTasks(param) {
        console.log("task info" ,param);
        let tasks = axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedTasks/?class=' + param.classID + '&' + 'user=' + param.userID);
        return tasks
    }

    getStudentInTarget(param) {
        return _mm.request({
            api_token: param.api_token,
            type: 'get',
            url: 'https://laravel-lsm.herokuapp.com/api/v1/' + param.userID + '/classroom/' + param.classID + '/' + param.pLevel + '/' + param.targetID,

        })
    }

    // test function to get subject ID from class ID
    getSubject(param) {
        console.log("PARAM");
        console.log(param);
        let subject = axios.get('http://127.0.0.1:8000/api/classes/viewClasses/?class=' + param.classID)
        console.log("THIS IS SUBJECT")
        console.log(subject)
        return(subject)
    }

    // test function to return all standards
    //getStandards(param) {
    //    return axios.get('http://127.0.0.1:8000/api/proficiencies/viewStandards/?grade=' + param.gradeID)
    //}

    // test function to return standards per specified student
    getStudentStandards(param) {
        return axios.get('http://127.0.0.1:8000/api/proficiencies/viewMyStandards/?subject=' + param.subjectID)
    }

    // gets assessment ID of the specified proficiency, passes this result to AssignAssessments
    getAssessment_id(param, standard) {
        let id = axios.get('http://127.0.0.1:8000/api/tasks/viewAssessments/?proficiency_id=' + param)
        console.log("assessmentID is ", id)
            
        id.then(res => {
            const AssessID = res.data[0].id
            this.AssignAssessment(AssessID, standard)
        })

    }

    // Assign assessment to specified student.
    AssignAssessment(AssessID, standard) {
        console.log(AssessID, standard)
        let data = {
            "class_id": Number(standard.class_id.id),
            "assigned_student": Number(standard.student_id.id),
            "assessment_id": AssessID,
            "status": "0",
            "proficiency_id": standard.id,
        }
        console.log("This is data.", data)
        console.log("string time")
        console.log(JSON.stringify(data))

        return axios.post('http://127.0.0.1:8000/api/tasks/viewAssignNewAssessment/', JSON.stringify(data), { headers: headers })        
    }


    // Selects ProficiencyLevel by student and prof ID and uses this to assign previous assessment
    AssignNewAssessment(param) {
        let data
        console.log("new code", param)

        axios.get('http://127.0.0.1:8000/api/tasks/viewAssessments/' + param.assessment_id.prev_assessment + '/').then(res =>
            axios.get('http://127.0.0.1:8000/api/proficiencies/viewMyProficiencies/?student=' + param.assigned_student.id + '&prof=' + res.data.proficiency_id).then(res2 =>
                this.Assign(param, res2)
            )
        )
        return      
    }

    //Assigns the assessment using params given
    Assign(param, res) {
        let data = {
            "class_id": Number(param.class_id.id),
            "assigned_student": Number(param.assigned_student.id),
            "assessment_id": Number(param.assessment_id.prev_assessment),
            "status": "0",
            "proficiency_id": Number(res.data[0].id),
        }
        console.log("string time")
        console.log(JSON.stringify(data))
        return axios.post('http://127.0.0.1:8000/api/tasks/viewAssignNewAssessment/', JSON.stringify(data), { headers: headers })  
    }


    // Get student assessments
    getStudentAssignedAssessments(param, logic) {
        console.log("Assessment info" ,param, logic);
        if (logic == 0) {
            let assessment = axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedAssessments/?class=' + param.classID + '&' + 'user=' + param.userID);
            console.log(assessment)
            return assessment
        }
        else if (logic == 1) {
            let assessment = axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedAssessments/?id=' + param);

            assessment.then(res => {
                this.AssignNewAssessment(res.data[0])
            })

            return
        }
    }

    // updates student assessment score
    putAssessmentScores(id, score) {
        let data;
        if (score == '1') {
            data = {
                "proficient": score,
                "status": "1",
            }
        }
        else {
        data = {
            "proficient": score,
            "status": "2",
            }
        }
        data = JSON.stringify(data)
        console.log("data string", data)
        
        return axios.put('http://127.0.0.1:8000/api/tasks/viewAssignedAssessments/' + id + '/', data,
            { headers: headers });

       
    }

    putProficiencyScores(id, score) {
        let data;
        if (score == '1') {
            data = {
                "proficient": score,
                "status": "1",
            }
        }
        else {
        data = {
            "proficient": score,
            "status": "2",
            }
        }

        axios.get('http://127.0.0.1:8000/api/tasks/viewAssignedAssessments/' + id).then(res =>
            axios.put('http://127.0.0.1:8000/api/proficiencies/viewMyProficiencies/' + res.data.proficiency_id + '/', data,
            { headers: headers })
        )

        return
    }
}

export default Class;
