import uuid from "react-uuid";
import SVGPathCommander from "svg-path-commander";
import {
    rotateBox,
    refreshCorners,
    convertToPath,
    refreshPathBox,
    getLengthForPoint,
    pointsToPath,
    splitCurveAt,
    pathToPoints,
} from "../../utils/helpers";
import * as ACTION_TYPES from "../actions/action_types";
export const initialState = {
    items: [
        {
            type: "rect",
            parent: "root",
            x: 300,
            y: 200,
            width: 200,
            height: 200,
            rotation: 0,
            id: uuid(),
            corners: {
                a: { x: 300, y: 200 },
                b: { x: 500, y: 400 },
                c: { x: 500, y: 200 },
                d: { x: 300, y: 200 },
            },
        },
        {
            type: "ellipse",
            parent: "root",
            x: 200,
            y: 400,
            width: 200,
            height: 200,
            rotation: 0,
            id: uuid(),
            corners: {
                a: { x: 300, y: 200 },
                b: { x: 500, y: 400 },
                c: { x: 500, y: 200 },
                d: { x: 300, y: 200 },
            },
        },
        {
            type: "path",
            parent: "root",
            x: 815.3501,
            y: 101.6701,
            width: 90,
            height: 242.5,
            rotation: 0,
            id: uuid(),
            d: "M 815.3501 101.6701 C 842.0167666666666 238.33676666666668 858.6834333333333 315.0034333333333 865.3501 331.6701 C 872.0167666666666 348.3367666666666 885.3501 348.3367666666666 905.3501 331.6701 C 860.3501 216.6701 843.4751 173.5451 815.3501 101.6701",
            corners: {
                a: { x: 500, y: 200 },
                b: { x: 573.12, y: 200 },
                c: { x: 573.12, y: 256.65 },
                d: { x: 500, y: 256.65 },
            },
        },
    ],
    selectedItem: undefined,
    selectedItems: undefined,
    selectedPathPoint: undefined,
    selectedBezierPoint: undefined,
    newPathPoint: undefined,
    createdItem: undefined,
};
export const ItemsReducer = (state = initialState, action) => {
    let newSelectedItem,
        newSelectedItems,
        pathNode,
        newPath,
        newPoints,
        newPoint,
        newSelectedPathPoint,
        newSelectedItemsIds,
        points;
    switch (action.type) {
        case ACTION_TYPES.MOVE_ITEM:
            newSelectedItem = {
                ...state.selectedItem,
                x: action.selection.x + action.x,
                y: action.selection.y + action.y,
            };
            switch (newSelectedItem.type) {
                case "path":
                    let newPath = new SVGPathCommander(newSelectedItem.d)
                        .transform({
                            translate: [
                                action.selection.x -
                                    state.selectedItem.x +
                                    action.x,
                                action.selection.y -
                                    state.selectedItem.y +
                                    action.y,
                            ],
                        })
                        .toString();
                    newSelectedItem.d = newPath;
                    break;
                default:
                    break;
            }
            return {
                ...state,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.MOVE_ITEMS:
            newSelectedItems = state.selectedItems.map((item) => {
                let newItem = { ...item };
                switch (item.type) {
                    case "path":
                        let newPath = new SVGPathCommander(item.d)
                            .transform({ translate: [action.x, action.y] })
                            .toString();
                        newItem.d = newPath;
                        break;
                    default:
                        break;
                }
                return {
                    ...newItem,
                    x: item.x + action.x,
                    y: item.y + action.y,
                };
            });
            newSelectedItemsIds = newSelectedItems.map((item) => item.id);
            return {
                ...state,
                selectedItems: newSelectedItems,
                items: [
                    ...state.items.filter(
                        (item) => !newSelectedItemsIds.includes(item.id)
                    ),
                    ...newSelectedItems,
                ],
            };
        case ACTION_TYPES.SELECT_ITEM:
            return {
                ...state,
                selectedItem: action.item,
            };
        case ACTION_TYPES.SELECT_ITEMS:
            return {
                ...state,
                selectedItems: action.items,
            };
        case ACTION_TYPES.RESIZE_ITEM:
            newSelectedItem = {
                ...state.selectedItem,
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height,
            };
            switch (state.selectedItem.type) {
                case "path":
                    let rotationOrigin = [
                        state.selectedItem.x + state.selectedItem.width / 2,
                        state.selectedItem.y + state.selectedItem.height / 2,
                    ];
                    newPath = new SVGPathCommander(newSelectedItem.d)
                        .transform({
                            rotate: -newSelectedItem.rotation,
                            origin: rotationOrigin,
                        })
                        .transform({
                            scale: [
                                action.width / state.selectedItem.width,
                                action.height / state.selectedItem.height,
                            ],
                            origin: action.origin,
                        })
                        .transform({
                            rotate: newSelectedItem.rotation,
                            origin: rotationOrigin,
                        })
                        .toString();
                    newSelectedItem.d = newPath;
                    break;
                default:
                    break;
            }
            return {
                ...state,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.RESIZE_ITEMS:
            const resizePath = (item) =>
                new SVGPathCommander(item.d)
                    .transform({
                        scale: [
                            action.width / action.selection.width,
                            action.height / action.selection.height,
                        ],
                        origin: action.origin,
                    })
                    .toString();
            newSelectedItems = state.selectedItems.map((item) => {
                let newItem = {
                    ...item,
                    width: item.width * (action.width / action.selection.width),
                    height:
                        item.height * (action.height / action.selection.height),
                    x:
                        (item.x - 2 * action.selection.x + action.x) *
                            (action.width / action.selection.width) +
                        action.selection.x,
                    y:
                        (item.y - 2 * action.selection.y + action.y) *
                            (action.height / action.selection.height) +
                        action.selection.y,
                };
                switch (newItem.type) {
                    case "path":
                        newItem.d = resizePath(newItem);
                        break;
                    case "ellipse":
                    case "rect":
                        if (item.rotation % 90 > 0) {
                            newItem = convertToPath(newItem);
                            newItem.d = resizePath(newItem);
                        }
                        break;
                    default:
                        break;
                }
                return newItem;
            });
            newSelectedItemsIds = newSelectedItems.map((item) => item.id);
            return {
                ...state,
                selectedItems: newSelectedItems,
                items: [
                    ...state.items.filter(
                        (item) => !newSelectedItemsIds.includes(item.id)
                    ),
                    ...newSelectedItems,
                ],
            };
        case ACTION_TYPES.ROTATE_ITEM:
            let rotatedItem = {
                ...state.selectedItem,
                rotation: action.rotation,
            };
            switch (state.selectedItem.type) {
                case "path":
                    let itemCenter = {
                        x: state.selectedItem.x + state.selectedItem.width / 2,
                        y: state.selectedItem.y + state.selectedItem.height / 2,
                    };
                    let newPath = new SVGPathCommander(state.selectedItem.d)
                        .transform({
                            rotate: [
                                action.rotation - state.selectedItem.rotation,
                            ],
                            origin: [itemCenter.x, itemCenter.y],
                        })
                        .toString();
                    rotatedItem.d = newPath;
                    break;
                default:
                    break;
            }
            return {
                ...state,
                selectedItem: rotatedItem,
                items: state.items.map((item) =>
                    item.id === rotatedItem.id ? rotatedItem : item
                ),
            };
        case ACTION_TYPES.ROTATE_ITEMS:
            let origin = {
                x: action.selection.x + action.selection.width / 2,
                y: action.selection.y + action.selection.height / 2,
            };
            newSelectedItems = state.selectedItems.map((item) => {
                let newItem = rotateBox(
                    item,
                    action.rotation,
                    action.selection.rotation,
                    origin
                );
                switch (newItem.type) {
                    case "path":
                        let newPath = new SVGPathCommander(newItem.d)
                            .transform({
                                rotate: [
                                    action.rotation - action.selection.rotation,
                                ],
                                origin: [origin.x, origin.y],
                            })
                            .toString();
                        newItem.d = newPath;
                        break;
                    default:
                        break;
                }
                return newItem;
            });
            newSelectedItemsIds = newSelectedItems.map((item) => item.id);
            return {
                ...state,
                selectedItems: newSelectedItems,
                items: [
                    ...state.items.filter(
                        (item) => !newSelectedItemsIds.includes(item.id)
                    ),
                    ...newSelectedItems,
                ],
            };
        case ACTION_TYPES.REFRESH_CORNERS_ITEM:
            newSelectedItem = refreshCorners(state.selectedItem);
            return {
                ...state,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.REFRESH_CORNERS_ITEMS:
            newSelectedItems = state.selectedItems.map((item) =>
                refreshCorners(item)
            );
            newSelectedItemsIds = newSelectedItems.map((item) => item.id);
            return {
                ...state,
                selectedItems: newSelectedItems,
                items: [
                    ...state.items.filter(
                        (item) => !newSelectedItemsIds.includes(item.id)
                    ),
                    ...newSelectedItems,
                ],
            };
        case ACTION_TYPES.REFRESH_PATH_BOX_ITEM:
            if (state.selectedItem.type === "path") {
                newSelectedItem = refreshPathBox(state.selectedItem);
                return {
                    ...state,
                    selectedItem: newSelectedItem,
                    items: state.items.map((item) =>
                        item.id === newSelectedItem.id ? newSelectedItem : item
                    ),
                };
            } else {
                return state;
            }
        case ACTION_TYPES.REFRESH_PATH_BOX_ITEMS:
            newSelectedItems = state.selectedItems
                .filter((item) => item.type === "path")
                .map((item) => refreshPathBox(item));
            newSelectedItemsIds = newSelectedItems.map((item) => item.id);
            return {
                ...state,
                selectedItems: newSelectedItems,
                items: [
                    ...state.items.filter(
                        (item) => !newSelectedItemsIds.includes(item.id)
                    ),
                    ...newSelectedItems,
                ],
            };
        case ACTION_TYPES.SELECT_PATH_POINT:
            return { ...state, selectedPathPoint: action.point };
        case ACTION_TYPES.SELECT_BEZIER_POINT:
            return { ...state, selectedBezierPoint: action.point };
        case ACTION_TYPES.SHOW_NEW_PATH_POINT:
            return {
                ...state,
                newPathPoint: action.point,
            };
        case ACTION_TYPES.CREATE_PATH_POINT:
            let handle = { ...action.point };
            pathNode = document.getElementById(state.selectedItem.id);
            handle.length = getLengthForPoint(state.newPathPoint, pathNode);
            handle.id = uuid();
            newPoints = [...state.selectedItem.points, handle].sort(
                (a, b) => a.length - b.length
            );
            let handleIndex = newPoints
                .map((point) => point.id)
                .indexOf(handle.id);
            let pointBefore =
                handleIndex === 0
                    ? newPoints[newPoints.length - 1]
                    : newPoints[handleIndex - 1];
            let pointAfter =
                handleIndex === newPoints.length - 1
                    ? newPoints[0]
                    : newPoints[handleIndex + 1];
            let ratio =
                Math.abs(handle.length - pointBefore.length) /
                Math.abs(pointAfter.length - pointBefore.length);
            let newPaths = splitCurveAt(
                ratio,
                pointBefore.coord.x,
                pointBefore.coord.y,
                pointBefore.startHandle.x,
                pointBefore.startHandle.y,
                pointAfter.endHandle.x,
                pointAfter.endHandle.y,
                pointAfter.coord.x,
                pointAfter.coord.y
            );
            pointBefore.startHandle.x = newPaths[2];
            pointBefore.startHandle.y = newPaths[3];
            handle.endHandle.x = newPaths[4];
            handle.endHandle.y = newPaths[5];
            handle.startHandle.x = newPaths[8];
            handle.startHandle.y = newPaths[9];
            pointAfter.endHandle.x = newPaths[10];
            pointAfter.endHandle.y = newPaths[11];
            let updatedPoints = newPoints.map((point) => {
                switch (point.id) {
                    case pointBefore.id:
                        return pointBefore;
                    case pointAfter.id:
                        return pointAfter;
                    case handle.id:
                        return handle;
                    default:
                        return point;
                }
            });
            newSelectedItem = {
                ...state.selectedItem,
                points: updatedPoints,
                d: pointsToPath(updatedPoints),
            };
            return {
                ...state,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.UPDATE_PATH_EDITOR_POINTS:
            pathNode = document.getElementById(state.selectedItem.id);
            newPoints = state.selectedItem.points.map((point) => ({
                ...point,
                length: getLengthForPoint(point.coord, pathNode),
            }));
            newSelectedItem = { ...state.selectedItem, points: newPoints };
            return {
                ...state,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.MOVE_PATH_POINT:
            newSelectedPathPoint = {
                ...state.selectedPathPoint,
                coord: {
                    x: state.selectedPathPoint.coord.x + action.x,
                    y: state.selectedPathPoint.coord.y + action.y,
                },
                startHandle: {
                    ...state.selectedPathPoint.startHandle,
                    x: state.selectedPathPoint.startHandle.x + action.x,
                    y: state.selectedPathPoint.startHandle.y + action.y,
                },
                endHandle: {
                    ...state.selectedPathPoint.endHandle,
                    x: state.selectedPathPoint.endHandle.x + action.x,
                    y: state.selectedPathPoint.endHandle.y + action.y,
                },
            };
            newPoints = state.selectedItem.points.map((point) =>
                point.id === state.selectedPathPoint.id
                    ? newSelectedPathPoint
                    : point
            );
            newSelectedItem = {
                ...state.selectedItem,
                points: newPoints,
                d: pointsToPath(newPoints),
            };
            return {
                ...state,
                selectedItem: newSelectedItem,
                selectedPathPoint: newSelectedPathPoint,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.MOVE_BEZIER_POINT:
            let isOptionDown = false;
            if (!isOptionDown) {
                if (state.selectedBezierPoint === "start") {
                    newSelectedPathPoint = {
                        ...state.selectedPathPoint,
                        startHandle: {
                            ...state.selectedPathPoint.startHandle,
                            x: state.selectedPathPoint.startHandle.x + action.x,
                            y: state.selectedPathPoint.startHandle.y + action.y,
                        },
                        endHandle: {
                            ...state.selectedPathPoint.endHandle,
                            x:
                                2 * state.selectedPathPoint.coord.x -
                                (state.selectedPathPoint.startHandle.x +
                                    action.x),
                            y:
                                2 * state.selectedPathPoint.coord.y -
                                (state.selectedPathPoint.startHandle.y +
                                    action.y),
                        },
                    };
                } else {
                    newSelectedPathPoint = {
                        ...state.selectedPathPoint,
                        startHandle: {
                            ...state.selectedPathPoint.startHandle,
                            x:
                                2 * state.selectedPathPoint.coord.x -
                                (state.selectedPathPoint.endHandle.x +
                                    action.x),
                            y:
                                2 * state.selectedPathPoint.coord.y -
                                (state.selectedPathPoint.endHandle.y +
                                    action.y),
                        },
                        endHandle: {
                            ...state.selectedPathPoint.endHandle,
                            x: state.selectedPathPoint.endHandle.x + action.x,
                            y: state.selectedPathPoint.endHandle.y + action.y,
                        },
                    };
                }
            } else {
                if (state.selectedBezierPoint === "start") {
                    newSelectedPathPoint = {
                        ...state.selectedPathPoint,
                        startHandle: {
                            ...state.selectedPathPoint.startHandle,
                            x: state.selectedPathPoint.startHandle.x + action.x,
                            y: state.selectedPathPoint.startHandle.y + action.y,
                        },
                    };
                } else {
                    newSelectedPathPoint = {
                        ...state.electedPathPoint,
                        endHandle: {
                            ...state.selectedPathPoint.endHandle,
                            x: state.selectedPathPoint.endHandle.x + action.x,
                            y: state.selectedPathPoint.endHandle.y + action.y,
                        },
                    };
                }
            }
            newPoints = state.selectedItem.points.map((point) =>
                point.id === state.selectedPathPoint.id
                    ? newSelectedPathPoint
                    : point
            );
            newSelectedItem = {
                ...state.selectedItem,
                points: newPoints,
                d: pointsToPath(newPoints),
            };
            return {
                ...state,
                selectedItem: newSelectedItem,
                selectedPathPoint: newSelectedPathPoint,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.TOGGLE_BEZIER_POINT:
            newPoint = { ...action.point };
            if (newPoint.startHandle.enabled || newPoint.endHandle.enabled) {
                newPoint = {
                    ...newPoint,
                    simetric: true,
                    startHandle: {
                        x: newPoint.coord.x,
                        y: newPoint.coord.y,
                        enabled: false,
                    },
                    endHandle: {
                        x: newPoint.coord.x,
                        y: newPoint.coord.y,
                        enabled: false,
                    },
                };
            } else {
                newPoint = {
                    ...newPoint,
                    simetric: true,
                    startHandle: {
                        x: newPoint.coord.x + 20,
                        y: newPoint.coord.y,
                        enabled: true,
                    },
                    endHandle: {
                        x: newPoint.coord.x - 20,
                        y: newPoint.coord.y,
                        enabled: true,
                    },
                };
            }
            newPoints = state.selectedItem.points.map((point) =>
                point.id === newPoint.id ? newPoint : point
            );
            newSelectedItem = {
                ...state.selectedItem,
                points: newPoints,
                d: pointsToPath(newPoints),
            };
            return {
                ...state,
                selectPathPoint: newPoint,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.OPEN_PATH_EDITOR:
            newSelectedItem = { ...state.selectedItem };
            if (!newSelectedItem.d) {
                newSelectedItem = convertToPath(newSelectedItem);
            }
            if (newSelectedItem.points) {
                points = newSelectedItem.points;
                newPoints = pathToPoints(newSelectedItem.d, newSelectedItem.id);
                newPoints.map((point, i) => ({
                    ...point,
                    id: points[i].id,
                    simetric: points[i].simetric,
                    startHandle: {
                        ...point.startHandle,
                        enabled: points[i].startHandle.enabled,
                    },
                    endHandle: {
                        ...point.endHandle,
                        enabled: points[i].endHandle.enabled,
                    },
                }));
                newSelectedItem.points = newPoints;
            }
            if (!newSelectedItem.points) {
                newSelectedItem.points = pathToPoints(
                    newSelectedItem.d,
                    newSelectedItem.id
                );
            }
            return {
                ...state,
                selectedItem: newSelectedItem,
                items: state.items.map((item) =>
                    item.id === newSelectedItem.id ? newSelectedItem : item
                ),
            };
        case ACTION_TYPES.SET_CREATED_ITEM:
            return {
                ...state,
                createdItem: action.item,
            };
        default:
            return state;
    }
};
