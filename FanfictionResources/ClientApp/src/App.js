import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AdminPage } from './components/AdminPage';
import { Profile } from './components/Profile';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'
import { ChaptersPage } from './components/ChaptersPage';
import { Read } from './components/Read';
import { BookMarks } from './components/BookMarks';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <AuthorizeRoute exact path='/admin-page' component={AdminPage} />
        <AuthorizeRoute exact path='/profile' component={Profile} />
        <Route exact path='/read' component={Read} />
        <AuthorizeRoute exact path='/bookmarks' component={BookMarks} />
        <AuthorizeRoute exact path='/allchapters' component={ChaptersPage} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
