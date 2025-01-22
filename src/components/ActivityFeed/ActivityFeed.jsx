import React, { useState, useEffect, useRef } from 'react';
import { useArchive } from '../../hooks/useArchive';
import { useFetchCalls } from '../../hooks/useFetchCalls';
import { useFilteredCalls } from '../../hooks/useFilteredCalls';
import { useSortedCalls } from '../../hooks/useSortedCalls';
import '../../css/activityfeed.css';
import CallItem from './CallItem.jsx';
import CallDetail from './CallDetail.jsx';
import { Spinner, Button } from 'react-bootstrap';

const ActivityFeed = ({ activeTab }) => {
  const [expandedCallId, setExpandedCallId] = useState(null);
  const { calls, setCalls, loading, error, fetchCalls } = useFetchCalls();
  const { archiveCall, archiveAll, unarchiveAll } = useArchive(calls, setCalls);
  const sortedCalls = useSortedCalls(activeTab === 'archived' ? 
    calls.filter(call => call.is_archived) : 
    calls
  );
  const filteredCalls = useFilteredCalls(calls, activeTab);
  const [showTopLink, setShowTopLink] = useState(false);
  const containerRef = useRef(null);
  //check if container is scrolled away from the top

  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    const container = containerRef.current;
    scrollTimeout = setTimeout(() => {
      if (container.scrollTop > 0) {
        setShowTopLink(true);
      } else {
        setShowTopLink(false);
      }
    }, 200); // Adjust the timeout as needed
  };

  const handleExpand = (callId) => {
    setExpandedCallId(prevId => prevId === callId ? null : callId);
  };

   useEffect(() => {
    // Make sure that the element exists before setting up the IntersectionObserver
    const container = document.querySelector('.container-view');

    if (container) {
      // Create the IntersectionObserver
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Check if the top of the container is scrolled
          if (entry.boundingClientRect.top < 0) {
            setShowTopLink(true); // Show "Back to top" link if scrolled
          } else {
            setShowTopLink(false); // Hide the link when at the top
          }
        },
        {
          root: null, // Observe relative to the viewport
          threshold: 0, // Trigger when any part of the element is visible
        }
      );

      // Observe the container element
      observer.observe(container);

      // Cleanup the observer when the component unmounts
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Reset expandedCallId when activeTab changes
  useEffect(() => {
    setExpandedCallId(null);
  }, [activeTab]);

  // Archive single call
  const handleArchiveToggle = (callId, event) => {
    event.stopPropagation();
    archiveCall(callId);
  };

  // Archive all calls
  const handleArchiveAll = () => {
    archiveAll(filteredCalls);
  };

  // Unarchive all calls
  const handleUnarchiveAll = () => {
    unarchiveAll(filteredCalls);
  };

  // Function to scroll to the top of the container
  const scrollToTop = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    const container = document.querySelector('.container-view'); // Replace with your actual container class or ID
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll the container to the top
    }
  };


  if (loading) {
    return (
      <div>
        <Spinner animation="border" variant="success" 
        className="position-absolute top-50 start-50"
        />
      </div>
    );
  }  
  
  if (error) {
    return (
      <div className="error-message">
        Error loading calls: {error}
        <button onClick={fetchCalls}>Retry</button>
      </div>
    );
  }

  return (
    <div ref={containerRef} 
    className="activity-feed" style={{ position: 'relative' }}
    onScroll={handleScroll}>
      {activeTab !== 'archived' && filteredCalls.length > 0 && (
        <Button  
          variant="outline-primary"
          size="sm"
          onClick={handleArchiveAll}
        >
          <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            archive
          </span>
          Archive All
        </Button>
      )}

      {activeTab === 'archived' && filteredCalls.length > 0 && (
        <Button  
          variant="outline-warning"
          size="sm"
          onClick={handleUnarchiveAll}
        >
          <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            restore
          </span>
          Unarchive
        </Button>
      )}

      <div className="calls-container">
        {filteredCalls.length === 0 ? (
          <div className="no-calls">
            No {activeTab} calls 
            <Button variant="primary" size="sm" className="ms-2" onClick={fetchCalls}>
              Refresh
            </Button>
          </div>
        ) : (
          Object.entries(sortedCalls).map(([date, dateGroup]) => {
            const filteredGroup = dateGroup.filter(call => {
              if (activeTab === 'archived') {
                return call.is_archived;
              } else {
                if (activeTab === 'all') return !call.is_archived;
                return !call.is_archived && 
                  (call.call_type === 'missed' || call.call_type === 'voicemail');
              }
            });

            if (filteredGroup.length === 0) return null;

            return (
              <div key={date} className="date-group">
                <div className="date-header">{date}</div>
                {filteredGroup.map((call) => (
                  <div key={`${call.id}-${date}`} className="call-container">
                    <CallItem 
                      call={call}
                      onArchiveToggle={handleArchiveToggle}
                      onClick={() => handleExpand(call.id)} // Toggle expand/collapse on click
                      activeTab={activeTab}
                    />
                    {expandedCallId === call.id && (
                      <CallDetail call={call} onArchiveToggle={handleArchiveToggle} activeTab={activeTab} />
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Back to Top Link */}
      {showTopLink && (
        <a className="top-link" href="#" id="js-top" onClick={scrollToTop}>
          <span className="material-icons">arrow_upward</span>
          <span className="screen-reader-text">Back to top</span>
        </a>
      )}
    </div>
  );
};

export default ActivityFeed;
