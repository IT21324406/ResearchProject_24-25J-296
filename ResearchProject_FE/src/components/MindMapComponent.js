import React, { useState, useRef, useEffect } from 'react';
import './MindMapComponent.css';

const MindMapComponent = () => {
  const [mindMapData, setMindMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const generateMindMap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current tab URL using Chrome API
      let currentTabUrl = '';
      if (chrome.tabs) {
        const [tab] = await new Promise(resolve => {
          chrome.tabs.query({active: true, currentWindow: true}, resolve);
        });
        currentTabUrl = tab.url;
      } else {
        // Fallback for development
        currentTabUrl = window.location.href;
      }

      const response = await fetch('http://localhost:8000/mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentTabUrl }),
      });
      
      if (!response.ok) throw new Error('Failed to generate mind map');
      
      const data = await response.json();
      setMindMapData(data.mindmap);
    } catch (err) {
      setError(err.message);
      console.error('Error generating mind map:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNodes = () => {
    if (!mindMapData) return null;

    const containerWidth = containerRef.current?.offsetWidth || 600;
    const containerHeight = containerRef.current?.offsetHeight || 500;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;

    return (
      <div className="mindmap-container" ref={containerRef}>
        {/* Central Topic */}
        <div 
          className="central-topic"
          style={{
            left: centerX,
            top: centerY,
          }}
        >
          {mindMapData.topic}
        </div>

        {/* Parent and Child Nodes */}
        {mindMapData.nodes.map((node, index) => {
          const angle = (index * 2 * Math.PI) / mindMapData.nodes.length;
          const parentX = centerX + radius * Math.cos(angle);
          const parentY = centerY + radius * Math.sin(angle);

          return (
            <React.Fragment key={`node-${index}`}>
              {/* Line from center to parent */}
              <svg className="connection-line" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={parentX}
                  y2={parentY}
                  stroke="#90caf9"
                  strokeWidth="2"
                />
              </svg>

              {/* Parent Node */}
              <div 
                className="parent-node"
                style={{
                  left: parentX,
                  top: parentY,
                }}
              >
                {node.parent}
              </div>

              {/* Children Nodes */}
              {node.children.map((child, childIndex) => {
                const childAngle = angle + (childIndex * 0.2 - (node.children.length * 0.1));
                const childRadius = radius * 0.5;
                const childX = parentX + childRadius * Math.cos(childAngle);
                const childY = parentY + childRadius * Math.sin(childAngle);

                return (
                  <React.Fragment key={`child-${index}-${childIndex}`}>
                    {/* Line from parent to child */}
                    <svg className="connection-line" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                    }}>
                      <line
                        x1={parentX}
                        y1={parentY}
                        x2={childX}
                        y2={childY}
                        stroke="#bbdefb"
                        strokeWidth="1.5"
                        strokeDasharray="3,2"
                      />
                    </svg>

                    {/* Child Node */}
                    <div
                      className="child-node"
                      style={{
                        left: childX,
                        top: childY,
                      }}
                    >
                      <span className="verb">{child.verb}</span>
                      <span className="child">{child.child}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mindmap-component">
      {!mindMapData && !isLoading && (
        <button 
          onClick={generateMindMap} 
          className="generate-button"
          disabled={isLoading}
        >
          Generate Mind Map
        </button>
      )}
      
      {isLoading && <div className="loading">Generating mind map...</div>}
      
      {error && (
        <div className="error">
          {error}
          <button onClick={generateMindMap} className="retry-button">
            Try Again
        </button>
        </div>
      )}
      
      {mindMapData && renderNodes()}
    </div>
  );
};

export default MindMapComponent;