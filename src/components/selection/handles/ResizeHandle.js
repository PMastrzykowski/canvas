import { forwardRef, useState } from "react";
import useDrag from "../../../utils/useDrag";
import { repositionRotatedBox } from "../../../utils/helpers";
export const ResizeHandle = forwardRef((props, ref) => {
    let {
        handle,
        cursor,
        resizing,
        setResizing,
        selectedItem,
        selectedItems,
        selection,
        setSelection,
        resizeItem,
        resizeItems,
        resizeGroup,
        resizeGroups,
        refreshCornersItem,
        refreshCornersItems,
        refreshCornersGroup,
        refreshCornersGroups,
    } = props;
    const [pos, setPos] = useState([]);
    const [mouseDownElement, setMouseDownElement] = useState();

    const resizeStart = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        // get the mouse cursor position at startup:
        let side = e.target.getAttribute("side");
        setMouseDownElement(side);
        setPos({ ...pos, pos3: e.clientX, pos4: e.clientY });
    };
    const resizeDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        if (!resizing) {
            setResizing(true);
        }
        // calculate the new cursor position:
        let { pos1, pos2, pos3, pos4 } = pos;
        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;
        setPos({ pos1, pos2, pos3, pos4 });
        if (selectedItem && selectedItem.rotation !== 0) {
            var hyp = Math.sqrt(pos2 * pos2 + pos1 * pos1);
            var angle = Math.atan2(pos2, pos1);
            let rotationInRadians = (Math.PI / 180) * selectedItem.rotation;
            var realangle = angle - rotationInRadians;
            pos1 = Math.cos(realangle) * hyp;
            pos2 = Math.sin(realangle) * hyp;
        }

        // set the element's new position:
        let width = selection.width;
        let height = selection.height;
        let y = selection.y;
        let x = selection.x;
        let staticCorner = "nw";
        let origin = [selection.x, selection.y];
        let flipX = false;
        let flipY = false;
        switch (mouseDownElement) {
            case "n":
                y += pos2;
                height -= pos2;
                staticCorner = "sw";
                origin = [x, y + height];
                if (height < 0) {
                    setMouseDownElement("s");
                    staticCorner = "ne";
                    origin = [selection.x, selection.y];
                    flipY = true;
                }
                break;
            case "ne":
                y += pos2;
                height -= pos2;
                width += pos1;
                staticCorner = "sw";
                origin = [selection.x, selection.y + selection.height];
                if (width < 0) {
                    setMouseDownElement("nw");
                    staticCorner = "se";
                    origin = [
                        selection.x + selection.width,
                        selection.y + selection.height,
                    ];
                    flipX = true;
                }
                if (height < 0) {
                    setMouseDownElement("se");
                    staticCorner = "nw";
                    origin = [selection.x, selection.y];
                    flipY = true;
                }
                break;
            case "nw":
                y += pos2;
                height -= pos2;
                x += pos1;
                width -= pos1;
                staticCorner = "se";
                origin = [
                    selection.x + selection.width,
                    selection.y + selection.height,
                ];
                if (width < 0) {
                    setMouseDownElement("ne");
                    staticCorner = "sw";
                    origin = [selection.x, selection.y + selection.height];
                    flipX = true;
                }
                if (height < 0) {
                    setMouseDownElement("sw");
                    staticCorner = "ne";
                    origin = [selection.x + selection.width, selection.y];
                    flipY = true;
                }
                break;
            case "e":
                width += pos1;
                if (width < 0) {
                    setMouseDownElement("w");
                    flipX = true;
                }
                break;
            case "s":
                height += pos2;
                if (height < 0) {
                    setMouseDownElement("n");
                    flipY = true;
                }
                break;
            case "se":
                height += pos2;
                width += pos1;
                staticCorner = "nw";
                origin = [selection.x, selection.y];
                if (width < 0) {
                    setMouseDownElement("sw");
                    staticCorner = "ne";
                    origin = [selection.x + selection.width, selection.y];
                    flipX = true;
                }
                if (height < 0) {
                    setMouseDownElement("ne");
                    staticCorner = "sw";
                    origin = [selection.x, selection.y + selection.height];
                    flipY = true;
                }
                break;
            case "sw":
                height += pos2;
                x += pos1;
                width -= pos1;
                staticCorner = "ne";
                origin = [selection.x + selection.width, selection.y];
                if (width < 0) {
                    setMouseDownElement("se");
                    staticCorner = "nw";
                    origin = [selection.x, selection.y];
                    flipX = true;
                }
                if (height < 0) {
                    setMouseDownElement("nw");
                    staticCorner = "se";
                    origin = [
                        selection.x + selection.width,
                        selection.y + selection.height,
                    ];
                    flipY = true;
                }
                break;
            case "w":
                x += pos1;
                width -= pos1;
                staticCorner = "ne";
                origin = [selection.x + selection.width, selection.y];
                if (width < 0) {
                    setMouseDownElement("e");
                    flipX = true;
                }
                break;
            default:
                break;
        }
        width = Math.abs(width);
        height = Math.abs(height);
        if (selectedItem) {
            let repositionedDims = repositionRotatedBox(
                {
                    x: selectedItem.x,
                    y: selectedItem.y,
                    h: selectedItem.height,
                    w: selectedItem.width,
                },
                {
                    x: x,
                    y: y,
                    h: height,
                    w: width,
                },
                selectedItem.rotation,
                staticCorner
            );
            y = repositionedDims.y;
            x = repositionedDims.x;

            let newSelectedItem = {
                ...selectedItem,
                width,
                height,
                x,
                y,
            };
            resizeItem({ width, height, x, y, selection, origin });
            setSelection(newSelectedItem);
        } else if (selectedItems) {
            resizeItems({ width, height, x, y, selection });
            setSelection({
                width,
                height,
                x,
                y,
            });
        }
    };
    const resizeStop = () => {
        setMouseDownElement();
        setResizing(false);
        if (selectedItem) {
            refreshCornersItem();
        } else if (selectedItems) {
            // return refreshCorners(refreshPathBox(item));
            refreshCornersItems();
            // if (selectedGroup) {
            //     let children = findChildren(selectedGroup.id, items, groups);
            //     let { x, y, width, height } = findRotatedBox(
            //         [...children.items, ...children.groups],
            //         selectedGroup.rotation
            //     );
            //     console.log({ x, y, width, height });
            //     updateGroup(
            //         refreshCorners({ ...selectedGroup, x, y, width, height })
            //     );
            // }
            // if (selectedGroups) {
            //     updateGroups(
            //         selectedGroups.map((group) => {
            //             let children = findChildren(group.id, items, groups);
            //             let { x, y, width, height } = findRotatedBox(
            //                 [...children.items, ...children.groups],
            //                 group.rotation
            //             );
            //             return refreshCorners({
            //                 ...group,
            //                 x,
            //                 y,
            //                 width,
            //                 height,
            //             });
            //         })
            //     );
            // }
        }
    };
    useDrag(ref, {
        onDrag: resizeDrag,
        onPointerDown: resizeStart,
        onPointerUp: resizeStop,
    });
    return (
        <circle
            side={handle.id}
            cx={handle.x}
            cy={handle.y}
            r={4}
            ref={ref}
            className={`resize-handle ${cursor}`}
        />
    );
});
