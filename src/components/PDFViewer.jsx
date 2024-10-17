import React, { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';

GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfViewer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdf = await getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport,
        };
        page.render(renderContext);
      } catch (err) {
        setError('Failed to load PDF.');
        console.error('Error loading PDF:', err);
      }
    };

    if (pdfUrl) {
      loadPdf();
    }
  }, [pdfUrl]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PdfViewer;
