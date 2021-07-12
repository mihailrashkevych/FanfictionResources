import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Modal, Form } from 'react-bootstrap';
import { Table } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import '../custom.css'

export function Fandoms() {

    const [show, setShow] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [data, setData] = useState({
        fandoms: [],
    });

    const [fandom, setFandom] = useState({
        id: '',
        name: '',
        funСompositions: null
    });

    const initialFandom = {
        id: '',
        name: '',
        funСompositions: null
    }

    useEffect(() => { populateFandomData() }, []);

    async function populateFandomData() {
        const token = await authService.getAccessToken();
        const response = await fetch('fandom', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setData({ fandoms: data });
    };

    async function createFandom(dataFandom) {
        const token = await authService.getAccessToken();
        dataFandom = JSON.stringify(dataFandom);
        const response = await fetch('fandom', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataFandom,
        });
        await response;
        populateFandomData();
    };

    async function updateFandom(dataFandom) {
        const token = await authService.getAccessToken();
        dataFandom = JSON.stringify(dataFandom);
        const response = await fetch('fandom', {
            method: 'PUT',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataFandom,
        });
        await response;
        populateFandomData();
    };

    async function deleteFandom(id) {
        const token = await authService.getAccessToken();
        id = JSON.stringify(id);
        const response = await fetch('fandom', {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: id,
        });
        await response;
        populateFandomData();
    };

    const handleDelete = e => {
        deleteFandom(e.target.value);
    }

    const onInput = (e) => {
        const { name, value } = e.target;
        setFandom({
            ...fandom, [name]: value
        });
    }

    const handleClose = () => {
        setShow(false)
        setFandom(initialFandom);
    };
    const handleShow = e => {
        // eslint-disable-next-line eqeqeq
        if (!e.target.value=="") {
            // eslint-disable-next-line eqeqeq
            const fandom = data.fandoms.find(f => f.id == e.target.value);
            setFandom(fandom);
            setIsUpdate(true);
            console.log(fandom);
        }
        setShow(true);
    };
    const onFormSubmit = e => {
        e.preventDefault()
        if (isUpdate) {
            updateFandom(fandom);
            setIsUpdate(false);
        }
        else {
            createFandom({name: fandom.name});
        }
        console.log(fandom);
        setShow(false);
        setFandom(initialFandom);
    }

    return (
        <div className="App">
            <ButtonGroup>
                <Button variant="primary" onClick={handleShow} value=''>
                    Add Fandom
                </Button>
            </ButtonGroup>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group role="form">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={fandom.name}
                                onChange={onInput}
                                name="name"
                            />
                        </Form.Group>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="secondary" type="submit" onClick={onFormSubmit}>
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.fandoms.map(fandom => {
                            return (
                                <tr key={fandom.id}>
                                    <td>{fandom.name}</td>
                                    <td>
                                        <Button onClick={handleShow} value={fandom.id}>
                                            Edit
                                        </Button>
                                        <Button onClick={handleDelete} value={fandom.id}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
}
