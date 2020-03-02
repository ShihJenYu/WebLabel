import { GET_BATCHS, DELETE_BATCH, ADD_BATCH } from '../actions/types';

const initialStata = {
    batchs: [],
    latest_batch: {},
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_BATCHS:
            return {
                ...state,
                batchs: action.payload,
            };
        case DELETE_BATCH:
            return {
                ...state,
                batchs: state.batchs.filter((batch) => batch.id !== action.payload),
            };
        case ADD_BATCH:
            return {
                ...state,
                batchs: [...state.batchs, action.payload],
                latest_batch: action.payload,
            };
        default:
            return state;
    }
}
