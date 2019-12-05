import { GET_VIDEOS, DELETE_VIDEO, ADD_VIDEO } from '../actions/types.js';

const initialStata = {
    videos: []
}

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_VIDEOS:
            return {
                ...state,
                videos: action.payload
            }
        case DELETE_VIDEO:
            return {
                ...state,
                videos: state.videos.filter(video => video.id != action.payload)
            }
        case ADD_VIDEO:
            return {
                ...state,
                videos: [...state.videos, ...action.payload]
            }
        default:
            return state;
    }
}