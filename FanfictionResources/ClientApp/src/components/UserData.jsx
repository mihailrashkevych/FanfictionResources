import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import InlineEdit from 'react-edit-inplace';
import authService from './api-authorization/AuthorizeService'
import { FileDrop } from 'react-file-drop';
import { Button, Container } from 'react-bootstrap';
import 'react-edit-text/dist/index.css';

export function UserData(props) {

  const [user, setUser] = useState({
    id:'',
    name: '',
    pseudonym: '',
    photo: '',
    birthday: '',
    aboutSelf: ''
  })

  useEffect(() => {
    populateUserData()
  }, []);  

  async function populateUserData() {
    const token = await authService.getAccessToken();
    let id;
    if (props.userId !== undefined) {
      id = props.userId.id;
    } else {
      const user = await authService.getUser();
      id = user.id;
    }
    const response = await fetch('users/' + id, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  async function updateUserData(dataUser) {
    const token = await authService.getAccessToken();
    console.log(dataUser)
    dataUser = JSON.stringify(dataUser);
    const response = await fetch('users', {
      method: 'PUT',
      headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: dataUser
    });
    await response;
    populateUserData();
  };

  const onInput = (dataUser) => {

    const dataKey = Object.keys(dataUser)[0];
    const dataValue = Object.values(dataUser)[0];
      setUser({
          ...user, [dataKey]: dataValue
      });
    console.log(dataUser)
  }

  async function uploadPicture(uploadData) {
    const response = await fetch('https://api.cloudinary.com/v1_1/dynsyqrv3/image/upload', {
        method: 'post',
        body: uploadData
    });
    const data = await response.json();
    setUser({ ...user, photo: data.secure_url })
}

const uploadImage = (files) => {
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'funFiction')
    data.append('cloud_name', 'dynsyqrv3')
    uploadPicture(data)
}
const handleSave = () =>{
  updateUserData(user);
}

  return (
    <div>
      <Table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
            <InlineEdit
              activeClassName="editing"
              text={user.name}
              paramName="name"
              change={onInput}
            />
            </td>
          </tr>
          <tr>
            <td>Pseudonym</td>
            <td>
            <InlineEdit
              activeClassName="editing"
              text={user.pseudonym}
              paramName="pseudonym"
              change={onInput}
            />
            </td>
          </tr>
          <tr>
            <td>Photo</td>
            <td>
              <FileDrop
                onDrop={(files, event) => { uploadImage(files) }}
              >
                Drop photo here!
              </FileDrop>
              <div style={{display: 'flex', height:'200px'}}>
                <img style={{ height:'100%', width:'auto', margin: '3px' }} src={user.photo} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Birthday</td>
          <td>
          <InlineEdit
              activeClassName="editing"
              text={user.birthday}
              paramName="birthday"
              change={onInput}
            />
            </td>
          </tr>
          <tr>
          <td>AboutSelf</td>
          <td>
          <InlineEdit
              activeClassName="editing"
              text={user.aboutSelf}
              paramName="aboutSelf"
              change={onInput}
            />
            </td>
          </tr>
        </tbody>
      </Table>
      <Container><Button variant ='secondary' onClick = {handleSave}>Save</Button></Container>
    </div>
  );
}
