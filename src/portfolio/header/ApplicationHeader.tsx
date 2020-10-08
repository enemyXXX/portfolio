import './ApplicationHeader.scss';
import React, { useEffect, useState } from 'react';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import { BrowserRouter, Link } from 'react-router-dom';

export interface PageItem {
    id: number,
    name: string,
    redirectPath: string
}

export const pagesList: PageItem[] = [
    { id: 1, name: 'Projects', redirectPath: '/projects' },
    { id: 2, name: 'About', redirectPath: '/about' },
    { id: 3, name: 'Contacts', redirectPath: '/contacts' },
]

interface ThisProps {
    isMobileResolution: boolean;
    headerClassName: string;
}

const ApplicationHeader: React.FC<ThisProps> = (props) => {
    const [isBurgerMenuCollapsed, setIsBurgerMenuCollapsed] = useState(false);

    const displayPossiblePages = () => {
        switch (props.isMobileResolution) {
            case true: return <button onClick={() => onSwitchCollapsedMenuState(!isBurgerMenuCollapsed)} 
                                      className={`hamburger hamburger--spring ${isBurgerMenuCollapsed ? 'is-active' : ''}`} type="button">
                <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                </span>
            </button>; 
            case false: return <div className='application-pages'>{pagesList.map(pageItem =>
                <Link to={pageItem.redirectPath}><div className='application-page' key={`page-${pageItem.id}`}>
                    {pageItem.name}
                </div></Link>
            )}</div>;
        }
    }

    const onSelectPossiblePage = (pageItem: PageItem) => {
        console.log(pageItem.name)
    }

    const onSwitchCollapsedMenuState = (newState: boolean) => {
        if (newState) {
            document.body.classList.add('hide-scroll');
        } else {
            document.body.classList.remove('hide-scroll');
        }
        setIsBurgerMenuCollapsed(newState);
    }

    useEffect(() => {
        const onResizeWindow = () => {
            setIsBurgerMenuCollapsed(props.isMobileResolution && isBurgerMenuCollapsed)
        }
        onResizeWindow();
        window.addEventListener('resize', onResizeWindow)

        return () => {
            window.removeEventListener('resize', onResizeWindow);
        }
    }, [])

    return (
        <div className='application-header-container'>
            <div className={`application-header ${props.headerClassName}`}>
                <div className='user-nickname'>Enemy XXX</div>
                {displayPossiblePages()}
                {isBurgerMenuCollapsed ? <BurgerMenu onCloseCollapsedMenu={() => onSwitchCollapsedMenuState(false)}
                    onSelectPossiblePage={onSelectPossiblePage} /> : null}
            </div>
        </div>
    )
}

export default ApplicationHeader;