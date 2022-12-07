import { forwardRef } from "react";
import useDrag from "../../../utils/useDrag";
export const Item = forwardRef((props, ref) => {
    let {
        item,
        onDrag,
        onPointerDown,
        onPointerUp,
        onDoubleClick,
        onMouseEnter,
        onMouseLeave,
    } = props;
    useDrag(ref, {
        onDrag,
        onPointerDown,
        onPointerUp,
    });
    switch (item.type) {
        case "path":
            return (
                <path
                    id={item.id}
                    ref={ref}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    d={item.d}
                    onDoubleClick={() => {
                        onDoubleClick();
                    }}
                    style={{
                        fill: "url(#grad1)",
                    }}
                />
            );
        case "rect":
            return (
                <rect
                    id={item.id}
                    ref={ref}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={{
                        fill: "url(#grad1)",
                        transform: `rotate(${item.rotation}deg)`,
                        transformOrigin: `${item.x + item.width / 2}px ${
                            item.y + item.height / 2
                        }px`,
                    }}
                    onDoubleClick={() => {
                        onDoubleClick();
                    }}
                />
            );
        case "ellipse":
            return (
                <ellipse
                    id={item.id}
                    ref={ref}
                    rx={item.width / 2}
                    ry={item.height / 2}
                    cx={item.x + item.width / 2}
                    cy={item.y + item.height / 2}
                    width={item.width}
                    height={item.height}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={{
                        fill: "url(#grad1)",
                        transform: `rotate(${item.rotation}deg)`,
                        transformOrigin: `${item.x + item.width / 2}px ${
                            item.y + item.height / 2
                        }px`,
                    }}
                    onDoubleClick={() => {
                        onDoubleClick();
                    }}
                />
            );
        default:
            return "";
    }
});
