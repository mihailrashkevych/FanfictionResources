import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import EditableLabel from 'react-inline-editing';
import authService from './api-authorization/AuthorizeService'
import 'react-edit-text/dist/index.css';

export function UserData(props) {

  const [user, setUser] = useState({
    name: '',
    pseudonym: '',
    photo: '',
    birthday: '',
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
    const response = await fetch('admin/' + id, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const onInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  }

  return (
    <div>
      <Table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <EditableLabel 
              value={user.name}
              text={user.name}
                // onFocus={this._handleFocus}
                // onFocusOut={this._handleFocusOut}
              />
            </td>
          </tr>
          <tr>
            <td>Pseudonym</td>
            <td>{user.pseudonym}</td>
          </tr>
          <tr>
            <td>Photo</td>
            <td>{user.photo}</td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>{user.birthday}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
