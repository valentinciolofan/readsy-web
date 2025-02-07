import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as PDFJS from "pdfjs-dist";
import { TextLayer } from "pdfjs-dist";
import { _setPdfText } from "../features/pdf/pdfReducer";
import { startTTS, stopTTS } from "../features/tts/ttsSlice";
import startSpeaking from './TextToSpeech'
import PDFbuttons from "./PDFbuttons";

PDFJS.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";


const PdfViewer = () => {
  const ttsDispatch = useDispatch(state => state.tts.readAloud);
  const ttsStatus = useSelector(state => state.tts.readAloud);
  const pdfText = useDispatch((state) => state.pdf.pdfText)
  const pdfTextState = useSelector((state) => state.pdf.pdfText);
  const pagesContainerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [scalePdf, setScalePdf] = useState(1);
  const [readAloud, setReadAloud] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopRendering, setStopRendering] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const location = useLocation();

  const { pdfUrl } = location.state;


  useEffect(() => {
    // Setting loading state untill the pdf is loaded.

    // Load pdf file
    const loadPDF = async (pdf_url) => {
      try {
        setLoading(true);
        const pdf_doc = await PDFJS.getDocument({ url: pdf_url }).promise;

        if (pdf_doc) {
          console.log("PDF loaded successfully!");
          setPdfDoc(pdf_doc);
          setTotalPages(pdf_doc.numPages);

          // Initial scale
          const scale = 1;
          // Call the function to show the pdf document.
          await renderPages(pdf_doc, pdf_doc.numPages, scale);
        }
      } catch (error) {
        console.error("Error loading PDF: ", error);
      } finally {
        setLoading(false); // Ensure loading is false after rendering
      }
    }

    if (pdfUrl) {
      loadPDF(pdfUrl);
    }

  
  }, [pdfUrl]);

  useEffect(() => {
    if (loading) return;

    const onScroll = () => {
      const pageElements = document.querySelectorAll('[data-page-index]');
      let closestPage = null;
      let closestDistance = Infinity;

      pageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (distance < closestDistance) {
          closestPage = parseInt(el.getAttribute('data-page-index'), 10);
          closestDistance = distance;
        }
      });

      if (closestPage !== null) {
        setPageIndex(closestPage);
      }
    };

    pagesContainerRef.current.addEventListener('scroll', onScroll);

    return () => {
      pagesContainerRef.current.removeEventListener('scroll', onScroll);
    };
  }, [loading])


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
  }, [ttsStatus]);

  const renderPages = async (doc, pagesNr, scale) => {
    // Get the container where the canvas and text layer will render
    const pagesContainer = pagesContainerRef.current;

    // Clear any existing content
    pagesContainer.innerHTML = ''; // Clear container

    let fullText = []; // To store extracted text for all pages

    // Iterate through the number of pages and render them.
    for (let i = 1; i <= pagesNr; i++) {
      if (stopRendering) {
        setStopRendering(false);
        return;
      }

      const pdfLoader = document.createElement('div');
      pdfLoader.setAttribute("data-page-index", i);
      pdfLoader.className = 'pdf-loader';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const renderPage = async (pages_Nr) => {

        // Fetch the page
        const page = await doc.getPage(i);
        console.log(page, 'this is page with nr', i);
        // Get viewport of the page at required scale
        console.log(scale);
        let viewport = page.getViewport({
          scale: scale,
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

    // Set global state of the extracted text
    pdfText(_setPdfText(extractedText));
  }

  // After pdf is loaded, set loading to false 
  const showPDF = async (doc) => {

    console.log('call showpdf', doc)
    await renderPages(doc, doc.numPages,);
  }


  // Get and add event listener to every span from textLayer
  const addEventListenersToSpans = () => {
    const allSpans = document.querySelectorAll('.textLayer span');

    allSpans.forEach(span => {
      span.addEventListener('click', () => read(span))
    });


  }

  // Handle voice change
  const handleVoiceChange = (e) => {
    const voiceIndex = e.target.value;
    setSelectedVoice(voices[voiceIndex]);
  };

  // Handle Read Aloud Mode
  const handleReadAloud = () => {
    if (ttsStatus) {
      window.speechSynthesis.cancel();
      ttsDispatch(stopTTS());
    } else {
      startSpeaking(pdfTextState);
      ttsDispatch(startTTS());
    }

  };

  // Handle pause.
  const handlePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(!isPaused);
      console.log(isPaused);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(!isPaused);
      console.log(isPaused);
    }

  }

  // This function will scroll smoothly to the target element
  const scrollToPage = (index) => {
    const target = document.querySelector(`[data-page-index="${index}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Define the keydown handler as a separate function
  const handleKeyDown = (event, value) => {
    if (event.keyCode === 13) { // 'Enter' key
      scrollToPage(value);
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
  // Handle Zoom In
  const handleZoomIn = () => {
    const newScale = scalePdf + 0.25;
    setScalePdf(newScale);
    setStopRendering(true);
    renderPages(pdfDoc, totalPages, newScale);
  };

  // Handle Zoom Out
  const handleZoomOut = () => {
    const newScale = Math.max(0.5, scalePdf - 0.25);
    setScalePdf(newScale);
    setStopRendering(true);
    renderPages(pdfDoc, totalPages, newScale);
  };

  return (
    <div className="pdf-viewer">
      <PDFbuttons
        pdfDoc={pdfDoc}
        scalePdf={scalePdf}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleReadAloud={handleReadAloud}
        handlePause={handlePause}
        ttsStatus={ttsStatus}
        isPaused={isPaused}
        totalPages={totalPages}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        scrollToPage={scrollToPage}
        handlePageIndex={handlePageIndex}
      />
      {/* <select onChange={handleVoiceChange}>
        {voices.map((voice, index) => (
          <option key={index} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select> */}





      {/* <label htmlFor="pageJump">Jump to a page</label>
      <input type="number" name="pageJump" placeholder="Search for a page" onChange={handlePageIndex} />
      <button type="button" onClick={() => scrollToPage(pageIndex)} className="btnJumpToIndex">Jump</button> */}

      {/* <div ref={pagesContainerRef} className="pdf-pages-container"></div> */}
      {loading ? <p>Loading PDF...</p> : <div ref={pagesContainerRef} className="pdf-pages-container"></div>}
    </div>
  );
};

export default PdfViewer;


