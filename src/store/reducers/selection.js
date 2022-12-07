import * as ACTION_TYPES from "../actions/action_types";
export const SelectionReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_SELECTION:
            return action.item;
        case ACTION_TYPES.ROTATE_SELECTION:
            return {
                ...state,
                rotation: action.rotation,
            };
        default:
            return state;
    }
};
