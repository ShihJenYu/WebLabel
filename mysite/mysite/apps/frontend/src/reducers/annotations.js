import { GET_ANNOTATIONS } from '../actions/types';

const initialStata = {
    annotations: [],
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_ANNOTATIONS:
            return {
                ...state,
                annotations: action.payload,
            }
        default:
            return state;
    }
}