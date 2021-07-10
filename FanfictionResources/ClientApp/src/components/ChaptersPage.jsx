import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Modal, Form, Table, FormText } from 'react-bootstrap';
import authService from './api-authorization/AuthorizeService'
import { FileDrop } from 'react-file-drop';
import MDEditor from '@uiw/react-md-editor';
import '../custom.css'
import './Drop.css';

export function ChaptersPage() {

    const [show, setShow] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [chapterBody, setChapterBody] = useState('');
    const [chapter, setChapter] = useState({
        pictureUrl: '',
        swapId:'',
        chapterNumber:'',
        funСompositionId: '',
        name: '',
        body: '',
        nextId: '',
        previousId: '',
    });

    const initialChapterState = {
        pictureUrl: '',
        swapId:'',
        chapterNumber:'',
        funСompositionId: '',
        name: '',
        body: '',
        nextId: '',
        previousId: '',
    }

    useEffect(() => { populateChapters() }, []);

    useEffect(() => {
        if (isUpdate) {
            setChapter({ ...chapter, swapId: chapters[chapter.chapterNumber - 1].id });
        }
    }, [chapter.chapterNumber, chapterBody]);

    useEffect(() => {
        setChapter({ ...chapter, body: chapterBody });
    }, [chapterBody]);


    async function populateChapters() {
        const response = await fetch('chapters/' + localStorage.getItem('compositionId'), {
        });
        const data = await response.json();
        console.log(data)
        if(data.length == 0) {
            setIsVisible(false);
        } else {
            setChapters(sortChapters(data));
            setIsVisible(true);
        }
    };

    function sortChapters(data) {
        const sortedChapters = [];
        sortedChapters.push(data.find(obj => {
            return obj.previousId == null;
        }));
        for (let index = 0; index < data.length - 1; index++) {
            sortedChapters.push(data.find(obj => {
                return obj.id == sortedChapters[index].nextId;

            }));
        }
        return sortedChapters
    }

    async function createChapter(dataChapter) {
        dataChapter.funСompositionId = localStorage.getItem('compositionId');
        const token = await authService.getAccessToken();
        dataChapter = JSON.stringify(dataChapter);
        const response = await fetch('chapters', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dataChapter,
        });
        await response;
        populateChapters();
    };

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

    const handleDelete = e => {
        deleteChapter(e.target.value);
        setIsVisible(false);
        populateChapters();
    }

    const onInput = (e) => {
        const { name, value } = e.target;
        setChapter({
            ...chapter, [name]: value
        });
        console.log(value)
    }

    const handleClose = () => {
        setShow(false)
        setIsUpdate(false)
        setChapter(initialChapterState);
    };

    const handleShow = e => {
        // eslint-disable-next-line eqeqeq
        if (!e.target.value == '') {
            // eslint-disable-next-line eqeqeq
            const chapter = chapters.find(f => f.id == e.target.value);
            setChapter(chapter);
            setChapter({...chapter, chapterNumber: chapters.indexOf(chapter)+1});
            setChapterBody(chapter.body);
            setIsUpdate(true);
            console.log(chapter);
        }
        setShow(true);
    }

    const onFormSubmit = e => {
        e.preventDefault()
        console.log(chapterBody)
        setChapter({...chapter, body: chapterBody});
        if (isUpdate) {
            
            updateChapter(chapter);
            setIsUpdate(false);
        }
        else {
            createChapter(chapter);
        }
        setShow(false);
        setChapter(initialChapterState);
        setChapterBody('');
    }

    async function uploadPicture(uploadData) {
        const response = await fetch('https://api.cloudinary.com/v1_1/dynsyqrv3/image/upload', {
            method: 'post',
            body: uploadData
        });
        const data = await response.json();
        setChapter({ ...chapter, pictureUrl: data.secure_url })
    }

    const uploadImage = (files) => {
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'funFiction')
        data.append('cloud_name', 'dynsyqrv3')
        uploadPicture(data)
    }

    return (
        <div className='App'>
            <FormText style={{ fontSize: '250%', textAlign: 'center' }}>
                {localStorage.getItem('compositionName')}
            </FormText>
            <ButtonGroup>
                <Button variant='secondary' size='sm' onClick={handleShow} value=''>
                    Add Chapter
                </Button>
            </ButtonGroup>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group role='form'>
                            {isUpdate == true &&
                                <h2>
                                    <Form.Label>Chapter Number</Form.Label>
                                    <Form.Control
                                        defaultValue={chapter.chapterNumber}
                                        type='number'
                                        onChange={onInput}
                                        name='chapterNumber'
                                    />
                                </h2>
                            }
                            <Form.Label>Chapter Name</Form.Label>
                            <Form.Control
                                defaultValue={chapter.name}
                                type='text'
                                onChange={onInput}
                                name='name'
                            />
                            <Form.Label>Picture</Form.Label>
                            <FileDrop
                                onDrop={(files, event) => { uploadImage(files) }}
                            >
                                Drop picture here!
                            </FileDrop>
                            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: 'auto'}}>
                                <img style={{ height:'100%', width:'100%' }} src={chapter.pictureUrl} />
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
                        <Button variant='secondary' type='submit' onClick={onFormSubmit}>
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Table striped bordered hover size='sm'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Chapter Name</th>
                        <th>Picture</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isVisible == true && chapters.map((chapter, index) => {
                            return (
                                <tr key={chapter.id}>
                                    <td>{index + 1}</td>
                                    <td>{chapter.name}</td>
                                    <td>
                                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height:'100px'}}>
                                            <img style={{ height:'100%', width:'auto', margin: '3px' }} src={chapter.pictureUrl} />
                                        </div>
                                    </td>
                                    <td>
                                        <Button variant='secondary' size='sm' onClick={handleShow} value={chapter.id}>
                                            Edit
                                        </Button>
                                        <Button variant='secondary' size='sm' onClick={handleDelete} value={chapter.id}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
}
