import React, { useState, useEffect } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Button, Modal, Form } from 'react-bootstrap';
import '../custom.css'
import { ReactTable } from './Table'

export function Profile() {
  const [data, setData] = useState({
    compositions: [],
  });
  const [state, setState] = useState({
    fandoms:[{id:0, name:"init"}],
  });
  const [show, setShow] = useState(false);
  const [composition, setComposition] = useState(
    {
      name: '',
      applicationUserId: '',
      fandom: '',
      tags: '',
      description: '',
    });

  useEffect(() => { populateCompositions()}, []);

  async function populateCompositions() {
    const token = await authService.getAccessToken();
    const response = await fetch('composition', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setData({ compositions: data });
  };

  async function populateFandomData() {
    const token = await authService.getAccessToken();
    const response = await fetch('fandom', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setState({fandoms: data});
    console.log(state);
  };

  async function deleteComposition(dateToDelete) {
    const token = await authService.getAccessToken();
    dateToDelete = JSON.stringify(dateToDelete);
    const response = await fetch('composition', {
      method: 'DELETE',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: dateToDelete,
    });
    await response;
  };

  async function updateComposition(dateToUpdate) {
    const token = await authService.getAccessToken();
    dateToUpdate = JSON.stringify(dateToUpdate);
    const response = await fetch('composition', {
      method: 'POST',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: dateToUpdate,
    });
    await response;
    populateCompositions();
  };

  const handleDelete = () => {
    let compositions = data.compositions;
    let ids = [];
    data.compositions.forEach(function (item, index, object) {
      if (item.isChecked) {
        ids.push(item.id);
        object.splice(index, 1);
      }
    });
    deleteComposition(ids);
    setData({ compositions: compositions });
  }

  const handleUpdate = () => {
    let compositions = data.compositions;
    let ids = [];
    compositions.forEach(compositions => {
      if (compositions.isChecked == true) {
        ids.push(compositions.id);
      }
    });
    updateComposition(ids);
    setData({ compositions: compositions });
  }

  const onInput = (e) => {
    const { name, value } = e.target;
    setComposition({
      ...composition,
      [name]: value
    });
  }

  const handleClose = () => setShow(false);
  const handleShow = () => {
    populateFandomData();
    setShow(true);
  }

  const onFormSubmit = e => {
    e.preventDefault()
    createComposition(composition);
    console.log(composition);
    setShow(false);
    setComposition();
  }

  async function createComposition(dateToCreate) {
    const token = await authService.getAccessToken();
    const user = await authService.getUser();
    dateToCreate.applicationUserId = user.id;
    dateToCreate = JSON.stringify(dateToCreate);
    const response = await fetch('composition', {
      method: 'POST',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: dateToCreate,
    });
    await response;
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add Composition
      </Button>
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
                onChange={onInput}
                name="name"
              />
            </Form.Group>
            <Form.Group role="form">
              <Form.Label>Fandom</Form.Label>
              <Form.Control as="select"
                onChange={e => {
                  setComposition({ fandom: e.target.value });
                }}
              >
                {
                  state.fandoms.map(fandom => {
                    return (
                      <option key={fandom.id} value={fandom.name}>{fandom.name}</option>
                    )
                  })}
              </Form.Control>
            </Form.Group>
            <Form.Group role="form">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                onChange={onInput}
                name="tags"
              />
            </Form.Group>
            <Form.Group role="form">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                onChange={onInput}
                name="description"
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={onFormSubmit}>
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ReactTable data={data.compositions} />
    </div>
  );
}
