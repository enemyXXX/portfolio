import React from 'react';
import fakeData from './FakeData';
import './ProjectsContent.scss';

interface ThisProps {
    contentClassName: string;
}

const ProjectsContent: React.FC<ThisProps> = (props) => {


    const displayItems = () => {
        return fakeData.map((item, i) => {
            return <div className='content-item-container'>
                <div className='content-item'>
                <img src={`/assets/${item.image}`} alt="image" />
                    <div className='headline'>
                        <span>{item.headline}</span>
                    </div>
                    <div className='description'>
                        <span>{item.description}</span>
                    </div>
                    <div className='read-more'>
                        <button className='read-more-btn'>Читать больше</button> 
                    </div>
                </div>
            </div>
        })
    }

    return (
        <div className={`portfolio-content-container`}>
            <div className={`portfolio-content ${props.contentClassName}`}>
                {displayItems()}
            </div>
        </div>
    )
}

export default ProjectsContent;