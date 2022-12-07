import { forwardRef, createRef } from "react";
import useDrag from "../../../utils/useDrag";
import { BezierHandle } from "./BezierHandle";
export const PathPointHandle = forwardRef((props, ref) => {
    let {
        handle,
        onDrag,
        onPointerDown,
        onPointerUp,
        selected,
        moveBezierStart,
        moveBezierDrag,
        moveBezierStop,
        className,
        onDoubleClick,
    } = props;
    useDrag(ref, {
        onDrag,
        onPointerDown,
        onPointerUp,
    });
    return (
        <>
            {handle.startHandle.enabled && selected && (
                <BezierHandle
                    ref={createRef()}
                    coord={handle.coord}
                    key={`start-${handle.id}`}
                    handle={handle.startHandle}
                    onPointerDown={(e) => moveBezierStart(e, "start")}
                    onDrag={moveBezierDrag}
                    onPointerUp={moveBezierStop}
                    selected={false}
                />
            )}
            {handle.endHandle.enabled && selected && (
                <BezierHandle
                    ref={createRef()}
                    coord={handle.coord}
                    key={`end-${handle.id}`}
                    handle={handle.endHandle}
                    onPointerDown={(e) => moveBezierStart(e, "end")}
                    onDrag={moveBezierDrag}
                    onPointerUp={moveBezierStop}
                    selected={false}
                />
            )}
            <circle
                side={handle.id}
                cx={handle.coord.x}
                cy={handle.coord.y}
                r={4}
                ref={ref}
                onDoubleClick={onDoubleClick}
                className={`path-point-handle ${
                    selected ? "selected" : ""
                } ${className}`}
            />
        </>
    );
});
