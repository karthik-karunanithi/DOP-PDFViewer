import React, { useState, useEffect } from "react";
import {
  Icon,
  MinimalButton,
  Position,
  Tooltip,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import { NextIcon, PreviousIcon, searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import { pdfjs } from "react-pdf";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";

const CustomizeSearchControlExample = ({ data = null }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [highlightText, setHighlightText] = useState([]);
  const [initialPageNumber, seInitialPageNumber] = useState(0);

  // const searchPluginInstance = searchPlugin({
  //   keyword: [], // Initial search keyword
  //   highlightAll: true, // Highlight all occurrences
  // });

  const searchPluginInstance = searchPlugin({
    keyword:
      data && JSON.parse(atob(data))?.highlightText
        ? JSON.parse(atob(data)).highlightText
        : [], // Initial search keyword
    highlightAll: true, // Highlight all occurrences
  });

  const { Search } = searchPluginInstance;

  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform = (slot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    Print: () => <></>,
    Open: () => <></>,
  });

  useEffect(() => {
    try {
      if (data) {
        data = JSON.parse(atob(data));
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

  const renderError = (error) => {
    let message = "No Document Found";

    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          justifyContent: "center",
          background: "white",
        }}
      >
        <div
          style={{
            borderRadius: "0.25rem",
            color: "black",
            padding: "0.5rem",
          }}
        >
          {message}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "50rem" }}>
      <div
        className="rpv-core__viewer"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#eeeeee",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            display: "flex",
            padding: "4px",
          }}
        >
          <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
          <Search>
            {(renderSearchProps) => {
              const [readyToSearch, setReadyToSearch] = useState(false);

              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      padding: "0 2px",
                    }}
                  >
                    <button
                      id="show_highlight_count"
                      onClick={() => {
                        setReadyToSearch(true);
                        renderSearchProps.search();
                      }}
                    >
                      Show Highlight Count
                    </button>

                    {readyToSearch &&
                      renderSearchProps.keyword &&
                      renderSearchProps.numberOfMatches === 0 && (
                        <div style={{ padding: "0 8px" }}>Not found</div>
                      )}

                    {readyToSearch &&
                      renderSearchProps.keyword &&
                      renderSearchProps.numberOfMatches > 0 && (
                        <div style={{ padding: "0 8px", color: "#000000" }}>
                          {renderSearchProps.currentMatch} of{" "}
                          {renderSearchProps.numberOfMatches}
                        </div>
                      )}

                    <div style={{ padding: "0 2px" }}>
                      <Tooltip
                        position={Position.BottomCenter}
                        target={
                          <MinimalButton
                            onClick={renderSearchProps.jumpToPreviousMatch}
                          >
                            <PreviousIcon />
                          </MinimalButton>
                        }
                        content={() => "Previous match"}
                        offset={{ left: 0, top: 8 }}
                      />
                    </div>

                    <div style={{ padding: "0 2px" }}>
                      <Tooltip
                        position={Position.BottomCenter}
                        target={
                          <MinimalButton
                            onClick={renderSearchProps.jumpToNextMatch}
                          >
                            <NextIcon />
                          </MinimalButton>
                        }
                        content={() => "Next match"}
                        offset={{ left: 0, top: 8 }}
                      />
                    </div>

                    {/* <input
                      style={{
                        border: "none",
                        padding: "8px",
                        width: "200px",
                      }}
                      id="search_text_area"
                      placeholder="Enter to search"
                      type="text"
                      value={renderSearchProps.keyword[4]}
                      onChange={(e) => {
                        setReadyToSearch(false);
                        renderSearchProps.setKeyword(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13 && renderSearchProps.keyword) {
                          setReadyToSearch(true);
                          renderSearchProps.search();
                        }
                      }}
                    /> */}

                    {/* <Tooltip
                      position={Position.BottomCenter}
                      target={
                        <button
                          style={{
                            background: "#fff",
                            border: "none",
                            borderBottom: `2px solid ${
                              renderSearchProps.matchCase
                                ? "blue"
                                : "transparent"
                            }`,
                            height: "100%",
                            padding: "0 2px",
                          }}
                          onClick={() =>
                            renderSearchProps.changeMatchCase(
                              !renderSearchProps.matchCase
                            )
                          }
                        >
                          <Icon>
                            <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                            <path d="M4.383 14.725L13.59 14.725" />
                            <path d="M0.5 21.725L3.52 21.725" />
                            <path d="M14.479 21.725L17.5 21.725" />
                            <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                            <path d="M16.92 16.725L20.794 16.725" />
                            <path d="M21.516 21.725L23.5 21.725" />
                          </Icon>
                        </button>
                      }
                      content={() => "Match case"}
                      offset={{ left: 0, top: 8 }}
                    />
                    <Tooltip
                      position={Position.BottomCenter}
                      target={
                        <button
                          style={{
                            background: "#fff",
                            border: "none",
                            borderBottom: `2px solid ${
                              renderSearchProps.wholeWords
                                ? "blue"
                                : "transparent"
                            }`,
                            height: "100%",
                            padding: "0 2px",
                          }}
                          onClick={() =>
                            renderSearchProps.changeWholeWords(
                              !renderSearchProps.wholeWords
                            )
                          }
                        >
                          <Icon>
                            <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                            <path d="M3.5 9.498L3.5 14.498" />
                          </Icon>
                        </button>
                      }
                      content={() => "Match whole word"}
                      offset={{ left: 0, top: 8 }}
                    /> */}
                  </div>
                </>
              );
            }}
          </Search>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          {fileUrl && (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={fileUrl}
                plugins={[searchPluginInstance, toolbarPluginInstance]}
                initialPage={initialPageNumber - 1}
                renderError={renderError}
              />
            </Worker>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizeSearchControlExample;
