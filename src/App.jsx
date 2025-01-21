import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import ActivityFeed from './components/ActivityFeed/ActivityFeed.jsx';
import CallDetail from './components/ActivityFeed/CallDetail.jsx';
import Archive from './components/Archive/Archive.jsx';

const App = () => {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <Router>
      <div className='container'>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="container-view">
          <Routes>
            <Route path="/" element={<ActivityFeed activeTab={activeTab} />} />
            <Route path="/call/:id" element={<CallDetail />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
