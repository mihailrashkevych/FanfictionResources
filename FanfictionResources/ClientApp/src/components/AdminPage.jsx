import React from 'react';
import { Tabs, Tab} from 'react-bootstrap'
import { Users } from './Users'
import { Fandoms } from './Fandoms'
import '../custom.css'

export function AdminPage() {


    return (
        <div>
            <Tabs defaultActiveKey="users" id="uncontrolled-tab-example">
                <Tab eventKey="users" title="Users">
                    <Users />
                </Tab>
                <Tab eventKey="fandoms" title="Fandoms">
                    <Fandoms />
                </Tab>
            </Tabs>
        </div>
    );
}
