import { useState, useEffect } from "react";

const useDrag = (ref, options) => {
    const {
        onPointerDown = () => {},
        onPointerUp = () => {},
        onPointerMove = () => {},
        onDrag = () => {},
        onDbClick = () => {},
    } = options;

    const [isDragging, setIsDragging] = useState(false);

    const handleDbClick = (e) => {
        onDbClick(e);
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);

        onPointerDown(e);
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);

        onPointerUp(e);
    };

    const handlePointerMove = (e) => {
        onPointerMove(e);

        if (isDragging) {
            onDrag(e);
        }
    };

    useEffect(() => {
        const element = ref.current;
        if (element) {
            // element.addEventListener("dblclick", handleDbClick);
            element.addEventListener("pointerdown", handlePointerDown);
            if (isDragging) {
                document.addEventListener("pointerup", handlePointerUp);
                document.addEventListener("pointermove", handlePointerMove);
            }
            return () => {
                // element.removeEventListener("dblclick", handleDbClick);
                element.removeEventListener("pointerdown", handlePointerDown);
                document.removeEventListener("pointerup", handlePointerUp);
                document.removeEventListener("pointermove", handlePointerMove);
            };
        }

        return () => {};
    });

    return { isDragging };
};

export default useDrag;
