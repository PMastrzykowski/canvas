import { createRef } from "react";
import { ResizeHandle } from "./handles/ResizeHandle";
import { RotateHandle } from "./handles/RotateHandle";
export const Selection = (props) => {
    let {
        selection,
        pathEditing,
        resizing,
        rotating,
        moving,
        selectedItem,
        selectedItems,
        selectedGroup,
        selectedGroups,
        multiselect,
        setRotating,
        setResizing,
        rotateItem,
        rotateItems,
        rotateGroup,
        rotateGroups,
        rotateSelection,
        refreshCornersItem,
        refreshCornersItems,
        refreshCornersGroup,
        refreshCornersGroups,
        setSelection,
        resizeItem,
        resizeItems,
        resizeGroup,
        resizeGroups,
        refreshPathBoxItem,
        refreshPathBoxItems,
    } = props;

    if (selection && !pathEditing) {
        let item = selection;
        let rotateHandles = [
            {
                id: "nw",
                x: item.x - 12,
                y: item.y - 12,
            },
            {
                id: "ne",
                x: item.x + item.width,
                y: item.y - 12,
            },
            {
                id: "se",
                x: item.x + item.width,
                y: item.y + item.height,
            },
            {
                id: "sw",
                x: item.x - 12,
                y: item.y + item.height,
            },
        ];
        let resizeHandles = [
            {
                id: "nw",
                x: item.x,
                y: item.y,
            },
            {
                id: "n",
                x: item.x + item.width / 2,
                y: item.y,
            },
            {
                id: "ne",
                x: item.x + item.width,
                y: item.y,
            },
            {
                id: "e",
                x: item.x + item.width,
                y: item.y + item.height / 2,
            },
            {
                id: "se",
                x: item.x + item.width,
                y: item.y + item.height,
            },
            {
                id: "s",
                x: item.x + item.width / 2,
                y: item.y + item.height,
            },
            {
                id: "sw",
                x: item.x,
                y: item.y + item.height,
            },
            {
                id: "w",
                x: item.x,
                y: item.y + item.height / 2,
            },
        ];
        const cursorSelector = (side) => {
            switch (side) {
                case "nw":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "nw";
                        case item.rotation < 67.5:
                            return "n";
                        case item.rotation < 112.5:
                            return "ne";
                        case item.rotation < 157.5:
                            return "e";
                        case item.rotation < 202.5:
                            return "se";
                        case item.rotation < 247.5:
                            return "s";
                        case item.rotation < 292.5:
                            return "sw";
                        case item.rotation < 327.5:
                            return "w";
                        default:
                            return "nw";
                    }
                case "n":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "n";
                        case item.rotation < 67.5:
                            return "ne";
                        case item.rotation < 112.5:
                            return "e";
                        case item.rotation < 157.5:
                            return "se";
                        case item.rotation < 202.5:
                            return "s";
                        case item.rotation < 247.5:
                            return "sw";
                        case item.rotation < 292.5:
                            return "w";
                        case item.rotation < 327.5:
                            return "nw";
                        default:
                            return "n";
                    }
                case "ne":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "ne";
                        case item.rotation < 67.5:
                            return "e";
                        case item.rotation < 112.5:
                            return "se";
                        case item.rotation < 157.5:
                            return "s";
                        case item.rotation < 202.5:
                            return "sw";
                        case item.rotation < 247.5:
                            return "w";
                        case item.rotation < 292.5:
                            return "nw";
                        case item.rotation < 327.5:
                            return "n";
                        default:
                            return "ne";
                    }
                case "e":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "e";
                        case item.rotation < 67.5:
                            return "se";
                        case item.rotation < 112.5:
                            return "s";
                        case item.rotation < 157.5:
                            return "sw";
                        case item.rotation < 202.5:
                            return "w";
                        case item.rotation < 247.5:
                            return "nw";
                        case item.rotation < 292.5:
                            return "n";
                        case item.rotation < 327.5:
                            return "ne";
                        default:
                            return "e";
                    }
                case "se":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "se";
                        case item.rotation < 67.5:
                            return "s";
                        case item.rotation < 112.5:
                            return "sw";
                        case item.rotation < 157.5:
                            return "w";
                        case item.rotation < 202.5:
                            return "nw";
                        case item.rotation < 247.5:
                            return "n";
                        case item.rotation < 292.5:
                            return "ne";
                        case item.rotation < 327.5:
                            return "s";
                        default:
                            return "se";
                    }
                case "s":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "s";
                        case item.rotation < 67.5:
                            return "sw";
                        case item.rotation < 112.5:
                            return "w";
                        case item.rotation < 157.5:
                            return "nw";
                        case item.rotation < 202.5:
                            return "n";
                        case item.rotation < 247.5:
                            return "ne";
                        case item.rotation < 292.5:
                            return "s";
                        case item.rotation < 327.5:
                            return "se";
                        default:
                            return "s";
                    }
                case "sw":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "sw";
                        case item.rotation < 67.5:
                            return "w";
                        case item.rotation < 112.5:
                            return "nw";
                        case item.rotation < 157.5:
                            return "n";
                        case item.rotation < 202.5:
                            return "ne";
                        case item.rotation < 247.5:
                            return "s";
                        case item.rotation < 292.5:
                            return "se";
                        case item.rotation < 327.5:
                            return "s";
                        default:
                            return "sw";
                    }
                case "w":
                    switch (true) {
                        case item.rotation < 22.5:
                            return "w";
                        case item.rotation < 67.5:
                            return "nw";
                        case item.rotation < 112.5:
                            return "n";
                        case item.rotation < 157.5:
                            return "ne";
                        case item.rotation < 202.5:
                            return "s";
                        case item.rotation < 247.5:
                            return "se";
                        case item.rotation < 292.5:
                            return "s";
                        case item.rotation < 327.5:
                            return "sw";
                        default:
                            return "w";
                    }
                default:
                    return side;
            }
        };
        return (
            <g
                className={`selection
                ${resizing ? "resizing " : ""}
                ${rotating ? "rotating " : ""}
                ${moving ? "moving " : ""}
                `}
                style={{
                    transform: `rotate(${item.rotation}deg)`,
                    transformOrigin: `${item.x + item.width / 2}px ${
                        item.y + item.height / 2
                    }px`,
                }}
            >
                <rect
                    ref={selectedItems ? multiselect : null}
                    id={selectedItems ? "multiselect" : null}
                    type={selectedItems ? "multiselect" : "item"}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    className={`select-border`}
                />
                {rotateHandles.map((handle) => (
                    <RotateHandle
                        ref={createRef()}
                        key={handle.id}
                        cursor={cursorSelector(handle.id)}
                        handle={handle}
                        selection={selection}
                        setRotating={setRotating}
                        selectedItem={selectedItem}
                        selectedItems={selectedItems}
                        rotateItem={rotateItem}
                        rotateItems={rotateItems}
                        rotateGroup={rotateGroup}
                        rotateGroups={rotateGroups}
                        selectedGroup={selectedGroup}
                        selectedGroups={selectedGroups}
                        rotateSelection={rotateSelection}
                        refreshCornersItem={refreshCornersItem}
                        refreshCornersItems={refreshCornersItems}
                        refreshCornersGroup={refreshCornersGroup}
                        refreshCornersGroups={refreshCornersGroups}
                    />
                ))}
                {resizeHandles.map((handle) => (
                    <ResizeHandle
                        ref={createRef()}
                        key={handle.id}
                        cursor={cursorSelector(handle.id)}
                        handle={handle}
                        selection={selection}
                        setRotating={setResizing}
                        selectedItem={selectedItem}
                        selectedItems={selectedItems}
                        resizing={resizing}
                        setResizing={setResizing}
                        setSelection={setSelection}
                        resizeItem={resizeItem}
                        resizeItems={resizeItems}
                        resizeGroup={resizeGroup}
                        resizeGroups={resizeGroups}
                        refreshCornersItem={refreshCornersItem}
                        refreshCornersItems={refreshCornersItems}
                        refreshCornersGroup={refreshCornersGroup}
                        refreshCornersGroups={refreshCornersGroups}
                        refreshPathBoxItem={refreshPathBoxItem}
                        refreshPathBoxItems={refreshPathBoxItems}
                    />
                ))}
            </g>
        );
    }
};
