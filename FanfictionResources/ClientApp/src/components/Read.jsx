import React, { useState, useEffect } from 'react';
import {Col, Row, Tab, FormText, Button, Image, Jumbotron, Container, ListGroup} from 'react-bootstrap'
import authService from './api-authorization/AuthorizeService'
import MDEditor from '@uiw/react-md-editor';

export function Read() {

    const [chapters, setChapters] = useState([])
    const [chapter, setChapter] = useState({
        pictureUrl: '',
        name: '',
        body: '',
        nextId: '',
        previousId: '',
    })
    
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

    useEffect(() => { populateChapters(); populateComposition()}, []);

    async function populateComposition() {
        const response = await fetch('compositions/composition/' + localStorage.getItem('compositionId'), {
        });
        const data = await response.json();
        console.log(data)
        setComposition(data);
    };
       
    async function populateChapters() {
        const response = await fetch('chapters/' + localStorage.getItem('compositionId'), {
        });
        const data = await response.json();
        setChapters(sortChapters(data));
        populateChapter(data[0].id);
    };

    async function populateChapter(id) {
        const response = await fetch('chapters/chapter/' + id, {
        });
        const data = await response.json();
        setChapter(data);
    };

    const handleGetChapter =(e)=>{
        populateChapter(e.target.value)
    }

    const handlePrevious =()=>{
        const chapterPrevious = chapters.find(obj => {
            return obj.id == chapter.previousId;
          });
        setChapter(chapterPrevious);
    }
    const handleNext =()=>{
        const chapterNext = chapters.find(obj => {
            return obj.id == chapter.nextId;
          });
          console.log(chapterNext)
        setChapter(chapterNext);
    }
    
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

    return (
        <div>
                <Container>
                    <h1 style={{ textAlign: 'center' }}>{localStorage.getItem('compositionName')}</h1>
                    <p>
                        
                    </p>
                </Container>
            <Image src={composition.pictureUrl} rounded />
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>                      
                        {
                            chapters.map((chapter, index) => {
                                    return (
                                        <Container>
                                            <ListGroup defaultActiveKey={chapter.id}>
                                                <ListGroup.Item action onClick={handleGetChapter} value={chapter.id}>
                                                    {index + 1}.{chapter.name}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Container>
                                    );
                                })
                        }
                    </Col>
                    <Col sm={9}>
                        <Jumbotron fluid>
                            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                <Image style={{ height: '100%', width: 'auto', margin: '3px' }} src={chapter.pictureUrl} rounded />
                                <h1>
                                    {chapter.name}
                                </h1>
                            </Container>
                        </Jumbotron>

                            <MDEditor.Markdown source={chapter.body} />

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
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
