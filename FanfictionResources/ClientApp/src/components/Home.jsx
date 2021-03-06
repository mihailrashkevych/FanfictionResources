import React, { useEffect, useState } from 'react';
import { Button, Card, CardDeck, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService';

export function Home () {
  
  const [lastCreated, setLastCreated] = useState([])
  const [lastModified, setLastModified] = useState([])
  const [isRead, setIsRead] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [compositionId, setCompositionId] = useState('');

  useEffect(() => { populateLatestCompositions(); populateNewsCompositions(); }, []);

  useEffect(() => {
      localStorage.setItem('compositionId', compositionId);
  }, [compositionId, redirect]);

  async function populateLatestCompositions() {
    const response = await fetch('home/last-modified');
    const data = await response.json();
    console.log(data);
    setLastModified(data);
  };

  async function populateNewsCompositions() {
    const response = await fetch('home/last-created');
    const data = await response.json();
    console.log(data);
    setLastCreated(data);
  };

  const handleRead = (e) => {
    setCompositionId(e.target.value);
    setRedirect(true);
    setIsRead(true);
  }

  const handleAddBookMark = (e) => {
    const composition = lastModified.find(x=>{return x.id == e.target.value})
    AddBookMark(composition)
  }

  async function AddBookMark(composition) {
    const token = await authService.getAccessToken();
    composition = JSON.stringify(composition);
    const response = await fetch('compositions/bookmarks/', {
      method: 'POST',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: composition,
    });
  };

  if (isRead) {
    return <Redirect to={{ pathname: '/read'}} />
   }

  return (
    <>
      <h1>Renewal</h1>

      <CardDeck>
        {
          lastModified.slice(0, 5).map((composition) => {
            return (
              <Card key={composition.id}>
                <Card.Img variant="top" src={composition.pictureUrl} />
                <Card.Body>
                  <Card.Title>{composition.name}</Card.Title>
                  <Card.Text>
                    {composition.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Container>
                    <Button variant='secondary' value = {composition.id} onClick={handleRead}>Read</Button>
                    <Button variant='secondary' value = {composition.id} onClick={handleAddBookMark}>Bookmark</Button>
                  </Container>
                </Card.Footer>
              </Card>
            );
          })
        }
      </CardDeck>
      <p></p>
      <CardDeck>
        {
          lastModified.slice(5, 10).map((composition) => {
            return (
              <Card key={composition.id} value = {composition.id} onClick = {handleRead}>
                <Card.Img variant="top" src={composition.pictureUrl} />
                <Card.Body>
                  <Card.Title>{composition.name}</Card.Title>
                  <Card.Text>
                    {composition.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Container><Button variant='secondary' value = {composition.id} onClick={handleRead}>Read</Button></Container>
                </Card.Footer>
              </Card>
            );
          })
        }
      </CardDeck>
      <p></p>
    </>
  );

}
