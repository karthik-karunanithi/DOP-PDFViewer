import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/search/lib/styles/index.css";
import { pdfjs } from "react-pdf";

const PDFViewer = ({ data = null }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [highlightText, setHighlightText] = useState([]);
  const [initialPageNumber, seInitialPageNumber] = useState(0);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const searchPluginInstance = searchPlugin({
    keyword: highlightText, // Initial search keyword
    highlightAll: true, // Highlight all occurrences
  });

  useEffect(() => {
    try {
      if (data) {
        data = JSON.parse(atob(data));
        console.log(data);
        setFileUrl(data?.blobURLPath ? data.blobURLPath : null);
        seInitialPageNumber(
          data?.initialPageNumber ? data.initialPageNumber : null
        );
        setHighlightText(data?.highlightText ? data.highlightText : []);
      }
    } catch (e) {
      console.log(e);
    }
  }, [data]);

  return (
    <div style={{height : "100vh"}}>
      {fileUrl && (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
            initialPage={initialPageNumber - 1}
          />
        </Worker>
      )}
    </div>
  );
};

export default PDFViewer;
