import { forwardRef, useState } from "react";
import useDrag from "../../../utils/useDrag";
import { rotatePoint } from "../../../utils/helpers";
export const RotateHandle = forwardRef((props, ref) => {
    let {
        handle,
        cursor,
        selection,
        setRotating,
        selectedItem,
        selectedItems,
        rotateItem,
        rotateItems,
        rotateGroup,
        rotateGroups,
        selectedGroup,
        selectedGroups,
        rotateSelection,
        refreshCornersItem,
        refreshCornersItems,
        refreshCornersGroup,
        refreshCornersGroups,
    } = props;
    const [pos, setPos] = useState([]);
    const [mouseDownElement, setMouseDownElement] = useState();
    const rotateStart = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        let side = e.target.getAttribute("side");
        setMouseDownElement(side);
        let itemCenter = {
            x: selection.x + selection.width / 2,
            y: selection.y + selection.height / 2,
        };
        let canvas = {
            scroll: {
                x: 0,
                y: 0,
            },
            leftPaneWidth: 0,
            headerHeight: 0,
        };
        // calculate the new cursor position:
        let rotation = Math.atan2(
            e.clientX - canvas.leftPaneWidth + canvas.scroll.x - itemCenter.x,
            e.clientY - canvas.headerHeight + canvas.scroll.y - itemCenter.y
        );
        let rotatedPoint;
        switch (side) {
            case "nw":
                rotatedPoint = rotatePoint(
                    selection,
                    itemCenter,
                    selection.rotation
                );
                break;
            case "ne":
                rotatedPoint = rotatePoint(
                    {
                        x: selection.x + selection.width,
                        y: selection.y,
                    },
                    itemCenter,
                    selection.rotation
                );
                break;
            case "se":
                rotatedPoint = rotatePoint(
                    {
                        x: selection.x + selection.width,
                        y: selection.y + selection.height,
                    },
                    itemCenter,
                    selection.rotation
                );
                break;
            case "sw":
                rotatedPoint = rotatePoint(
                    {
                        x: selection.x,
                        y: selection.y + selection.height,
                    },
                    itemCenter,
                    selection.rotation
                );
                break;
            default:
                break;
        }
        let rotation2 = Math.atan2(
            rotatedPoint.x -
                canvas.leftPaneWidth +
                canvas.scroll.x -
                itemCenter.x,
            rotatedPoint.y -
                canvas.headerHeight +
                canvas.scroll.y -
                itemCenter.y
        );
        rotation *= -180 / Math.PI;
        rotation2 *= -180 / Math.PI;
        setPos({
            ...pos,
            pos1: rotation - rotation2,
        });
        console.log({
            selectedItem,
            selectedItems,
            selectedGroup,
            selectedGroups,
        });
    };
    const rotateDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        setRotating(true);
        let itemCenter = {
            x: selection.x + selection.width / 2,
            y: selection.y + selection.height / 2,
        };
        let canvas = {
            scroll: {
                x: 0,
                y: 0,
            },
            leftPaneWidth: 0,
            headerHeight: 0,
        };
        // calculate the new cursor position:
        let radians = Math.atan2(
            e.clientX - canvas.leftPaneWidth + canvas.scroll.x - itemCenter.x,
            e.clientY - canvas.headerHeight + canvas.scroll.y - itemCenter.y
        );
        let rotation = radians;
        switch (mouseDownElement) {
            case "ne":
                rotation +=
                    Math.atan(selection.width / selection.height) + Math.PI;

                break;
            case "sw":
                rotation += Math.atan(selection.width / selection.height);
                break;
            case "nw":
                rotation +=
                    Math.atan(selection.height / selection.width) + Math.PI / 2;
                break;
            case "se":
                rotation -= Math.atan(selection.width / selection.height);
                break;
            default:
                break;
        }
        rotation *= -180 / Math.PI;
        rotation -= pos.pos1;
        rotation = (rotation + 360) % 360;
        rotation =
            Math.abs(rotation % 90) <= 1
                ? rotation - (rotation % 90)
                : rotation;
        if (selectedItem) {
            rotateItem(rotation);
        } else if (selectedItems) {
            rotateItems({ rotation, selection });
            if (selectedGroup) {
                rotateGroup({ rotation, selection });
            }
            if (selectedGroups) {
                rotateGroups({ rotation, selection });
            }
        }
        rotateSelection(rotation);
    };
    const rotateStop = () => {
        // stop moving when mouse button is released:
        setMouseDownElement();
        setRotating(false);
        if (selectedItem) {
            refreshCornersItem();
        } else if (selectedItems) {
            refreshCornersItems();
            if (selectedGroups) {
                refreshCornersGroups();
            }
            if (selectedGroup) {
                refreshCornersGroup();
            } else {
                // if (selectedGroups) {
                //     selectMultiselection([
                //         ...newSelectedItems,
                //         ...selectedGroups,
                //     ]);
                // } else {
                //     selectMultiselection(newSelectedItems);
                // }
            }
        }
    };
    useDrag(ref, {
        onDrag: rotateDrag,
        onPointerDown: rotateStart,
        onPointerUp: rotateStop,
    });
    return (
        <rect
            side={handle.id}
            x={handle.x}
            y={handle.y}
            width={12}
            height={12}
            ref={ref}
            className={`rotate-handle ${cursor}`}
        />
    );
});
