import React from 'react';
import './ContactsPage.scss';

interface ThisProps {
    contentClassName: string;
}

const ContactsContent: React.FC<ThisProps> = (props) => {
    return (
        <div className={`contacts-content-container`}>
            <div className={`contacts-content ${props.contentClassName}`}>
                Contacts page
            </div>
        </div>
    )
}

export default ContactsContent;