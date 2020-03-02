import { GET_PACKS, DELETE_PACK, ADD_PACK } from '../actions/types';

const initialStata = {
    packs: [],
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_PACKS:
            return {
                ...state,
                packs: action.payload,
            };
        case DELETE_PACK:
            return {
                ...state,
                packs: state.packs.filter((pack) => pack.id !== action.payload),
            };
        case ADD_PACK:
            return {
                ...state,
                packs: [...state.packs, action.payload],
            };
        default:
            return state;
    }
}
