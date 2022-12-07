import * as ACTION_TYPES from "./action_types";

export const selectPathPoint = (point) => {
    return {
        type: ACTION_TYPES.SELECT_PATH_POINT,
        point,
    };
};
export const selectBezierPoint = (point) => {
    return {
        type: ACTION_TYPES.SELECT_BEZIER_POINT,
        point,
    };
};
export const showNewPathPoint = (point) => {
    return {
        type: ACTION_TYPES.SHOW_NEW_PATH_POINT,
        point,
    };
};
export const createPathPoint = (point) => {
    console.log("action");
    return {
        type: ACTION_TYPES.CREATE_PATH_POINT,
        point,
    };
};
export const deletePathPoint = () => {
    return {
        type: ACTION_TYPES.DELETE_PATH_POINT,
    };
};
export const updatePathEditorPoints = () => {
    return {
        type: ACTION_TYPES.UPDATE_PATH_EDITOR_POINTS,
    };
};
export const movePathPoint = (data) => {
    return {
        type: ACTION_TYPES.MOVE_PATH_POINT,
        x: data.x,
        y: data.y,
    };
};
export const moveBezierPoint = (data) => {
    return {
        type: ACTION_TYPES.MOVE_BEZIER_POINT,
        x: data.x,
        y: data.y,
    };
};
export const toggleBezierPoint = (point) => {
    return {
        type: ACTION_TYPES.TOGGLE_BEZIER_POINT,
        point,
    };
};
export const openPathEditor = () => {
    return {
        type: ACTION_TYPES.OPEN_PATH_EDITOR,
    };
};
