import { doPolygonsIntersect, findChildren } from "../../utils/helpers";
import useDrag from "../../utils/useDrag";
export const ItemCreator = (props) => {
    let {
        createdItem,
        items,
        groups,
        selectedItem,
        refreshPathBoxItem,
        setSelection,
        selectPathPoint,
        setPathEditing,
        pathEditing,
        selectItem,
        selectItems,
        selectGroup,
        selectGroups,
        selectMultiselection,
        setCreatedItem,
        canvasNode,
    } = props;

    const disablePathEditor = () => {
        setPathEditing(false);
        refreshPathBoxItem();
        setSelection(selectedItem);
        selectPathPoint();
    };
    const createStart = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        let whatToDraw;
        switch (true) {
            // case 79:
            //     whatToDraw = "elipse";
            //     break;
            // case 82:
            //     whatToDraw = "rect";
            //     break;
            // case 76:
            //     whatToDraw = "line";
            //     break;
            // case 65:
            //     whatToDraw = "artboard";
            //     break;
            case pathEditing:
                disablePathEditor();
                break;
            default:
                whatToDraw = "select";
                setSelection();
                selectItem();
                selectItems();
                selectGroup();
                selectGroups();
                break;
        }
        setCreatedItem({
            type: whatToDraw,
            start: {
                x: e.offsetX,
                y: e.offsetY,
            },
        });
    };
    const createDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        let initialMouseX = createdItem.start.x;
        let initialMouseY = createdItem.start.y;
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;
        let width = Math.abs(initialMouseX - mouseX);
        let height = Math.abs(initialMouseY - mouseY);
        let y, x, a, b, c, d;

        if (mouseX > initialMouseX) {
            x = initialMouseX;
        } else {
            x = mouseX;
        }
        if (mouseY > initialMouseY) {
            y = initialMouseY;
        } else {
            y = mouseY;
        }
        a = { x, y };
        b = { x: x + width, y };
        c = { x: x + width, y: y + height };
        d = { x, y: y + height };

        let groupsToSelect = groups.filter((group) => {
            if (
                group.parent === "root" &&
                doPolygonsIntersect(
                    [
                        group.corners.a,
                        group.corners.b,
                        group.corners.c,
                        group.corners.d,
                    ],
                    [a, b, c, d]
                )
            ) {
                return true;
            } else {
                return false;
            }
        });
        let itemsToSelect = items.filter((item) => {
            if (
                item.parent === "root" &&
                doPolygonsIntersect(
                    [
                        item.corners.a,
                        item.corners.b,
                        item.corners.c,
                        item.corners.d,
                    ],
                    [a, b, c, d]
                )
            ) {
                return true;
            } else {
                return false;
            }
        });
        let groupChildren = [];
        groupsToSelect.forEach((group) => {
            groupChildren = [...groupChildren, ...findChildren(group.id).items];
        });
        switch (true) {
            case itemsToSelect.length === 0 && groupsToSelect.length === 0:
                selectGroup();
                selectGroups();
                selectItem();
                selectItems();
                setSelection();
                break;
            case itemsToSelect.length === 1 && groupsToSelect.length === 0:
                selectGroup();
                selectGroups();
                selectItem(itemsToSelect[0]);
                selectItems();
                setSelection(itemsToSelect[0]);
                break;
            case itemsToSelect.length === 0 && groupsToSelect.length === 1:
                selectGroup(groupsToSelect[0]);
                selectGroups();
                selectItem();
                selectItems(groupChildren);
                setSelection(groupsToSelect[0]);
                break;
            case itemsToSelect.length > 1 && groupsToSelect.length === 0:
                selectGroup();
                selectGroups();
                selectItem();
                selectItems(itemsToSelect);
                selectMultiselection(itemsToSelect);
                break;
            case itemsToSelect.length === 0 && groupsToSelect.length > 1:
                selectGroup();
                selectGroups(groupsToSelect);
                selectItem();
                selectItems(groupChildren);
                selectMultiselection(groupsToSelect);
                break;
            default:
                selectGroup();
                selectGroups(groupsToSelect);
                selectItem();
                selectItems([...groupChildren, ...itemsToSelect]);
                setSelection();
                selectMultiselection([
                    ...groupChildren,
                    ...itemsToSelect,
                    ...groupsToSelect,
                ]);
                break;
        }
        setCreatedItem({
            ...createdItem,
            y,
            x,
            width,
            height,
        });
    };
    const createStop = () => {
        setCreatedItem();
    };
    useDrag(canvasNode, {
        onDrag: createDrag,
        onPointerDown: createStart,
        onPointerUp: createStop,
    });
    if (createdItem) {
        switch (createdItem.type) {
            case "select":
                return (
                    <rect
                        className={"create-item-selector"}
                        type={"select"}
                        id={"select"}
                        x={createdItem.x}
                        y={createdItem.y}
                        width={createdItem.width}
                        height={createdItem.height}
                    />
                );
            default:
                return "";
        }
    }
};
