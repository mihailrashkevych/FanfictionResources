import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import { Table } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import block from './icons/block.png';
import unblock from './icons/unlock.png';
import del from './icons/delete.png';
import '../custom.css'

export function Users() {

    const [data, setData] = useState({
        users: []
    });

    var optionsLastSignDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    useEffect(() => { populateUserData() }, []);

    async function populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('admin', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setData({ users: data });
    };

    async function deleteUserData(dataToDelete) {
        const token = await authService.getAccessToken();
        dataToDelete = JSON.stringify(dataToDelete);
        const response = await fetch('admin', {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataToDelete,
        });
        await response;
    };

    async function lockUserData(dataToLock) {
        const token = await authService.getAccessToken();
        dataToLock = JSON.stringify(dataToLock);
        const response = await fetch('admin/lock', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataToLock,
        });
        await response;
        populateUserData();
    };

    async function unlockUserData(dataToUnlock) {
        const token = await authService.getAccessToken();
        dataToUnlock = JSON.stringify(dataToUnlock);
        const response = await fetch('admin/unlock', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataToUnlock,
        });
        await response;
        populateUserData();
    };

    async function setAdminRole(dataToAdmin) {
        const token = await authService.getAccessToken();
        dataToAdmin = JSON.stringify(dataToAdmin);
        const response = await fetch('admin/set-admin-role', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataToAdmin,
        });
        await response;
        populateUserData();
    };

    async function setUserRole(dataToUser) {
        const token = await authService.getAccessToken();
        dataToUser = JSON.stringify(dataToUser);
        const response = await fetch('admin/set-user-role', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataToUser,
        });
        await response;
        populateUserData();
    };

    const handleAllChecked = event => {
        let users = data.users;
        users.forEach(user => (user.isChecked = event.target.checked));
        setData({ users: users });
    };

    const handleOnChange = event => {
        let users = data.users;
        users.forEach(user => {
            // eslint-disable-next-line eqeqeq
            if (user.id == event.target.value) {
                user.isChecked = event.target.checked
            }
        });
        setData({ users: users });
    };

    const handleBlock = () => {
        let users = data.users;
        let ids = [];
        users.forEach(user => {
            // eslint-disable-next-line eqeqeq
            if (user.isChecked == true) {
                ids.push(user.id);
            }
        });
        lockUserData(ids);
        setData({ users: users });
    }

    const handleUnlock = () => {
        let users = data.users;
        let ids = [];
        users.forEach(user => {
            // eslint-disable-next-line eqeqeq
            if (user.isChecked == true) {
                ids.push(user.id);
            }
        });
        unlockUserData(ids);
        setData({ users: users });
    }

    const handleDelete = () => {
        let users = data.users;
        let ids = [];
        data.users.forEach(function (item, index, object) {
            if (item.isChecked) {
                ids.push(item.id);
                object.splice(index, 1);
            }
        });
        deleteUserData(ids);
        setData({ users: users });
    }

    const handleSetAdmin = () => {
        let users = data.users;
        let ids = [];
        users.forEach(user => {
            // eslint-disable-next-line eqeqeq
            if (user.isChecked == true) {
                ids.push(user.id);
            }
        });
        setAdminRole(ids);
        setData({ users: users });
    }

    const handleSetUser = () => {
        let users = data.users;
        let ids = [];
        users.forEach(user => {
            // eslint-disable-next-line eqeqeq
            if (user.isChecked == true) {
                ids.push(user.id);
            }
        });
        setUserRole(ids);
        setData({ users: users });
    }

    return (
        <div className="App">
            <ButtonGroup>
                <Button onClick={handleBlock}>
                    <img src={block} alt="block" />
                </Button>
                <Button onClick={handleUnlock}>
                    <img src={unblock} alt="unlock" />
                </Button>
                <Button onClick={handleDelete}>
                    <img src={del} alt="delete" />
                </Button>
                <Button onClick={handleSetAdmin}>
                    SetAdmin
                </Button>
                <Button onClick={handleSetUser}>
                    SetUser
                </Button>
            </ButtonGroup>
            <Table>
                <thead>
                    <tr>
                        <th><Input type="checkbox" onChange={handleAllChecked} /> Check All</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Lockout End</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.users.map(user => {
                            return (
                                <tr key={user.id}>
                                    <td><Input type='checkbox' onChange={handleOnChange} checked={user.isChecked} value={user.id} /></td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.lockoutEnd).toLocaleString("en-US", optionsLastSignDate)}</td>
                                    <td>{(!user.role)
                                        ? "User"
                                        : "Admin"}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
}
