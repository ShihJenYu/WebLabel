import axios from 'axios';

import { GET_PACKS, DELETE_PACK, ADD_PACK, RENAME_PACK } from './types';

//GET PACKS
export const getPacks = () => dispatch => {
    axios
        .get('/api/v1/packs/')
        .then(res => {
            dispatch({
                type: GET_PACKS,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}


//DELETE PACK
export const deletePack = (id) => dispatch => {
    axios
        .delete(`/api/v1/packs/${id}/`)
        .then(res => {
            dispatch({
                type: DELETE_PACK,
                payload: id
            });
        })
        .catch(err => console.log(err));
}


//RENAME PACK
export const renamePack = (id, pack) => dispatch => {
    axios
        .patch(`/api/v1/packs/${id}/`, pack)
        .then(res => {
            dispatch({
                type: RENAME_PACK,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}


//ADD PACK
export const addPack = (pack) => dispatch => {
    axios
        .post('/api/v1/packs/', pack)
        .then(res => {
            dispatch({
                type: ADD_PACK,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}