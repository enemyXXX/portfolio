import React from 'react';
import './ImageRotatePage.scss';
import React360 from './react360';

interface ThisProps {
    contentClassName: string;
}

const ImageRotatePage: React.FC<ThisProps> = (props) => {
    return (
        <div className={`image-rotate-container`}>
            <div className={`image-rotate ${props.contentClassName}`}>
                <React360   contentClassName={props.contentClassName}
                            sensibility={6}
                            dirName={'awair-360'}
                            numPages={55} />
            </div>
        </div>
    )
}

export default ImageRotatePage;