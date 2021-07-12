import React from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import { Compositions } from './Compositions'
import { UserData } from './UserData'
import '../custom.css'

export function Profile(props) {
    return (
        <div>
            <Tabs defaultActiveKey="compositions" id="uncontrolled-tab-example">
                <Tab eventKey="compositions" title="Compositions">
                    <Compositions userId={props.location.state}/>
                </Tab>
                <Tab eventKey="userData" title="UserData">
                    <UserData userId={props.location.state}/>
                </Tab>
            </Tabs>
        </div>
    );
}
