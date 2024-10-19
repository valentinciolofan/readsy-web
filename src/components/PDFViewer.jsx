import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Import for annotations and text layer
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Import for text layer

// Set the workerSrc to a valid URL
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0); // State to manage zoom level

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => {
    setScale(scale + 0.2); // Increase scale by 0.2
  };

  const zoomOut = () => {
    if (scale > 0.6) setScale(scale - 0.2); // Decrease scale by 0.2 but keep it above a minimum value
  };

  return (
    <div className="pdf-container">
      <div className="pdf-controls">
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={zoomIn}>Zoom In</button>
      </div>

      <Document
        file="/1.pdf"  
        onLoadSuccess={onDocumentLoadSuccess}
        className="react-pdf__Document"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page 
            key={`page_${index + 1}`} 
            pageNumber={index + 1} 
            className="react-pdf__Page" 
            renderTextLayer={true}  
            renderAnnotationLayer={true} 
            scale={2.6} // Pass scale to adjust the zoom level
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
