import React, { useEffect } from 'react';
import ApplicationHeader from './header/ApplicationHeader';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect, BrowserRouter
} from 'react-router-dom';
import ProjectsContent from './ProjectsPage/content/PortfolioContent';
import ContactsContent from './ContactPage/ContactsPage';
import AboutContent from './AboutPage/AboutPage';
import ImageRotatePage from './ProjectPage/ImageRotatePage';

const ApplicationPage: React.FC = () => {
    const [, updateState] = React.useState();
    const [isMobileResolution, setIsMobileResoultion] = React.useState(false);
    const forceUpdate = React.useCallback(() => updateState({} as any), []);

    useEffect(() => {
        const onResizeWindow = () => {
            const windowResolution: number = document.body.clientWidth;
            setIsMobileResoultion(windowResolution < 800);
            forceUpdate();
        }
        onResizeWindow();
        window.addEventListener('resize', onResizeWindow)

        return () => {
            window.removeEventListener('resize', onResizeWindow);
        }
    }, [])

    const windowResolution = () => {
        const windowScreenWidth = document.body.clientWidth;
        switch (true) {
            case windowScreenWidth > 1280: return 'xl';
            case windowScreenWidth > 960: return 'lg';
            case windowScreenWidth > 600: return 'md';
            case windowScreenWidth < 600: return 'sm';
            default: return '';
        }
    }

    return (<>
        <BrowserRouter>
            <ApplicationHeader isMobileResolution={isMobileResolution} headerClassName={windowResolution()} />
            <div className='application-content'>
            <Switch>
                <Route exact path={['/']} render={() => <Redirect to={'/projects'} />} />
                <Route path='/projects'>
                    <ProjectsContent contentClassName={windowResolution()} />
                </Route>
                <Route path='/project'>
                    <ImageRotatePage contentClassName={windowResolution()} />
                </Route>
                <Route path='/contacts'>
                    <ContactsContent contentClassName={windowResolution()} />
                </Route>
                <Route path='/about'>
                    <AboutContent contentClassName={windowResolution()} />
                </Route>
                <Route path='*'>
                    <Redirect to='/projects' />
                </Route>
            </Switch>
            </div>
        </BrowserRouter>
    </>)
}

export default ApplicationPage;