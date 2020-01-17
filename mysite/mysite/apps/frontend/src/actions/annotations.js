import axios from 'axios';

import {
    GET_ANNOTATIONS,
} from './types';

// GET PROJECTS
export const getAnnotations = () => (dispatch) => {
    console.log('in get annotations');
    axios
        .get('/api/v1/videos/annotations')
        .then((res) => {
            dispatch({
                type: GET_ANNOTATIONS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
    // }; {
    //     // axios
    //     //     .get('/api/v1/projects/')
    //     //     .then((res) => {
    //     //         dispatch({
    //     //             type: GET_ANNOTATIONS,
    //     //             payload: res.data,
    //     //         });
    //     //     })
    //     //     .catch((err) => console.log(err));
    //     // dispatch();
    //     console.log('in get annotations action');
    //     return {
    //         type: GET_ANNOTATIONS,
    //         payload: [
    //             { name: 'firstobj', type: 'car', id: 0 },
    //             { name: 'secondobj', type: 'bike', id: 1 },
    //             { name: 'thirdobj', type: 'people', id: 2 },
    //         ],
    //     };
};


// GET PROJECTVIDEOS
export const getProjectVideos = (id) => (dispatch) => {
    axios
        .get(`/api/v1/videos/?project=${id}`)
        .then((res) => {
            dispatch({
                type: GET_ANNOTATIONS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};
