import {
    GET_VIDEOS, DELETE_VIDEO, ADD_VIDEO, GET_PROJECTVIDEOS, GET_PACKVIDEOS,
} from '../actions/types';

const initialStata = {
    videos: [],
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_VIDEOS: case GET_PROJECTVIDEOS: case GET_PACKVIDEOS:
            return {
                ...state,
                videos: action.payload,
            };
        case DELETE_VIDEO:
            return {
                ...state,
                videos: state.videos.filter((video) => video.id !== action.payload),
            };
        case ADD_VIDEO:
            return {
                ...state,
                videos: [...state.videos, ...action.payload],
            };
        default:
            return state;
    }
}
