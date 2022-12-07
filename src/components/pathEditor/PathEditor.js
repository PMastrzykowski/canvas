import { useState, createRef } from "react";
import { PathPointHandle } from "./handles/PathPointHandle";
export const PathEditor = (props) => {
    const {
        selectPathPoint,
        selectBezierPoint,
        pathEditing,
        createPathPoint,
        updatePathEditorPoints,
        setPointMoving,
        selectedItem,
        selectedPathPoint,
        moveBezierPoint,
        movePathPoint,
        newPathPoint,
        toggleBezierPoint,
    } = props;
    const [pos, setPos] = useState([]);
    const movePointStart = (e, point) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        selectPathPoint(point);
        // get the mouse cursor position at startup:
        setPos({ ...pos, pos3: e.clientX, pos4: e.clientY });
        setPointMoving(true);
    };
    const movePointDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        let { pos1, pos2, pos3, pos4 } = pos;
        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;
        setPos({ pos1, pos2, pos3, pos4 });
        movePathPoint({ x: pos1, y: pos2 });
    };
    const movePointStop = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        updatePathEditorPoints();
        setPointMoving(false);
    };
    const moveBezierStart = (e, point) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        setPointMoving(true);
        selectBezierPoint(point);
        // get the mouse cursor position at startup:
        setPos({ ...pos, pos3: e.clientX, pos4: e.clientY });
    };
    const moveBezierDrag = (e, point) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        let { pos1, pos2, pos3, pos4 } = pos;
        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;
        setPos({ pos1, pos2, pos3, pos4 });
        moveBezierPoint({ x: pos1, y: pos2 });
    };
    const moveBezierStop = (e) => {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        updatePathEditorPoints();
        setPointMoving(false);
    };
    const drawNewPoint = () => {
        if (pathEditing && newPathPoint) {
            let handle = {
                id: "new-path-point",
                simetric: false,
                coord: newPathPoint,
                endHandle: {
                    x: newPathPoint.x,
                    y: newPathPoint.y,
                    enabled: true,
                },
                startHandle: {
                    x: newPathPoint.x,
                    y: newPathPoint.y,
                    enabled: true,
                },
            };
            const handleNewPathPointMouseDown = (e) => {
                createPathPoint(handle);
                movePointStart(e, handle);
            };

            return (
                <PathPointHandle
                    ref={createRef()}
                    handle={handle}
                    onPointerDown={handleNewPathPointMouseDown}
                    onDrag={movePointDrag}
                    onPointerUp={movePointStop}
                    selected={
                        selectedPathPoint && handle.id === selectedPathPoint.id
                    }
                    moveBezierDrag={moveBezierDrag}
                    moveBezierStart={moveBezierStart}
                    moveBezierStop={moveBezierStop}
                    className={"new"}
                />
            );
        } else {
            return null;
        }
    };
    const handleDoubleClick = (e, point) => {
        toggleBezierPoint(point);
    };
    return (
        <>
            {drawNewPoint()}
            {pathEditing &&
                selectedItem.points.map((point) => (
                    <PathPointHandle
                        ref={createRef()}
                        key={point.id}
                        handle={point}
                        onPointerDown={(e) => movePointStart(e, point)}
                        onDrag={movePointDrag}
                        onPointerUp={movePointStop}
                        selected={
                            selectedPathPoint &&
                            point.id === selectedPathPoint.id
                        }
                        moveBezierDrag={moveBezierDrag}
                        moveBezierStart={moveBezierStart}
                        moveBezierStop={moveBezierStop}
                        onDoubleClick={(e) => {
                            handleDoubleClick(e, point);
                        }}
                        className={""}
                    />
                ))}
        </>
    );
};
