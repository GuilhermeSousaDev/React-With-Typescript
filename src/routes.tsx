import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Home from './pages/Home';
import CreateLocation from './pages/CreateLocation';

const Routes = () => {
    return(
        <Router>
            <Route component={Home} exact path="/" />
            <Route component={CreateLocation} exact path="/create-location" />
        </Router>
    )
}

export default Routes;