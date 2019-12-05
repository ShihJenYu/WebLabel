import axios from 'axios';

import { GET_TASKS, DELETE_TASK, ADD_TASK } from './types';

//GET TASKS
export const getTasks = () => dispatch => {
    axios
        .get('/api/v1/tasks/')
        .then(res => {
            dispatch({
                type: GET_TASKS,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}


//DELETE TASK
export const deleteTask = (id) => dispatch => {
    axios
        .delete(`/api/v1/tasks/${id}/`)
        .then(res => {
            dispatch({
                type: DELETE_TASK,
                payload: id
            });
        })
        .catch(err => console.log(err));
}


//ADD TASK
export const addTask = (task) => dispatch => {
    axios
        .post('/api/v1/tasks/', task)
        .then(res => {
            dispatch({
                type: ADD_TASK,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}
