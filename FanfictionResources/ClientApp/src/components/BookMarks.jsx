import React, { useEffect, useState } from 'react';
import { Button, Card, CardDeck, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService';

export function BookMarks () {
  
  const [bookmarks, setBookmarks] = useState([]);
  const [books, setBooks] = useState([]);
  const [isRead, setIsRead] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [compositionId, setCompositionId] = useState('');

  useEffect(() => { populateBookMarks(); }, []);

  useEffect(() => {
    localStorage.setItem('compositionId', compositionId);
}, [compositionId, redirect]);

  async function populateBookMarks() {
    const token = await authService.getAccessToken();
    const user = await authService.getUser();
    const response = await fetch('compositions/bookmarks/'+ user.id, {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
      });
    const data = await response.json();
    console.log(data);
    setBookmarks(data);
    let compositions = [];
    if(data.length>0) data.forEach(element => {
      compositions.push(element.funСomposition);
    });
    console.log(compositions)
    setBooks(compositions)
  };

  const handleRead = (e) => {
    setCompositionId(e.target.value);
    setRedirect(true);
    setIsRead(true);
  }

  const handleDeleteBookMark = (e) => {
    deleteBookMark(e.target.value)
  }
  async function deleteBookMark(data) {
    const token = await authService.getAccessToken();
    data = JSON.stringify(data);
    const response = await fetch('compositions/bookmarks/', {
        method: 'DELETE',
        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: data,
    });
    await response;
    populateBookMarks();
  }

  if (isRead) {
    return <Redirect to={{ pathname: '/read'}} />
   }

  return (
    <>
      <h3>Bookmarks</h3>

      <CardDeck>
        {
          books.slice(0, 5).map((book) => {
            return (
              <Card key={book.id}>
                <Card.Img variant="top" src={book.pictureUrl} />
                <Card.Body>
                  <Card.Title>{book.name}</Card.Title>
                  <Card.Text>
                    {book.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                <Container>
                      <Button variant='secondary' value = {book.id} onClick={handleRead}>Read</Button>
                      <Button variant='secondary' value = {book.id} onClick={handleDeleteBookMark}>Delete</Button>
                </Container>
                </Card.Footer>
              </Card>
            );
          })
        }
      </CardDeck>
    </>
  );

}
