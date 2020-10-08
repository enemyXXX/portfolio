import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import "./react360.scss";

interface ThisProps {
    contentClassName: string;
    dirName: string;
    numPages: number;
    sensibility: number;
}

const React360: React.FC<ThisProps> = (props) => {
    const isDragging = useRef(false);
    const dragHeadRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef(0);
    const imageIndex = useRef(0)
    const dragStartIndex = useRef(0)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({} as any), []);

    const onMouseDown = useCallback(e => {
        if (dragHeadRef.current && dragHeadRef.current.contains(e.target)) {
          isDragging.current = true;
          dragStart.current = e.screenX;
          dragStartIndex.current = imageIndex.current;
        }
      }, []);
    
      const onMouseUp = useCallback(() => {
        if (isDragging.current) {
          isDragging.current = false;
        }
      }, []);
    
      const onMouseMove = useCallback(e => {
        if (isDragging.current) {
          updateImageIndex(e.screenX)
        }
      }, []);
    
      useEffect(() => {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        return () => {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousedown", onMouseDown);
          document.removeEventListener("mousemove", onMouseMove);
        };
      }, [onMouseMove, onMouseDown, onMouseUp]);

    const updateImageIndex = (currentPosition: number) => {
        let numImages = props.numPages;
        const pixelsPerImage = props.sensibility * (360 / numImages);
        let dx = (currentPosition - dragStart.current) / pixelsPerImage;
        let index = Math.floor(dx) % numImages;

        if (index < 0) {
            index = numImages + index - 1;
        }
        index = (index + dragStartIndex.current) % numImages;
        if (index !== imageIndex.current) {
           imageIndex.current = index;
           forceUpdate();
        }
    };

    const preventDragHandler = (event: any) => {
        event.preventDefault();
    };

    const renderImage = () => {
        return (
            <div className="react360">
                <img
                    className="react-360-img"
                    alt=""
                    src={`/${props.dirName}/${imageIndex.current}.jpg`}
                />
            </div>
        );
    };

    return (
        <div ref={dragHeadRef}
            className="react-360-img"
            onDragStart={preventDragHandler}
        >
            {renderImage()}
        </div>
    );
}

export default React360;