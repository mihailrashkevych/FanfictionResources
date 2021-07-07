import React, { useState, useEffect } from 'react'
import authService from './api-authorization/AuthorizeService'
import { Button, Modal, Form } from 'react-bootstrap'
import '../custom.css'
import { ReactTable } from './Table'
import TagsInput from 'react-tagsinput'
import { AutocompleteTags } from './AutocompleteTags'
import { TagRender } from './TagRender'

export function Profile(props) {
  const [compositions, setCompositions] = useState([]);
  const [fandoms, setFandoms] = useState([]);
  const [compositionTags, setCompositionTags] = useState([]);
  const [show, setShow] = useState(false);
  const [tags, setTags] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [nameForUpdate, setNameForUpdate] = useState('');
  const [composition, setComposition] = useState(
    {
      name: '',
      applicationUserId: '',
      fandomId: 0,
      tags: [],
      description: '',
    });

  useEffect(() => {
    populateCompositions();
    populateFandomData();
    populateTags();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      const compositionU = compositions.find(obj => {
        return obj.name == nameForUpdate;
      })
      setComposition(compositionU);

      const result = [];
      compositionU.tags.forEach(tag => {
        result.push(tag.name);
      });
      setCompositionTags(result);
    }
    populateTags();
  }, [nameForUpdate, isUpdate, show]);

  async function populateCompositions() {
    const token = await authService.getAccessToken();
    let id;
    if (props.location.state !== undefined) {
      id = props.location.state.id;
    } else {
      const user = await authService.getUser();
      id =user.id;
    }
    const response = await fetch('composition/' + id, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setCompositions(data);
  };

  async function populateTags() {
    const token = await authService.getAccessToken();
    const response = await fetch('tag', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setTags(data);
  };

  async function populateFandomData() {
    const token = await authService.getAccessToken();
    const response = await fetch('fandom', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setFandoms(data);
    setComposition({ fandomId: data[0].id })
  };

  const handleUpdateHeaders = (e) => {
    setNameForUpdate(e.target.value);
    setIsUpdate(true);
    setShow(true);
  }

  const handleDelete = (e) => {
    deleteComposition(e.target.value);
  }

  const onInput = (e) => {
    const { name, value } = e.target;
    setComposition({
      ...composition,
      [name]: value
    });
  }

  const handleClose = () => {
    setShow(false);
    setCompositionTags([]);
    setComposition({});
    setIsUpdate(false);
  };

  const handleShow = () => {
    if (isUpdate) {
      setCompositionTags(composition.tags);
      addTags(composition.tags);
    }
    setShow(true);
  }

  const handleTagsSet = (tags) => {
    setCompositionTags(tags);
    addTags(tags);
  }

  async function addTags(tags) {
    const result = [];
    tags.forEach(tag => {
      result.push({ name: tag });
    });
    setComposition({ ...composition, tags: result });
    return composition.tags;
  }

  const onFormSubmit = e => {
    e.preventDefault();
    if (isUpdate) {
      updateComposition(composition);
      setIsUpdate(false);
    }
    else {
      createComposition(composition);
    }
    setShow(false);
    setCompositionTags([]);
    setComposition({});
    setTags([]);
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
    await populateCompositions();
  };

  async function updateComposition(dateToUpdate) {
    const token = await authService.getAccessToken();
    dateToUpdate = JSON.stringify(dateToUpdate);
    const response = await fetch('composition', {
      method: 'PUT',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: dateToUpdate,
    });
    await response;
    await populateCompositions();
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
    await populateCompositions();
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
                defaultValue={composition.name}
                type="text"
                onChange={onInput}
                name="name"
              />
            </Form.Group>
            <Form.Group role="form">
              <Form.Label>Fandom</Form.Label>
              <Form.Control as="select"
                name='fandomId'
                value={composition.fandomId}
                onChange={onInput}
              >
                {
                  fandoms.map(fandom => {
                    return (
                      <option key={fandom.id} value={fandom.id}>{fandom.name}</option>
                    )
                  })
                }
              </Form.Control>
            </Form.Group>
            <Form.Group role="form">
              <Form.Label>Tags</Form.Label>
              <TagsInput onlyUnique='true' inputProps={tags} renderInput={AutocompleteTags} renderTag={TagRender} value={compositionTags} onChange={handleTagsSet} addOnBlur='true' />
            </Form.Group>
            <Form.Group role="form">
              <Form.Label>Description</Form.Label>
              <Form.Control
                defaultValue={composition.description}
                type="text"
                onChange={onInput}
                name="description"
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={onFormSubmit}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ReactTable data={compositions} handleDelete={handleDelete} handleUpdate={handleUpdateHeaders} />
    </div>
  );
}
