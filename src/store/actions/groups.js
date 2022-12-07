import * as ACTION_TYPES from "./action_types";

export const rotateGroup = (data) => {
    return {
        type: ACTION_TYPES.ROTATE_GROUP,
        rotation: data.rotation,
        selection: data.selection,
    };
};
export const rotateGroups = (data) => {
    return {
        type: ACTION_TYPES.ROTATE_GROUPS,
        rotation: data.rotation,
        selection: data.selection,
    };
};

export const resizeGroup = (data) => {
    return {
        type: ACTION_TYPES.RESIZE_GROUP,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
    };
};

export const resizeGroups = (data) => {
    return {
        type: ACTION_TYPES.RESIZE_GROUPS,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
    };
};

export const moveGroup = (data) => {
    return {
        type: ACTION_TYPES.MOVE_GROUP,
        x: data.x,
        y: data.y,
    };
};
export const moveGroups = (data) => {
    return {
        type: ACTION_TYPES.MOVE_GROUPS,
        x: data.x,
        y: data.y,
    };
};

export const selectGroup = (group) => {
    return {
        type: ACTION_TYPES.SELECT_GROUP,
        group,
    };
};
export const selectGroups = (groups) => {
    return {
        type: ACTION_TYPES.SELECT_GROUPS,
        groups,
    };
};

export const refreshCornersGroup = () => {
    return {
        type: ACTION_TYPES.REFRESH_CORNERS_GROUP,
    };
};
export const refreshCornersGroups = () => {
    return {
        type: ACTION_TYPES.REFRESH_CORNERS_GROUPS,
    };
};
