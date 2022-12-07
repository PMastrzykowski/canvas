import { useState, useRef, useEffect, useReducer } from "react";
import * as ItemsActions from "./store/actions/items";
import * as PathEditorActions from "./store/actions/pathEditor";
import * as GroupsActions from "./store/actions/groups";
import * as SelectionActions from "./store/actions/selection";
import * as ItemsReducer from "./store/reducers/items";
import * as GroupsReducer from "./store/reducers/groups";
import * as SelectionReducer from "./store/reducers/selection";

import { findRotatedBox, closestPoint } from "./utils/helpers";
import { Selection } from "./components/selection/Selection";
import { Items } from "./components/items/Items";
import { PathEditor } from "./components/pathEditor/PathEditor";
import { ItemCreator } from "./components/itemCreator/ItemCreator";

const App = () => {
    const canvasNode = useRef();
    const [outlines, setOutlines] = useState();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [rotating, setRotating] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [moving, setMoving] = useState(false);
    const [pointMoving, setPointMoving] = useState(false);
    const [pathEditing, setPathEditing] = useState(false);
    const [stateItemsReducer, dispatchItemsReducer] = useReducer(
        ItemsReducer.ItemsReducer,
        ItemsReducer.initialState
    );
    const [stateGroupsReducer, dispatchGroupsReducer] = useReducer(
        GroupsReducer.GroupsReducer,
        GroupsReducer.initialState
    );
    const [stateSelectionReducer, dispatchSelectionReducer] = useReducer(
        SelectionReducer.SelectionReducer
    );
    useEffect(() => {
        if (pathEditing && !pointMoving) {
            let path = document.getElementById(
                stateItemsReducer.selectedItem.id
            );
            let newPoint = closestPoint(path, mousePosition);
            if (newPoint || (!newPoint && stateItemsReducer.newPathPoint)) {
                dispatchItemsReducer(
                    PathEditorActions.showNewPathPoint(newPoint)
                );
            }
        }
        return () => {};
    }, [mousePosition, pathEditing, pointMoving]);
    useEffect(() => {
        if (pathEditing && !pointMoving) {
            const handler = (e) => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            };
            document.addEventListener("mousemove", handler);
            return () => {
                document.removeEventListener("mousemove", handler);
            };
        }
        return () => {};
    }, [pathEditing, pointMoving]);
    const multiselect = useRef();
    const selectMultiselection = (allItems) => {
        let { top, bottom, left, right } = findRotatedBox(allItems, 0);
        dispatchSelectionReducer(
            SelectionActions.setSelection({
                x: left,
                y: top,
                width: right - left,
                height: bottom - top,
                rotation: 0,
            })
        );
    };
    const drawOutline = () => {
        if (
            // outlines &&
            // mouseOverElement === outlines[0].id &&
            // (!stateItemsReducer.selectedItem || stateItemsReducer.selectedItem.id !== outlines[0].id) &&
            outlines &&
            // (!stateItemsReducer.selectedItem || outlines.includes(stateItemsReducer.selectedItem.id)) &&
            !rotating &&
            !moving &&
            !resizing
        ) {
            const renderOutline = (item, primary = false) => {
                switch (item.type) {
                    case "path":
                        return (
                            <path
                                d={item.d}
                                key={item.id}
                                className={`outline ${primary ? "primary" : ""}
                        `}
                            />
                        );
                    case "rect":
                    case "group":
                        return (
                            <rect
                                key={item.id}
                                x={item.x}
                                y={item.y}
                                width={item.width}
                                height={item.height}
                                className={`outline ${primary ? "primary" : ""}
                        `}
                                style={{
                                    transform: `rotate(${item.rotation}deg)`,
                                    transformOrigin: `${
                                        item.x + item.width / 2
                                    }px ${item.y + item.height / 2}px`,
                                }}
                            />
                        );
                    default:
                        return null;
                }
            };
            if (outlines.length > 1) {
                let newOutlines = [
                    outlines[outlines.length - 2],
                    outlines[outlines.length - 1],
                ];
                return (
                    <>
                        {stateGroupsReducer.groups.map((group) =>
                            newOutlines.includes(group.id)
                                ? renderOutline(group)
                                : null
                        )}
                        {stateItemsReducer.items.map((item) =>
                            newOutlines.includes(item.id)
                                ? renderOutline(item)
                                : null
                        )}
                    </>
                );
            } else {
                return stateItemsReducer.items.map((item) =>
                    outlines.includes(item.id) ? renderOutline(item) : null
                );
            }
        } else {
            return null;
        }
    };
    const group = () => {
        // let newGroup = {
        //     id: uuid(),
        //     parent: "root",
        //     type: "group",
        //     rotation: 0,
        // };
        // if (stateItemsReducer.selectedItem) {
        //     updateItem({
        //         ...stateItemsReducer.selectedItem,
        //         parent: newGroup.id,
        //     });
        //     if (stateItemsReducer.selectedItem.rotation % 90 === 0) {
        //         newGroup = {
        //             ...newGroup,
        //             x: stateSelectionReducer.x,
        //             y: stateSelectionReducer.y,
        //             width: stateSelectionReducer.width,
        //             height: stateSelectionReducer.height,
        //         };
        //     } else {
        //         newGroup = {
        //             ...newGroup,
        //             ...getBox(stateItemsReducer.selectedItem),
        //         };
        //     }
        // } else if (stateItemsReducer.selectedItems) {
        //     let newSelectedItems = stateItemsReducer.selectedItems.map((item) => ({
        //         ...item,
        //         parent: newGroup.id,
        //     }));
        //     newGroup = {
        //         ...newGroup,
        //         x: stateSelectionReducer.x,
        //         y: stateSelectionReducer.y,
        //         width: stateSelectionReducer.width,
        //         height: stateSelectionReducer.height,
        //     };
        //     updateItems(newSelectedItems);
        // }
        // if (stateGroupsReducer.selectedGroups) {
        //     let newGroups = stateGroupsReducer.selectedGroups.map((group) => ({
        //         ...group,
        //         parent: newGroup.id,
        //     }));
        //     updateGroups(newGroups);
        // }
        // setGroups([...groups, newGroup]);
        // dispatchGroupsReducer(GroupsActions.selectGroup(newGroup));
        // dispatchSelectionReducer(SelectionActions.setSelection(newGroup));
    };
    return (
        <div className="App">
            <svg id="svg" ref={canvasNode}>
                <defs>
                    <linearGradient
                        id="grad1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            style={{
                                stopColor: "rgb(255,255,0)",
                                stopOpacity: 1,
                            }}
                        />
                        <stop
                            offset="100%"
                            style={{
                                stopColor: "rgb(255,0,0)",
                                stopOpacity: 0,
                            }}
                        />
                    </linearGradient>
                </defs>
                <Items
                    selection={stateSelectionReducer}
                    multiselect={multiselect}
                    items={stateItemsReducer.items}
                    groups={stateGroupsReducer.groups}
                    moving={moving}
                    setMoving={setMoving}
                    rotating={rotating}
                    resizing={resizing}
                    pathEditing={pathEditing}
                    setPathEditing={setPathEditing}
                    setOutlines={setOutlines}
                    selectedItem={stateItemsReducer.selectedItem}
                    selectedItems={stateItemsReducer.selectedItems}
                    selectedGroup={stateGroupsReducer.selectedGroup}
                    selectedGroups={stateGroupsReducer.selectedGroups}
                    setSelection={(e) =>
                        dispatchSelectionReducer(
                            SelectionActions.setSelection(e)
                        )
                    }
                    moveItem={(e) =>
                        dispatchItemsReducer(ItemsActions.moveItem(e))
                    }
                    moveItems={(e) =>
                        dispatchItemsReducer(ItemsActions.moveItems(e))
                    }
                    moveGroup={(e) =>
                        dispatchGroupsReducer(GroupsActions.moveGroup(e))
                    }
                    moveGroups={(e) =>
                        dispatchGroupsReducer(GroupsActions.moveGroups(e))
                    }
                    refreshCornersItem={(e) =>
                        dispatchItemsReducer(ItemsActions.refreshCornersItem(e))
                    }
                    refreshCornersItems={(e) =>
                        dispatchItemsReducer(
                            ItemsActions.refreshCornersItems(e)
                        )
                    }
                    refreshCornersGroup={(e) =>
                        dispatchGroupsReducer(
                            GroupsActions.refreshCornersGroup(e)
                        )
                    }
                    refreshCornersGroups={(e) =>
                        dispatchGroupsReducer(
                            GroupsActions.refreshCornersGroups(e)
                        )
                    }
                    openPathEditor={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.openPathEditor(e)
                        )
                    }
                    selectItem={(e) =>
                        dispatchItemsReducer(ItemsActions.selectItem(e))
                    }
                    selectItems={(e) =>
                        dispatchItemsReducer(ItemsActions.selectItems(e))
                    }
                    selectGroup={(e) =>
                        dispatchGroupsReducer(GroupsActions.selectGroup(e))
                    }
                    selectGroups={(e) =>
                        dispatchGroupsReducer(GroupsActions.selectGroup(e))
                    }
                />
                <Selection
                    selection={stateSelectionReducer}
                    pathEditing={pathEditing}
                    resizing={resizing}
                    rotating={rotating}
                    moving={moving}
                    multiselect={multiselect}
                    selectedItem={stateItemsReducer.selectedItem}
                    selectedItems={stateItemsReducer.selectedItems}
                    selectedGroup={stateGroupsReducer.selectedGroup}
                    selectedGroups={stateGroupsReducer.selectedGroups}
                    setRotating={setRotating}
                    setResizing={setResizing}
                    rotateItem={(e) =>
                        dispatchItemsReducer(ItemsActions.rotateItem(e))
                    }
                    rotateItems={(e) =>
                        dispatchItemsReducer(ItemsActions.rotateItems(e))
                    }
                    resizeItem={(e) =>
                        dispatchItemsReducer(ItemsActions.resizeItem(e))
                    }
                    resizeItems={(e) =>
                        dispatchItemsReducer(ItemsActions.resizeItems(e))
                    }
                    rotateSelection={(e) =>
                        dispatchSelectionReducer(
                            SelectionActions.rotateSelection(e)
                        )
                    }
                    rotateGroup={(e) =>
                        dispatchGroupsReducer(GroupsActions.rotateGroup(e))
                    }
                    rotateGroups={(e) =>
                        dispatchGroupsReducer(GroupsActions.rotateGroups(e))
                    }
                    resizeGroup={(e) =>
                        dispatchGroupsReducer(GroupsActions.resizeGroup(e))
                    }
                    resizeGroups={(e) =>
                        dispatchGroupsReducer(GroupsActions.resizeGroups(e))
                    }
                    refreshCornersItem={(e) =>
                        dispatchItemsReducer(ItemsActions.refreshCornersItem(e))
                    }
                    refreshCornersItems={(e) =>
                        dispatchItemsReducer(
                            ItemsActions.refreshCornersItems(e)
                        )
                    }
                    refreshCornersGroup={(e) =>
                        dispatchGroupsReducer(
                            GroupsActions.refreshCornersGroup(e)
                        )
                    }
                    refreshCornersGroups={(e) =>
                        dispatchGroupsReducer(
                            GroupsActions.refreshCornersGroups(e)
                        )
                    }
                    setSelection={(e) =>
                        dispatchSelectionReducer(
                            SelectionActions.setSelection(e)
                        )
                    }
                    refreshPathBoxItem={(e) =>
                        dispatchItemsReducer(ItemsActions.refreshPathBoxItem(e))
                    }
                    refreshPathBoxItems={(e) =>
                        dispatchItemsReducer(
                            ItemsActions.refreshPathBoxItems(e)
                        )
                    }
                />
                {drawOutline()}
                <ItemCreator
                    createdItem={stateItemsReducer.createdItem}
                    multiselect={multiselect}
                    items={stateItemsReducer.items}
                    groups={stateGroupsReducer.groups}
                    pathEditing={pathEditing}
                    setPathEditing={setPathEditing}
                    setSelection={(e) =>
                        dispatchSelectionReducer(
                            SelectionActions.setSelection(e)
                        )
                    }
                    setCreatedItem={(e) =>
                        dispatchItemsReducer(ItemsActions.setCreatedItem(e))
                    }
                    selectPathPoint={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.selectPathPoint(e)
                        )
                    }
                    selectItem={(e) =>
                        dispatchItemsReducer(ItemsActions.selectItem(e))
                    }
                    selectItems={(e) =>
                        dispatchItemsReducer(ItemsActions.selectItems(e))
                    }
                    selectGroup={(e) =>
                        dispatchGroupsReducer(GroupsActions.selectGroup(e))
                    }
                    selectGroups={(e) =>
                        dispatchGroupsReducer(GroupsActions.selectGroup(e))
                    }
                    selectMultiselection={(e) => selectMultiselection(e)}
                    canvasNode={canvasNode}
                    refreshPathBoxItem={(e) =>
                        dispatchItemsReducer(ItemsActions.refreshPathBoxItem(e))
                    }
                />
                <PathEditor
                    selectPathPoint={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.selectPathPoint(e)
                        )
                    }
                    createPathPoint={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.createPathPoint(e)
                        )
                    }
                    selectBezierPoint={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.selectBezierPoint(e)
                        )
                    }
                    movePathPoint={(e) =>
                        dispatchItemsReducer(PathEditorActions.movePathPoint(e))
                    }
                    moveBezierPoint={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.moveBezierPoint(e)
                        )
                    }
                    toggleBezierPoint={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.toggleBezierPoint(e)
                        )
                    }
                    pathEditing={pathEditing}
                    setPathEditing={setPathEditing}
                    setPointMoving={setPointMoving}
                    selectedItem={stateItemsReducer.selectedItem}
                    selectedPathPoint={stateItemsReducer.selectedPathPoint}
                    selectedBezierPoint={stateItemsReducer.selectedBezierPoint}
                    newPathPoint={stateItemsReducer.newPathPoint}
                    updatePathEditorPoints={(e) =>
                        dispatchItemsReducer(
                            PathEditorActions.updatePathEditorPoints(e)
                        )
                    }
                />
                <text x="40" y="35">
                    {stateItemsReducer.selectedItem?.rotation}
                </text>
            </svg>
            <button
                onClick={() => group()}
                style={{ position: "absolute", top: 10, right: 10 }}
            >
                Group
            </button>
        </div>
    );
};

export default App;
