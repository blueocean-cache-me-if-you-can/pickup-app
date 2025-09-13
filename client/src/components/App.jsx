import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<div>Hello World</div>} />
                <Route path='/login' element={<div>Login</div>} />
                <Route path='/signup' element={<div>Signup</div>} />
                <Route path='/profile' element={<div>Profile</div>} />
                <Route path='/events' element={<div>Events</div>} />
            </Routes>
        </Router>
    );
};

export default App;