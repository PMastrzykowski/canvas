import { useState, createRef } from "react";
import { Item } from "./item/Item";
import { findChildren } from "../../utils/helpers";
import useDrag from "../../utils/useDrag";
export const Items = (props) => {
    const {
        items,
        groups,
        moving,
        setMoving,
        rotating,
        resizing,
        pathEditing,
        selectedItem,
        selectedItems,
        selectedGroup,
        selectedGroups,
        selectItem,
        selectItems,
        selectGroup,
        selectGroups,
        setSelection,
        moveItem,
        moveItems,
        moveGroup,
        moveGroups,
        selection,
        refreshCornersItem,
        refreshCornersItems,
        refreshCornersGroup,
        refreshCornersGroups,
        setPathEditing,
        openPathEditor,
        setOutlines,
        multiselect,
    } = props;
    const [pos, setPos] = useState([]);

    const moveStart = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        if (pathEditing) {
            return;
        }
        let id = e.target.getAttribute("id");
        let selection = items.filter((item) => item.id === id)[0];
        if (
            (!selectedItem && !selectedItems) ||
            (selectedItem && id !== selectedItem.id) ||
            (selectedItems &&
                !selectedItems.map((item) => item.id).includes(id))
        ) {
            // Nic nie jest zaznaczone. Zaznacz grupę z góry lub item.
            let newOutlines = [selection];
            let done = true;
            while (done) {
                let lastOutline = newOutlines[newOutlines.length - 1];
                if (
                    lastOutline.parent === "root" ||
                    (selectedItem && lastOutline.parent === selectedItem.id)
                ) {
                    done = false;
                } else {
                    let parent = groups.filter(
                        (group) => group.id === lastOutline.parent
                    )[0];
                    newOutlines.push(parent);
                }
            }
            if (newOutlines.length === 1) {
                selectItem(selection);
                selectItems();
                selectGroup();
                selectGroups();
                setSelection(selection);
            } else {
                let selectionGroup = newOutlines[newOutlines.length - 1];
                // find children
                let children = findChildren(selectionGroup.id, items, groups);
                selectGroup(selectionGroup);
                selectItems(children.items);
                selectGroups(children.groups);
                selectItem();
                setSelection(selectionGroup);
            }
        }
        // get the mouse cursor position at startup:
        setPos({ ...pos, pos3: e.clientX, pos4: e.clientY });
    };
    const moveDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        if (pathEditing) {
            return;
        }
        if (!moving) {
            setMoving(true);
        }
        // calculate the new cursor position:
        let { pos1, pos2, pos3, pos4 } = pos;
        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;
        setPos({ pos1, pos2, pos3, pos4 });
        // set the element's new position:
        if (selectedItem) {
            moveItem({ x: pos1, y: pos2, selection });
        } else if (selectedItems) {
            moveItems({ x: pos1, y: pos2 });
            if (selectedGroup) {
                moveGroup({ x: pos1, y: pos2 });
            }
            if (selectedGroups) {
                moveGroups({ x: pos1, y: pos2 });
            }
        }
        setSelection({
            ...selection,
            x: selection.x + pos1,
            y: selection.y + pos2,
        });
    };
    const moveStop = () => {
        if (pathEditing) {
            return;
        }
        setMoving(false);
        if (selectedItem) {
            refreshCornersItem();
        }
        if (selectedItems) {
            refreshCornersItems();
        }
        if (selectedGroup) {
            refreshCornersGroup();
        }
        if (selectedGroups) {
            refreshCornersGroups();
        }
        setOutlines();
    };
    const enablePathEditor = () => {
        openPathEditor();
        setPathEditing(true);
    };
    const handleItemEnter = (item) => {
        let outlines = [item];
        let done = true;
        while (done) {
            let lastOutline = outlines[outlines.length - 1];
            if (
                lastOutline.parent === "root" ||
                (selectedItem && lastOutline.parent === selectedItem.id)
            ) {
                done = false;
            } else {
                let parent = groups.filter(
                    (group) => group.id === lastOutline.parent
                )[0];
                outlines.push(parent);
            }
        }
        setOutlines(outlines);
    };
    const handleItemLeave = () => {
        setOutlines();
    };
    useDrag(multiselect, {
        onDrag: moveDrag,
        onPointerDown: moveStart,
        onPointerUp: moveStop,
    });
    return items.map((item) => (
        <Item
            item={item}
            ref={createRef()}
            key={item.id}
            moving={moving}
            rotating={rotating}
            resizing={resizing}
            groups={groups}
            onDrag={moveDrag}
            onPointerDown={moveStart}
            onPointerUp={moveStop}
            onDoubleClick={enablePathEditor}
            onMouseEnter={() => handleItemEnter(item)}
            onMouseLeave={handleItemLeave}
        />
    ));
};
