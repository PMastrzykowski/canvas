import uuid from "react-uuid";
import SVGPathCommander from "svg-path-commander";
import { rotateBox, refreshCorners } from "../../utils/helpers";
import * as ACTION_TYPES from "../actions/action_types";
export const initialState = {
    groups: [],
    selectedGroup: undefined,
    selectedGroups: undefined,
};
export const GroupsReducer = (state = initialState, action) => {
    let newSelectedGroupsIds, newSelectedGroup, newSelectedGroups, origin;
    switch (action.type) {
        case ACTION_TYPES.SELECT_GROUP:
            return {
                ...state,
                selectedGroup: action.group,
            };
        case ACTION_TYPES.SELECT_GROUPS:
            return {
                ...state,
                selectedGroups: action.groups,
            };
        case ACTION_TYPES.MOVE_GROUP:
            newSelectedGroup = {
                ...state.selectedGroup,
                x: state.selectedGroup.x + action.x,
                y: state.selectedGroup.y + action.y,
            };
            return {
                ...state,
                selectedGroup: newSelectedGroup,
                groups: state.groups.map((group) =>
                    group.id === newSelectedGroup.id ? newSelectedGroup : group
                ),
            };
        case ACTION_TYPES.MOVE_GROUPS:
            newSelectedGroups = state.selectedGroups.map((group) => ({
                ...group,
                x: group.x + action.x,
                y: group.y + action.y,
            }));
            newSelectedGroupsIds = newSelectedGroups.map((group) => group.id);
            return {
                ...state,
                selectedGroups: newSelectedGroups,
                groups: [
                    ...state.groups.filter(
                        (group) => !newSelectedGroupsIds.includes(group.id)
                    ),
                    ...newSelectedGroups,
                ],
            };
        case ACTION_TYPES.RESIZE_GROUP:
            let selectedItem = {
                ...state.selectedItem,
            };
            return {
                ...state,
                selectedItem,
            };
        case ACTION_TYPES.ROTATE_GROUP:
            origin = {
                x: action.selection.x + action.selection.width / 2,
                y: action.selection.y + action.selection.height / 2,
            };
            let rotatedGroup = rotateBox(
                state.selectedGroup,
                action.rotation,
                action.selection.rotation,
                origin
            );
            return {
                ...state,
                selectedGroups: rotatedGroup,
                groups: state.groups.map((group) =>
                    group.id === rotatedGroup.id ? rotatedGroup : group
                ),
            };
        case ACTION_TYPES.ROTATE_GROUPS:
            origin = {
                x: action.selection.x + action.selection.width / 2,
                y: action.selection.y + action.selection.height / 2,
            };
            newSelectedGroups = state.selectedGroups.map((group) =>
                rotateBox(
                    group,
                    action.rotation,
                    action.selection.rotation,
                    origin
                )
            );
            newSelectedGroupsIds = newSelectedGroups.map((group) => group.id);
            return {
                ...state,
                selectedGroups: newSelectedGroups,
                groups: [
                    ...state.groups.filter(
                        (group) => !newSelectedGroupsIds.includes(group.id)
                    ),
                    ...newSelectedGroups,
                ],
            };
        case ACTION_TYPES.REFRESH_CORNERS_GROUP:
            newSelectedGroup = refreshCorners(state.selectedGroup);
            return {
                ...state,
                selectedGroup: newSelectedGroup,
                groups: state.groups.map((group) =>
                    group.id === newSelectedGroup.id ? newSelectedGroup : group
                ),
            };
        case ACTION_TYPES.REFRESH_CORNERS_GROUPS:
            newSelectedGroups = state.selectedItems.map((group) =>
                refreshCorners(group)
            );
            newSelectedGroupsIds = newSelectedGroups.map((group) => group.id);
            return {
                ...state,
                selectedItems: newSelectedGroups,
                items: [
                    ...state.items.filter(
                        (group) => !newSelectedGroupsIds.includes(group.id)
                    ),
                    ...newSelectedGroups,
                ],
            };
        default:
            return state;
    }
};
