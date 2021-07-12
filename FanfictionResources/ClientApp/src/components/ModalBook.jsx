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

export function ModalBook({ showModal, book }) {
    const [show, setShow] = useState(false);

    const [composition, setComposition] = useState(
        {
            id: '',
            name: '',
            pictureUrl: '',
            applicationUserId: '',
            fandomId: 0,
            tags: [],
            description: '',
        });

    useEffect(() => {
        setShow(showModal);
        setComposition(book);
        populateFandomData();
        populateTags();
    }, []);

    



    return (
        <div>
            <Modal show={showModal&&show} onHide={handleClose} animation={false}>
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
                                            <option key={fandom.id} value={fandom.id} value={fandom.id}>{fandom.name}</option>
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
                                onDrop={(files, event) => { handleUploadPicture(files) }}
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
        </div>
    );
}