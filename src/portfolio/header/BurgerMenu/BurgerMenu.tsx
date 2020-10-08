import React from 'react';
import { Link } from 'react-router-dom';
import { PageItem, pagesList } from '../ApplicationHeader';
import './BurgerMenu.scss';

interface ThisProps {
    onCloseCollapsedMenu: () => void;
    onSelectPossiblePage: (pageItem: PageItem) => void;
}

const BurgerMenu: React.FC<ThisProps> = (props) => {

    return (
        <div className='burger-menu-container'>
            <div className='navigation-pages'>
            {pagesList.map(pageItem =>
                <Link to={pageItem.redirectPath}><div className='navigation-page' key={`navigation-page-${pageItem.id}`}>
                    {pageItem.name}
                </div></Link>
            )}
                </div>
        </div>
    )
}

export default BurgerMenu