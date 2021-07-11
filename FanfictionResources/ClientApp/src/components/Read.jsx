import React, { useState, useEffect } from 'react';
import { Col, Row, Tab, Form, Button, Image, Jumbotron, Container, ListGroup, Modal } from 'react-bootstrap';
import authService from './api-authorization/AuthorizeService';
import MDEditor from '@uiw/react-md-editor';
import TagsInput from 'react-tagsinput';
import { TagRender } from './TagRender';
import { AutocompleteTags } from './AutocompleteTags';
import { FileDrop } from 'react-file-drop';

export function Read() {

    const [chapters, setChapters] = useState([]);
    const [showBookEdit, setShowBookEdit] = useState(false);
    const [showChapterEdit, setShowChapterEdit] = useState(false);
    const [tags, setTags] = useState(false);
    const [user, setUser] = useState(null);
    const [fandoms, setFandoms] = useState([]);
    const [chapterBody, setChapterBody] = useState('');
    const [compositionTags, setCompositionTags] = useState([]);
    const [chapter, setChapter] = useState({
        pictureUrl: '',
        name: '',
        body: '',
        nextId: '',
        previousId: '',
    })
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
        populateChapters(); populateComposition(); populateUserData(); populateFandomData(); populateTags();
    }, []);

    useEffect(() => {
        populateChapters(); populateComposition(); populateUserData(); populateFandomData(); populateTags();
        const result = [];
        composition.tags.forEach(tag => {
            result.push(tag.name);
        });
        setCompositionTags(result);
    }, [showBookEdit]);

    useEffect(() => {
        setChapter({ ...chapter, body: chapterBody });
    }, [chapterBody]);

    async function populateUserData() {
        const userData = await authService.getUser();
        setUser(userData)
    };
    async function populateTags() {
        const token = await authService.getAccessToken();
        const response = await fetch('tag', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setTags(data);
    };

    const populateComposition = async () => {
        const response = await fetch('compositions/composition/' + localStorage.getItem('compositionId'));
        const data = await response.json();
        setComposition(data);
        console.log(chapter)
    };

    async function populateChapters() {
        const response = await fetch('chapters/' + localStorage.getItem('compositionId'), {
        });
        const data = await response.json();
        setChapters(sortChapters(data));
        if (data.length > 0) populateChapter(data[0].id);
    };

    async function populateChapter(id) {
        const response = await fetch('chapters/chapter/' + id, {
        });
        const data = await response.json();
        setChapter(data);
    };

    const handleGetChapter = (e) => {
        populateChapter(e.target.value)
    }

    const handlePrevious = () => {
        const chapterPrevious = chapters.find(obj => {
            return obj.id == chapter.previousId;
        });
        setChapter(chapterPrevious);
    }
    const handleNext = () => {
        const chapterNext = chapters.find(obj => {
            return obj.id == chapter.nextId;
        });
        console.log(chapterNext)
        setChapter(chapterNext);
    }

    function sortChapters(data) {
        const sortedChapters = [];
        if (data.length > 0) {
            sortedChapters.push(data.find(obj => {
                return obj.previousId == null;
            }));
            for (let index = 0; index < data.length - 1; index++) {
                sortedChapters.push(data.find(obj => {
                    return obj.id == sortedChapters[index].nextId;

                }));
            }
        }
        return sortedChapters
    }

    const handleUpdateBook = () => {
        setShowBookEdit(true);
    }

    const handleUpdateChapter = () => {
        setShowChapterEdit(true);
        setChapterBody(chapter.body);
    }

    const handleDeleteChapter = (e) => {
        deleteChapter(e.target.value);
        populateChapters();
    }
    async function deleteChapter(id) {
        const token = await authService.getAccessToken();
        id = JSON.stringify(id);
        const response = await fetch('chapters', {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: id,
        });
        await response;
        populateChapters();
    };

    async function populateFandomData() {
        const token = await authService.getAccessToken();
        const response = await fetch('fandom', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setFandoms(data);
    };

    const onInputBook = (e) => {
        const { name, value } = e.target;
        setComposition({
            ...composition,
            [name]: value
        });
    }

    const onInputChapter = (e) => {
        const { name, value } = e.target;
        setChapter({
            ...chapter,
            [name]: value
        });
    }

    const handleClose = () => {
        setShowBookEdit(false);
        setShowChapterEdit(false);
        setCompositionTags([]);
    };

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
        updateComposition(composition);
        setShowBookEdit(false);
        setCompositionTags([]);
    }

    async function updateComposition(dateToUpdate) {
        const token = await authService.getAccessToken();
        dateToUpdate = JSON.stringify(dateToUpdate);
        const response = await fetch('compositions', {
            method: 'PUT',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dateToUpdate,
        });
        await response;
        populateComposition();
    };

    async function uploadPicture(uploadData) {
        const response = await fetch("https://api.cloudinary.com/v1_1/dynsyqrv3/image/upload", {
            method: "post",
            body: uploadData
        });
        const data = await response.json();
        setComposition({ ...composition, pictureUrl: data.secure_url })
    }

    const handleUploadPicture = (files) => {
        const data = new FormData()
        data.append("file", files[0])
        data.append("upload_preset", "funFiction")
        data.append("cloud_name", "dynsyqrv3")
        uploadPicture(data)
    }

    const onFormChapterSubmit = e => {
        e.preventDefault()
        console.log(chapterBody)
        updateChapter(chapter);
        setShowChapterEdit(false);
    }

    async function updateChapter(dataChapter) {
        const token = await authService.getAccessToken();
        dataChapter = JSON.stringify(dataChapter);
        const response = await fetch('chapters', {
            method: 'PUT',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataChapter,
        });
        await response;
        populateChapters();
    };

    return (
        <div>
            <Modal show={showChapterEdit} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group role='form'>
                            <Form.Label>Chapter Name</Form.Label>
                            <Form.Control
                                defaultValue={chapter.name}
                                type='text'
                                onChange={onInputChapter}
                                name='name'
                            />
                            <Form.Label>Picture</Form.Label>
                            <FileDrop
                                onDrop={(files, event) => { handleUploadPicture(files) }}
                            >
                                Drop picture here!
                            </FileDrop>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                                <img style={{ height: '100%', width: '100%' }} src={chapter.pictureUrl} />
                            </div>
                        </Form.Group>
                        <Form.Group role='form'>
                            <MDEditor
                                value={chapterBody}
                                onChange={setChapterBody}
                                name='body'
                            />
                        </Form.Group>
                        <Button variant='secondary' onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant='secondary' type='submit' onClick={onFormChapterSubmit}>
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showBookEdit} onHide={handleClose} animation={false}>
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
                                onChange={onInputBook}
                                name="name"
                            />
                        </Form.Group>
                        <Form.Group role="form">
                            <Form.Label>Fandom</Form.Label>
                            <Form.Control as="select"
                                name='fandomId'
                                value={composition.fandomId}
                                onChange={onInputBook}
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
                                onChange={onInputBook}
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

            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                <Image style={{ height: '100%', width: 'auto', margin: '3px' }} src={composition.pictureUrl} rounded />
                <h1 style={{ textAlign: 'center' }}>{composition.name}</h1>
            </Container>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        {
                            chapters.map((chapter, index) => {
                                return (
                                    <Container key={index}>
                                        <ListGroup defaultActiveKey={chapter.id}>
                                            <ListGroup.Item action onClick={handleGetChapter} value={chapter.id}>
                                                {index + 1}. {chapter.name}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Container>
                                );
                            })
                        }
                    </Col>
                    <Col sm={9}>
                        <Jumbotron fluid>
                            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h2>
                                    {chapter.name}
                                </h2>
                            </Container>
                            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Image style={{ height: '100%', width: 'auto', margin: '3px' }} src={chapter.pictureUrl} rounded />
                            </Container>
                            {
                                user && user.role.includes("Admin") || user && user.id.includes(composition.applicationUserId) ?
                                    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {
                                            chapter.name == "" ? null :
                                            <Button size='sm' variant="secondary" value={chapter.id} onClick={handleUpdateChapter}>
                                                Edit Chapter
                                            </Button>
                                        }
                                        <Button size='sm' variant="secondary" value={composition.name} onClick={handleUpdateBook}>
                                            Edit Book
                                        </Button>
                                        {
                                            chapter.name === "" ? null :
                                            <Button size='sm' variant="secondary" value={chapter.id} onClick={handleDeleteChapter}>
                                                Delete Chapter
                                            </Button>
                                        }
                                    </Container>
                                    : null
                            }
                        </Jumbotron>
                        <MDEditor.Markdown source={chapter.body} />
                        {chapter.name === '' ? null :
                            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {chapter.previousId !== null &&
                                    <Button variant='secondary' onClick={handlePrevious}>
                                        Previous
                                    </Button>
                                }
                                {chapter.nextId !== null &&

                                    <Button variant='secondary' type='submit' onClick={handleNext}>
                                        Next
                                    </Button>
                                }
                            </Container>
                        }
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
