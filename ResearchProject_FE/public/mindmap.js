// Get mind map data from URL parameters
let currentZoom = 1;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

function updateZoomLevel() {
  const zoomLevel = document.getElementById('zoomLevel');
  zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
}

function zoomIn() {
  if (currentZoom < MAX_ZOOM) {
    currentZoom += ZOOM_STEP;
    applyZoom();
  }
}

function zoomOut() {
  if (currentZoom > MIN_ZOOM) {
    currentZoom -= ZOOM_STEP;
    applyZoom();
  }
}

function resetZoom() {
  currentZoom = 1;
  applyZoom();
}

function applyZoom() {
  const container = document.getElementById('mindmapContainer');
  container.style.transform = `scale(${currentZoom})`;
  updateZoomLevel();
}

async function exportAsImage(format) {
  const container = document.getElementById('mindmapContainer');
  const originalTransform = container.style.transform;
  const originalZoom = currentZoom;
  
  try {
    // Reset zoom for export
    currentZoom = 1;
    container.style.transform = 'scale(1)';
    
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Capture the visible tab
    const dataUrl = await new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab(tab.windowId, { format: format }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(dataUrl);
        }
      });
    });

    // Use chrome.downloads API to save the file
    await new Promise((resolve, reject) => {
      chrome.downloads.download({
        url: dataUrl,
        filename: `mindmap.${format}`,
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(downloadId);
        }
      });
    });

  } catch (error) {
    console.error('Detailed export error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    alert(`Failed to export image: ${error.message}`);
  } finally {
    // Restore original zoom
    currentZoom = originalZoom;
    container.style.transform = originalTransform;
    updateZoomLevel();
  }
}

async function exportAsPDF() {
  const container = document.getElementById('mindmapContainer');
  const originalTransform = container.style.transform;
  const originalZoom = currentZoom;
  
  try {
    // Reset zoom for export
    currentZoom = 1;
    container.style.transform = 'scale(1)';
    
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Capture the visible tab as PNG first
    const dataUrl = await new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(dataUrl);
        }
      });
    });

    // Create a temporary image to get dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Mind Map PDF</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              img {
                width: 100%;
                height: auto;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Mind Map">
        </body>
      </html>
    `);
    
    // Wait for content to load
    printWindow.document.close();
    printWindow.focus();
    
    // Print the window
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing
      setTimeout(() => printWindow.close(), 1000);
    }, 500);

  } catch (error) {
    console.error('Detailed PDF export error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    alert(`Failed to export PDF: ${error.message}`);
  } finally {
    // Restore original zoom
    currentZoom = originalZoom;
    container.style.transform = originalTransform;
    updateZoomLevel();
  }
}

function setupControls() {
  document.getElementById('zoomIn').addEventListener('click', zoomIn);
  document.getElementById('zoomOut').addEventListener('click', zoomOut);
  document.getElementById('resetZoom').addEventListener('click', resetZoom);
  document.getElementById('exportPNG').addEventListener('click', () => exportAsImage('png'));
  document.getElementById('exportJPEG').addEventListener('click', () => exportAsImage('jpeg'));
  document.getElementById('exportPDF').addEventListener('click', exportAsPDF);
}

function renderMindMap() {
  console.log('renderMindMap function called');
  
  const container = document.getElementById('mindmapContainer');
  console.log('Container element:', container);
  
  if (!container) {
    console.error('Mind map container not found');
    return;
  }

  // Get data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const mindMapDataParam = urlParams.get('data');
  console.log('URL parameters:', mindMapDataParam);

  if (!mindMapDataParam) {
    console.error('No mind map data found in URL parameters');
    return;
  }

  const mindMapData = JSON.parse(decodeURIComponent(mindMapDataParam));
  console.log('Parsed mind map data:', mindMapData);
  
  if (!mindMapData) {
    console.error('Failed to parse mind map data');
    return;
  }

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  console.log('Container dimensions:', { width: containerWidth, height: containerHeight });
  
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = Math.min(containerWidth, containerHeight) * 0.35;

  // Create central topic
  const centralTopic = document.createElement('div');
  centralTopic.className = 'central-topic';
  centralTopic.style.left = centerX + 'px';
  centralTopic.style.top = centerY + 'px';
  centralTopic.textContent = mindMapData.topic;
  container.appendChild(centralTopic);
  console.log('Central topic created:', mindMapData.topic);

  // Create parent and child nodes
  mindMapData.nodes.forEach((node, index) => {
    console.log('Creating node:', node);
    const angle = (index * 2 * Math.PI) / mindMapData.nodes.length;
    const parentX = centerX + radius * Math.cos(angle);
    const parentY = centerY + radius * Math.sin(angle);

    // Create line from center to parent
    const parentLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    parentLine.setAttribute('class', 'connection-line');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerX);
    line.setAttribute('y1', centerY);
    line.setAttribute('x2', parentX);
    line.setAttribute('y2', parentY);
    line.setAttribute('stroke', '#90caf9');
    line.setAttribute('stroke-width', '2');
    parentLine.appendChild(line);
    container.appendChild(parentLine);

    // Create parent node
    const parentNode = document.createElement('div');
    parentNode.className = 'parent-node';
    parentNode.style.left = parentX + 'px';
    parentNode.style.top = parentY + 'px';
    parentNode.textContent = node.parent;
    container.appendChild(parentNode);
    console.log('Parent node created:', node.parent);

    // Create child nodes
    node.children.forEach((child, childIndex) => {
      console.log('Creating child node:', child);
      const childAngle = angle + (childIndex * 0.2 - (node.children.length * 0.1));
      const childRadius = radius * 0.5;
      const childX = parentX + childRadius * Math.cos(childAngle);
      const childY = parentY + childRadius * Math.sin(childAngle);

      // Create line from parent to child
      const childLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      childLine.setAttribute('class', 'connection-line');
      const childLineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      childLineElement.setAttribute('x1', parentX);
      childLineElement.setAttribute('y1', parentY);
      childLineElement.setAttribute('x2', childX);
      childLineElement.setAttribute('y2', childY);
      childLineElement.setAttribute('stroke', '#bbdefb');
      childLineElement.setAttribute('stroke-width', '1.5');
      childLineElement.setAttribute('stroke-dasharray', '3,2');
      childLine.appendChild(childLineElement);
      container.appendChild(childLine);

      // Create child node
      const childNode = document.createElement('div');
      childNode.className = 'child-node';
      childNode.style.left = childX + 'px';
      childNode.style.top = childY + 'px';
      
      const verbSpan = document.createElement('span');
      verbSpan.className = 'verb';
      verbSpan.textContent = child.verb;
      
      const childSpan = document.createElement('span');
      childSpan.className = 'child';
      childSpan.textContent = child.child;
      
      childNode.appendChild(verbSpan);
      childNode.appendChild(childSpan);
      container.appendChild(childNode);
      console.log('Child node created:', child.child);
    });
  });

  // Setup controls after rendering
  setupControls();
}

// Wait for the DOM to be fully loaded
console.log('Script loaded, waiting for DOM...');
window.addEventListener('load', () => {
  console.log('DOM loaded, calling renderMindMap...');
  renderMindMap();
}); 