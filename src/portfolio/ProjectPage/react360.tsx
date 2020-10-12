import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import "./react360.scss";
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { CustomInput, Input, Label } from 'reactstrap';
import ReactSlider from 'react-slider'

interface ThisProps {
  contentClassName: string;
  dirName: string;
  numPages: number;
  sensibility: number;
}

const React360: React.FC<ThisProps> = (props) => {
  const [isInfinityAnimation, setIsInfinityAnimation] = useState<boolean>(false);
  const movingSensibility = useRef(props.sensibility);
  const isDragging = useRef(false);
  const isForwardDirection = useRef(false);
  const isDirectionArrowDown = useRef(false);
  const animationInterval = useRef<any>(null);
  const dragHeadRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const imageIndex = useRef(0);
  const dragStartIndex = useRef(0);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({} as any), []);

  if (isDirectionArrowDown.current && !animationInterval.current) {
    animationInterval.current = setInterval(() => {
      imageIndex.current = (isForwardDirection.current ? imageIndex.current - 1 : imageIndex.current + 1);
      if (imageIndex.current > props.numPages) {
        imageIndex.current = 0;
      } else if (imageIndex.current < 0) {
        imageIndex.current = props.numPages
      }
      forceUpdate()
    }, 1000 / 20);
  }

  const onMouseDown = useCallback(e => {
    if (!isInfinityAnimation && !isDirectionArrowDown.current && dragHeadRef.current && dragHeadRef.current.contains(e.target)) {
      isDragging.current = true;
      dragStart.current = e.screenX;
      dragStartIndex.current = imageIndex.current;
    }
  }, [isInfinityAnimation]);

  const onMouseUp = useCallback(() => {
    if (!isInfinityAnimation) {
      onDirectionArrowMouseUp();
      if (isDragging.current) {
        isDragging.current = false;
      }
    }
  }, [isInfinityAnimation]);

  const onMouseMove = useCallback(e => {
    if (isDragging.current) {
      updateImageIndex(e.screenX)
    }
  }, []);

  useEffect(() => {
    document.addEventListener("pointerup", onMouseUp);
    document.addEventListener("pointerdown", onMouseDown);
    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("wheel", onMouseWheelSlide)

    return () => {
      document.removeEventListener("pointerup", onMouseUp);
      document.removeEventListener("pointerdown", onMouseDown);
      document.removeEventListener("pointermove", onMouseMove);
      document.removeEventListener("wheel", onMouseWheelSlide)

    };
  }, [onMouseMove, onMouseDown, onMouseUp]);

  useEffect(() => {
    const imagesList: string[] = Array.from({ length: props.numPages }, (_, i) => i + 1).map(pageNumber => {
      return `/${props.dirName}/${imageIndex.current}.jpg`
    })
    cacheImages(imagesList);
  }, [])

  const cacheImages = async (srcImagesList: string[]) => {
    const promises = await srcImagesList.map((src: string) => {
      return new Promise((resolve: any, reject: any) => {
        const image = new Image();
        image.src = src;
        image.onload = resolve();
        image.onerror = reject();
      })
    })

    await Promise.all(promises);
  }

  const updateImageIndex = (currentPosition: number) => {
    let numImages = props.numPages;
    const sensibility = movingSensibility.current < 10 ? 10 - movingSensibility.current : 1;
    const pixelsPerImage = sensibility * (360 / numImages);
    let dx = (dragStart.current - currentPosition) / pixelsPerImage;
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

  const onChangeImage = (isForward: boolean) => {
    imageIndex.current = (isForward ? imageIndex.current - 1 : imageIndex.current + 1);
    if (imageIndex.current > props.numPages) {
      imageIndex.current = 0;
    } else if (imageIndex.current < 0) {
      imageIndex.current = props.numPages
    }
    forceUpdate()
  }

  const onMouseWheelSlide = (event: WheelEvent) => {
    const direction = Math.sign(event.deltaY);
    imageIndex.current = (direction > 0 ? imageIndex.current - 1 : imageIndex.current + 1);
    if (imageIndex.current > props.numPages) {
      imageIndex.current = 0;
    } else if (imageIndex.current < 0) {
      imageIndex.current = props.numPages
    }
    forceUpdate()
  }

  const onSwitchInfinityAnimationState = (newState: boolean) => {
    setIsInfinityAnimation(newState);
    newState ? onDirectionArrowMouseDown(true) : onDirectionArrowMouseUp()
  }

  const onDirectionArrowMouseDown = (isForward: boolean) => {
    isDirectionArrowDown.current = true;
    isForwardDirection.current = isForward;
    forceUpdate();
  }

  const onDirectionArrowMouseUp = () => {
    isDirectionArrowDown.current = false;
    clearInterval(animationInterval.current);
    animationInterval.current = null;
    forceUpdate();
  }

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
    <div className='react-360-container'>
      <div ref={dragHeadRef}
        className={`react-360-img-container ${props.contentClassName} ${isInfinityAnimation ? 'disabled-360' : ''}`}
        onDragStart={preventDragHandler}>
        <MdNavigateBefore className='navigate-btn' onPointerDown={() => onDirectionArrowMouseDown(false)} />
        {renderImage()}
        <MdNavigateNext className='navigate-btn' onPointerDown={() => onDirectionArrowMouseDown(true)} />
      </div>
      <div className='react-360-controls-container'>
        <div className='animation-checkbox-container animation-control'>
          <CustomInput className='auto-animation-switcher' onChange={() => onSwitchInfinityAnimationState(!isInfinityAnimation)}
            type="switch" id="auto-animation-switcher"
            name="animation-switcher"
            label="Infinity animation" />
        </div>
        <div className='animation-speed-container animation-control'>
          <Label className='speed-title' for="sensibility-range">Sensibility speed</Label>
          <Input onChange={(event: any) => movingSensibility.current = (event.target.value / 10)} value={movingSensibility.current*10} type="range" name="range" id="sensibility-range" className='speed-range' />
        </div>
      </div>
    </div>
  );
}

export default React360;