import * as ACTION_TYPES from "./action_types";
export const setSelection = (item) => {
    return {
        type: ACTION_TYPES.SET_SELECTION,
        item,
    };
};

export const rotateSelection = (rotation) => {
    return {
        type: ACTION_TYPES.ROTATE_SELECTION,
        rotation,
    };
};
