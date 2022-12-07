import { forwardRef } from "react";
import useDrag from "../../../utils/useDrag";
export const BezierHandle = forwardRef((props, ref) => {
    let { handle, coord, onDrag, onPointerDown, onPointerUp, selected } = props;
    useDrag(ref, {
        onDrag,
        onPointerDown,
        onPointerUp,
    });
    return (
        <>
            <line
                x1={handle.x}
                y1={handle.y}
                x2={coord.x}
                y2={coord.y}
                className={`bezier-handle-line`}
            />
            <circle
                cx={handle.x}
                cy={handle.y}
                r={3}
                ref={ref}
                className={`path-point-handle ${selected ? "selected" : ""}`}
            />
        </>
    );
});
