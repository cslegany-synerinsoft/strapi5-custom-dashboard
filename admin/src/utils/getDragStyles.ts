import { CSSProperties } from "react";

const getDragStyles = (isDragging?: boolean, isOpacityEnabled?: boolean, style?: CSSProperties) => {
    const styles: CSSProperties = {
        opacity: isOpacityEnabled ? "0.4" : "1",
        cursor: isDragging ? "grabbing" : "grab",
        lineHeight: "0.5",
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        ...style
    };
    return styles;
}

export default getDragStyles;