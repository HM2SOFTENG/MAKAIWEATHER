import React, { useState, useCallback, useMemo } from "react";
import {
  useParticipantIds,
  useScreenShare,
  useLocalParticipant,
  useDailyEvent,
} from "@daily-co/daily-react-hooks";
import { Button } from "react-bootstrap";
import "./Call.css";
import Tile from "../tilevideo/TileVideo";
import UserMediaError from "../usermediaerror/UserMediaError";

export default function Call() {
  /* If a participant runs into a getUserMedia() error, we need to warn them. */
  const [getUserMediaError, setGetUserMediaError] = useState(false);

  /* We can use the useDailyEvent() hook to listen for daily-js events. Here's a full list
   * of all events: https://docs.daily.co/reference/daily-js/events */
  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, [])
  );

  /* This is for displaying remote participants: this includes other humans, but also screen shares. */
  const { screens } = useScreenShare();
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });

  const handleCopyClick = () => {
    /* Create a new textarea element to copy the text */
    const textarea = document.createElement("textarea");
    textarea.value = window.location.toString();
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  /* This is for displaying our self-view. */
  const localParticipant = useLocalParticipant();
  const isAlone = useMemo(
    () => remoteParticipantIds?.length < 1 || screens?.length < 1,
    [remoteParticipantIds, screens]
  );

  const renderCallScreen = () => (
    <div
      className={`${screens.length > 0 ? "is-screenshare card" : "card call"}`}
    >
      {/* Your self view */}
      {localParticipant && (
        <Tile id={localParticipant.session_id} isLocal isAlone={isAlone} />
      )}
      {/* Videos of remote participants and screen shares */}
      {remoteParticipantIds?.length > 0 || screens?.length > 0 ? (
        <>
          {remoteParticipantIds.map((id) => (
            <Tile key={id} id={id} />
          ))}
          {screens.map((screen) => (
            <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
          ))}
        </>
      ) : (
        // When there are no remote participants or screen shares
        <div className="info-box card bg-grey">
          <h1>Waiting for others</h1>
          <p className="text-100">Invite someone by sharing this link:</p>
          <div className="copy-container text-100">
            <span className="room-url">{window.location.toString()}</span>
            <div>
              <Button className="copy-button" onClick={handleCopyClick}>
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
