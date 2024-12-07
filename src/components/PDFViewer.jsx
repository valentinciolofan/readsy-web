import React, { useEffect, useRef, useState } from "react";
import * as PDFJS from "pdfjs-dist";
import { TextLayer } from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
const pdfUrl = '/1.pdf';

const PdfViewer = () => {
  const pagesContainerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [scalePdf, setScalePdf] = useState(1);
  const [pdfText, setPdfText] = useState('');
  const [readAloud, setReadAloud] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pageIndex, setPageIndex] = useState(null);

  // Load voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      let synth = window.speechSynthesis;
      let voicesList = synth.getVoices();

      if (voicesList.length > 0) {
        setVoices(voicesList);
        setSelectedVoice(voicesList[0]); // Default to the first voice
      } else {
        synth.onvoiceschanged = () => {
          voicesList = synth.getVoices();
          setVoices(voicesList);
          setSelectedVoice(voicesList[0]); // Default to the first voice
        };
      }
    };

    loadVoices();
  }, []);



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

    // Store full text of the pdf document.
    let fullText = [];

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

        // Render textContent as a layer.
        await renderTextLayer(textContent, viewport);

        // Push page text items to full text array
        textContent.items.map(item => fullText.push(item.str));

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
    // Set the full text.
    let extractedText = fullText.join(' ');
    extractedText = extractedText
      .replace(/\s+/g, ' ')        // Replace multiple spaces with a single space
      .replace(/\n+/g, '\n')       // Remove multiple consecutive newlines
      .trim();
    setPdfText(extractedText);
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
      span.addEventListener('click', () => read(span))
    });


  };
  const startSpeaking = (text) => {
    if (!text) {
      console.error("No text provided to speak.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
  
    // Set the selected voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  
    // Event listeners for logging and debugging
    utterance.onstart = () => {
      console.log("Speech started.");
    };
  
    utterance.onend = () => {
      console.log("Speech ended.");
    };
  
    utterance.onerror = (event) => {
      console.error("Speech synthesis encountered an error:", event.error);
    };
  
    utterance.onpause = () => {
      console.log("Speech paused.");
    };
  
    utterance.onresume = () => {
      console.log("Speech resumed.");
    };
  
    utterance.onmark = (event) => {
      console.log(`Speech reached mark: ${event.name}`);
    };
  
    utterance.onboundary = (event) => {
      console.log(`Speech reached boundary at character ${event.charIndex}`);
    };
  
    // Start speaking
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error occurred while starting speech synthesis:", error);
    }
  };
  

  // Handle voice change
  const handleVoiceChange = (e) => {
    const voiceIndex = e.target.value;
    setSelectedVoice(voices[voiceIndex]);
  };

  const handleReadAloud = () => {
    startSpeaking(pdfText);

  };

  // Define the keydown handler as a separate function
  const handleKeyDown = (event, value) => {
    if (event.keyCode === 13) { // 'Enter' key
      window.location.href = `#${value}`;
    }
  };

  // Handle page search index
  const handlePageIndex = (e) => {
    const value = e.target.value;
    setPageIndex(value);

    // Attach the keydown event listener
    const keyDownHandler = (event) => handleKeyDown(event, value);
    document.addEventListener('keydown', keyDownHandler);

    // Clean up: remove the event listener to avoid multiple listeners being added
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  };

  return (
    <div className="pdf-viewer">
      <button type="button" onClick={handleZoomIn}>Zoom In</button>
      <button type="button" onClick={handleZoomOut}>Zoom Out</button>
      {/* Dropdown for selecting voice */}
      <select onChange={handleVoiceChange}>
        {voices.map((voice, index) => (
          <option key={index} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>


      <button type="button" onClick={handleReadAloud}>
        Read Aloud
      </button>

      <label htmlFor="pageJump">Jump to a page</label>
      <input type="number" name="pageJump" placeholder="Search for a page" onChange={handlePageIndex}/>
      <a href={`#${pageIndex ? pageIndex : ''}`}>Jump</a>

      <div ref={pagesContainerRef} className="pdf-pages-container"></div>
    </div>
  );
};

export default PdfViewer;


