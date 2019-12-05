import axios from 'axios';

import { GET_BATCHS, DELETE_BATCH, ADD_BATCH } from './types';

//GET BATCHS
export const getBatchs = () => dispatch => {
    axios
        .get('/api/v1/batchs/')
        .then(res => {
            dispatch({
                type: GET_BATCHS,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}


//DELETE BATCH
export const deleteBatch = (id) => dispatch => {
    axios
        .delete(`/api/v1/batchs/${id}/`)
        .then(res => {
            dispatch({
                type: DELETE_BATCH,
                payload: id
            });
        })
        .catch(err => console.log(err));
}


//ADD BATCH
export const addBatch = (batch) => dispatch => {
    axios
        .post('/api/v1/batchs/', batch)
        .then(res => {
            dispatch({
                type: ADD_BATCH,
                payload: res.data
            });
            console.log('res', res)
        })
        .catch(err => console.log(err));
    console.log('ssssssssssssss')
}