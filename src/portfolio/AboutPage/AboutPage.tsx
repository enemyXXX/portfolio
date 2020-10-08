import React from 'react';
import './AboutPage.scss';

interface ThisProps {
    contentClassName: string;
}

const AboutContent: React.FC<ThisProps> = (props) => {
    return (
        <div className={`about-content-container`}>
            <div className={`about-content ${props.contentClassName}`}>
                about page
            </div>
        </div>
    )
}

export default AboutContent;