import * as ACTION_TYPES from "./action_types";

export const rotateItem = (rotation) => {
    return {
        type: ACTION_TYPES.ROTATE_ITEM,
        rotation,
    };
};
export const rotateItems = (data) => {
    return {
        type: ACTION_TYPES.ROTATE_ITEMS,
        rotation: data.rotation,
        selection: data.selection,
    };
};
export const resizeItem = (data) => {
    return {
        type: ACTION_TYPES.RESIZE_ITEM,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        selection: data.selection,
        origin: data.origin,
    };
};
export const resizeItems = (data) => {
    return {
        type: ACTION_TYPES.RESIZE_ITEMS,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        selection: data.selection,
        origin: data.origin,
    };
};
export const moveItem = (data) => {
    return {
        type: ACTION_TYPES.MOVE_ITEM,
        x: data.x,
        y: data.y,
        selection: data.selection,
    };
};
export const moveItems = (data) => {
    return {
        type: ACTION_TYPES.MOVE_ITEMS,
        x: data.x,
        y: data.y,
    };
};
export const selectItem = (item) => {
    return {
        type: ACTION_TYPES.SELECT_ITEM,
        item,
    };
};
export const selectItems = (items) => {
    return {
        type: ACTION_TYPES.SELECT_ITEMS,
        items,
    };
};
export const refreshCornersItem = () => {
    return {
        type: ACTION_TYPES.REFRESH_CORNERS_ITEM,
    };
};
export const refreshCornersItems = () => {
    return {
        type: ACTION_TYPES.REFRESH_CORNERS_ITEMS,
    };
};
export const refreshPathBoxItem = () => {
    return {
        type: ACTION_TYPES.REFRESH_PATH_BOX_ITEM,
    };
};
export const refreshPathBoxItems = () => {
    return {
        type: ACTION_TYPES.REFRESH_PATH_BOX_ITEMS,
    };
};
export const setCreatedItem = (item) => {
    return {
        type: ACTION_TYPES.SET_CREATED_ITEM,
        item,
    };
};
