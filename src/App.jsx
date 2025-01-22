import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import ActivityFeed from './components/ActivityFeed/ActivityFeed.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bottom from './components/Bottom/Bottom.jsx';
import DialPad from './components/Bottom/DialPad.jsx';

const App = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [inboxCallCount, setInboxCallCount] = useState(0);
  const [showDialPad, setShowDialPad] = useState(false); // State to manage DialPad visibility
  
  const handleDialPadShow = () => setShowDialPad(true);
  const handleDialPadClose = () => setShowDialPad(false);

  return (
      <Router>
        <div className='container'>
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="container-view">
            <Routes>
              <Route path="/" element={<ActivityFeed activeTab={activeTab} 
              setInboxCallCount={setInboxCallCount}/>} />
              {/* <Route path="/call/:id" element={<CallDetail />} /> */}
              {/* <Route path="/archive" element={<Archive />} /> */}
            </Routes>
            <DialPad show={showDialPad} onHide={handleDialPadClose} />
          </div>
          <Bottom inboxCallCount={inboxCallCount} onDialPadShow={handleDialPadShow}/>
        </div>
      </Router>
  );
};

export default App;
