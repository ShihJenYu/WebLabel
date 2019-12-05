import { GET_PROJECTS, DELETE_PROJECT, ADD_PROJECT, RENAME_PROJECT, GET_PROJECT_PACKS, RENAME_PACK, ADD_PACK, DELETE_PACK } from '../actions/types.js';

const initialStata = {
    projects: [],
    project_packs: [],
    current_project: null
}

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_PROJECTS:
            return {
                ...state,
                projects: action.payload
            }
        case DELETE_PROJECT:
            return {
                ...state,
                projects: state.projects.filter(project => project.id != action.payload)
            }
        case ADD_PROJECT:
            return {
                ...state,
                projects: [...state.projects, action.payload]
            }
        case RENAME_PROJECT:
            return {
                ...state,
                projects: state.projects.map(project => { if (project.id == action.payload.id) { return action.payload } return project })
            }
        case GET_PROJECT_PACKS:
            return {
                ...state,
                project_packs: [...action.payload]
            }

        case RENAME_PACK:
            return {
                ...state,
                project_packs: state.project_packs.map(pack => { if (pack.id == action.payload.id) { return action.payload } return pack })
            }
        case ADD_PACK:
            return {
                ...state,
                project_packs: [...state.project_packs, action.payload]
            }
        case DELETE_PACK:
            return {
                ...state,
                project_packs: state.project_packs.filter(pack => pack.id != action.payload)
            }
        default:
            return state;
    }
}