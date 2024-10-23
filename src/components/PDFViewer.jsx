import React, { useEffect, useRef, useState } from "react";
import * as PDFJS from "pdfjs-dist";
import { TextLayer } from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
const pdfUrl = '/1.pdf';

const PdfViewer = () => {
  const canvasRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [scalePdf, setScalePdf] = useState(1);

  useEffect(() => {
    // Setting loading state untill the pdf is loaded.

    // Load pdf file
    const loadPDF = async (pdf_url) => {
      const pdf_doc = await PDFJS.getDocument({ url: pdf_url }).promise;

      if (pdf_doc !== null) {
        setPdfDoc(pdf_doc);
        setTotalPages(pdf_doc.numPages);

        // Call the function to show the pdf document.
        showPDF();
      }
    }

    loadPDF(pdfUrl);
  }, [pdfUrl]);

  const renderPages = async (pagesNr) => {
    // Get the container where the canvas and text layer will render
    const pagesContainer = pagesContainerRef.current;
    // Iterate through the number of pages and render them.
    for (let i = 1; i <= pagesNr; i++) {
      const pdfLoader = document.createElement('div');
      pdfLoader.setAttribute("id", i);
      pdfLoader.className = 'pdf-loader';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const renderPage = async (pages_Nr) => {

        // Fetch the page
        const page = await pdfDoc.getPage(i);

        // Get viewport of the page at required scale
        let viewport = page.getViewport({
          scale: scalePdf,
        });

        // Set canvas height
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Render the page contents in the canvas.
        await page.render(renderContext)

        // After the page is rendered, append the canvas.
        pdfLoader.appendChild(canvas);

        // Get text contents of the page after the pdf has been rendered in the canvas.
        const textContent = await page.getTextContent();

        await renderTextLayer(textContent, viewport);

      }
      const renderTextLayer = async (textContent, viewport) => {
        // Get canvas offset
        const canvasOffSet = canvas.getBoundingClientRect();
        // Assign the CSS created to the text-layer element
        const textLayerElement = document.createElement('div');
        textLayerElement.className = 'textLayer';
        textLayerElement.style.setProperty('--scale-factor', viewport.scale);
        textLayerElement.style.left = `${canvas.left}px`;
        textLayerElement.style.top = `${canvas.top}px`;

        // Pass the data to the method for rendering of text over the pdf canvas.
        const createTextLayer = new TextLayer({
          textContentSource: textContent,
          container: textLayerElement,
          viewport: viewport,
        });
        await createTextLayer.render();
        pdfLoader.appendChild(textLayerElement);
        pagesContainer.appendChild(pdfLoader);

        // After everything is rendered setLoading to false
      }
      await renderPage(i);
    }
  }

  // After pdf is loaded, set loading to false 
  const showPDF = async () => {
    if (pdfDoc) {
      await renderPages(totalPages);
    }
  }

  // Handle zoom in and out
  const handleZoomIn = () => {
    setScalePdf(scalePdf + 0.2);
    renderPages(totalPages);
    console.log('up')

  }
  const handleZoomOut = () => {
    setScalePdf(prevScale => Math.max(0.5, prevScale - 0.2));
    renderPages(totalPages);
    console.log('down')
  }
  // Get and add event listener to every span from textLayer
  const addEventListenersToSpans = () => {
    const allSpans = document.querySelectorAll('.textLayer span');

    allSpans.forEach(span => {
      span.addEventListener('click', () => {
        let element = span;
        let nextElement = span.nextSibling;
        let foundEnd = false;
        const arr = [span]; // Store the clicked span initially
    
        // If the span contains only whitespace, alert the user and stop
        if (span.innerHTML.trim() === "") {
          return alert('Make sure you click a word');
        }
    
        // Loop through the next siblings
        while (nextElement && !foundEnd) {
          // Check if the next sibling is a span element
          if (nextElement.nodeType === 1 && nextElement.nodeName.toLowerCase() === 'span') {
            // If the next span contains whitespace, stop
            if (nextElement.innerHTML.trim() === "") {
              foundEnd = true;
              break;
            }
    
            // Add the span to the array if it has a part of the word
            arr.push(nextElement);
            nextElement = nextElement.nextSibling;
          } else {
            // If it's not a span, move to the next sibling
            nextElement = nextElement.nextSibling;
          }
        }
    
        speak(arr);
      });
    });
    
    const speak = (elements) => {
      const text = elements.map(element => {
        element.classList.add('highlight');
        return element.innerHTML;
      })
                    .join(' ')

      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
};

  return (
    <div className="pdf-viewer">
      <button type="button" onClick={handleZoomIn}>Zoom In</button>
      <button type="button" onClick={handleZoomOut}>Zoom Out</button>
      <button type="button" onClick={addEventListenersToSpans}>Read Aloud</button>

      <div ref={pagesContainerRef} className="pdf-pages-container"></div>
    </div>
  );
};

export default PdfViewer;
