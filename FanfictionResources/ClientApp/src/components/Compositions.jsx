import React, { useState, useEffect } from 'react'
import authService from './api-authorization/AuthorizeService'
import { Redirect } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap'
import { ReactTable } from './Table'
import TagsInput from 'react-tagsinput'
import { AutocompleteTags } from './AutocompleteTags'
import { TagRender } from './TagRender'
import { FileDrop } from 'react-file-drop';
import './Drop.css';

export function Compositions(props) {
  const [compositions, setCompositions] = useState([]);
  const [fandoms, setFandoms] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [isGoChapters, setIsGoChapters] = useState(false);
  const [compositionTags, setCompositionTags] = useState([]);
  const [show, setShow] = useState(false);
  const [tags, setTags] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [compositionName, setCompositionName] = useState('');
  const [isRead, setIsRead] = useState(false);
  const [composition, setComposition] = useState(
    {
      id:'',
      name: '',
      pictureUrl: '',
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
        return obj.name == compositionName;
      })
      setComposition(compositionU);
      const result = [];
      compositionU.tags.forEach(tag => {
        result.push(tag.name);
      });
      setCompositionTags(result);
      populateTags();
    }

    if (redirect) {
      const compositionU = compositions.find(obj => {
        return obj.name == compositionName;
      })
      localStorage.setItem('compositionId', compositionU.id);
      localStorage.setItem('compositionName', compositionU.name);
    }
  }, [compositionName, isUpdate, show, redirect]);

  async function populateCompositions() {
    const token = await authService.getAccessToken();
    let id;
    if (props.userId !== undefined) {
      id = props.userId.id;
      console.log(id)
    } else {
      const user = await authService.getUser();
      id = user.id;
    }
    const response = await fetch('compositions/' + id, {
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
    setCompositionName(e.target.value);
    setIsUpdate(true);
    setShow(true);
  }

  const handleUpdateBook = (e) => {
    setCompositionName(e.target.value);
    setRedirect(true);
    setIsGoChapters(true);
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
    let id;
    if (props.userId !== undefined) {
      id = props.userId.id;
      console.log(id)
    } else {
      const user = await authService.getUser();
      id = user.id;
    }
    dateToCreate.applicationUserId = id;
    dateToCreate = JSON.stringify(dateToCreate);
    const response = await fetch('compositions', {
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
    const response = await fetch('compositions', {
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
    const response = await fetch('compositions', {
      method: 'DELETE',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: dateToDelete,
    });
    await response;
    await populateCompositions();
  };

  async function uploadPicture(uploadData) {
    const response = await fetch("https://api.cloudinary.com/v1_1/dynsyqrv3/image/upload", {
      method: "post",
      body: uploadData
    });
    const data = await response.json();
    setComposition({...composition, pictureUrl: data.secure_url })
  }

  const handleUploadPicture = (files) => {
    const data = new FormData()
    data.append("file", files[0])
    data.append("upload_preset", "funFiction")
    data.append("cloud_name", "dynsyqrv3")
    uploadPicture(data)
  }

  const handleRead = (e) => {
    setCompositionName(e.target.value);
    setRedirect(true);
    setIsRead(true);
  }

  if (isRead) {
    return <Redirect to={{ pathname: '/read'}} />
   }

  if (isGoChapters) {
   return <Redirect to={{ pathname: '/allchapters'}} />
  }

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
            <Form.Group role="form">
              <Form.Label>Picture</Form.Label>
              <FileDrop 
                onDrop={(files, event) => {handleUploadPicture(files)}}
              >
                Drop picture here!
              </FileDrop>
              <div style={{ width: 200 }}>
                <img style={{ width: "100%", margin: "30px 0" }} src={composition.pictureUrl} />
              </div>
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
      <ReactTable data={compositions} handleDelete={handleDelete} handleUpdateHeaders={handleUpdateHeaders} handleUpdateBook={handleUpdateBook} handleRead={handleRead}/>
    </div>
  );
}