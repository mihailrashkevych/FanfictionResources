import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';

export function Home () {
  
  const [lastCreated, setLastCreated] = useState([])
  const [lastModified, setLastModified] = useState([])

  useEffect(() => { populateCompositions() }, []);

  async function populateCompositions() {
    const response = await fetch('home/last-modified');
    const data = await response.json();
    console.log(data);
    setLastModified(data);
  };

  return (
    <>
      {
        lastModified.map((composition) => {
          return (
            <Carousel key = {composition.id}>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={composition.pictureUrl}
                  alt={composition.name}
                />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>

          );
        })
      }
    </>
  );

}
