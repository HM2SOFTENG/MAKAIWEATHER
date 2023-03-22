import "../videochatapp/VideoApp.css";
import videoChatService from "services/videoChatService";
import React, { useEffect, useState, useCallback } from "react";
import DailyIframe from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react-hooks";

import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "./Utils";
import debug from "sabio-debug";
import HomeScreen from "../homescreen/HomeScreen";
import Call from "../call/Call";
import Header from "../header/Header";
import Tray from "../tray/Tray";
import HairCheck from "../haircheck/HairCheck";

const _logger = debug.extend("location");
/* We decide what UI to show to users based on the state of the app, which is dependent on the state of the call object. */
const STATE_IDLE = "STATE_IDLE";
const STATE_CREATING = "STATE_CREATING";
const STATE_JOINING = "STATE_JOINING";
const STATE_JOINED = "STATE_JOINED";
const STATE_LEAVING = "STATE_LEAVING";
const STATE_ERROR = "STATE_ERROR";
const STATE_HAIRCHECK = "STATE_HAIRCHECK";

export default function App() {
  const [appState, setAppState] = useState(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState(null);
  const [callObject, setCallObject] = useState(null);
  const [apiError, setApiError] = useState(false);

  /**
   * Create a new call room. This function will return the newly created room URL.
   * We'll need this URL when pre-authorizing (https://docs.daily.co/reference/rn-daily-js/instance-methods/pre-auth)
   * or joining (https://docs.daily.co/reference/rn-daily-js/instance-methods/join) a call.
   */
  const onCreateNewRoom = useCallback((postData) => {
    setAppState(STATE_CREATING);
    videoChatService
      .getNewVideoChat(postData)
      .then(onCreateNewRoomSuccess)
      .catch(onCreateNewRoomError);
  }, []);
  const onCreateNewRoomError = (err) => {
    _logger("createVideoChat error", err);
    setApiError(true);
  };

  const onCreateNewRoomSuccess = (data) => {
    _logger("createVideoChat success data", data.url);
    setAppState(null);
    setCallObject(null);
    // setAppState(STATE_HAIRCHECK);

    // setRoomCreated(true); // set the flag indicating that a new room has been created
  };

  /**
   * We've created a room, so let's start the hair check. We won't be joining the call yet.
   */
  const startHairCheck = useCallback(async (url) => {
    const newCallObject = DailyIframe.createCallObject();
    _logger("Hair check url", url);
    setRoomUrl(url);
    setCallObject(newCallObject);
    setAppState(STATE_HAIRCHECK);
    await newCallObject.preAuth({ url }); // add a meeting token here if your room is private
    await newCallObject.startCamera();
  }, []);
  /**
   * Once we pass the hair check, we can actually join the call.
   */
  const joinCall = useCallback(() => {
    callObject.join({ url: roomUrl });
  }, [callObject, roomUrl]);

  /**
   * Start leaving the current call.
   */
  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    // If we're in the error state, we've already "left", so just clean up
    if (appState === STATE_ERROR) {
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setCallObject(null);
        setAppState(STATE_IDLE);
      });
    } else {
      /* This will trigger a `left-meeting` event, which in turn will trigger
      the full clean-up as seen in handleNewMeetingState() below. */
      setAppState(STATE_LEAVING);
      callObject.leave();
    }
  }, [callObject, appState]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */
  useEffect(() => {
    const url = roomUrlFromPageUrl();
    if (url) {
      startHairCheck(url);
    }
  }, [startHairCheck]);

  /**
   * Update the page's URL to reflect the active call when roomUrl changes.
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomUrl);
    if (pageUrl === window.location.toString()) return;
    window.history.replaceState(null, null, pageUrl);
  }, [roomUrl]);

  /**
   * Update app state based on reported meeting state changes.
   *
   * NOTE: Here we're showing how to completely clean up a call with destroy().
   * This isn't strictly necessary between join()s, but is good practice when
   * you know you'll be done with the call object for a while, and you're no
   * longer listening to its events.
   */
  useEffect(() => {
    if (!callObject) return;

    const events = ["joined-meeting", "left-meeting", "error", "camera-error"];

    function handleNewMeetingState() {
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setAppState(STATE_JOINED);
          break;
        case "left-meeting":
          callObject.destroy().then(() => {
            setRoomUrl(null);
            setCallObject(null);
            setAppState(STATE_IDLE);
          });
          break;
        case "error":
          setAppState(STATE_ERROR);
          break;
        default:
          break;
      }
    }

    // Use initial state
    handleNewMeetingState();

    /*
     * Listen for changes in state.
     * We can't use the useDailyEvent hook (https://docs.daily.co/reference/daily-react-hooks/use-daily-event) for this
     * because right now, we're not inside a <DailyProvider/> (https://docs.daily.co/reference/daily-react-hooks/daily-provider)
     * context yet. We can't access the call object via daily-react-hooks just yet, but we will later in Call.js and HairCheck.js!
     */
    events.forEach((event) => callObject.on(event, handleNewMeetingState));

    // Stop listening for changes in state
    return () => {
      events.forEach((event) => callObject.off(event, handleNewMeetingState));
    };
  }, [callObject]);

  /**
   * Show the call UI if we're either joining, already joined, or have encountered
   * an error that is _not_ a room API error.
   */
  const showCall =
    !apiError && [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(appState);

  /* When there's no problems creating the room and startHairCheck() has been successfully called,
   * we can show the hair check UI. */
  const showHairCheck = !apiError && appState === STATE_HAIRCHECK;

  const renderApp = () => {
    // If something goes wrong with creating the room.
    if (apiError) {
      return (
        <div className="api-error">
          <h1>Error</h1>
          <p>
            Room could not be created. Please check your local configuration in
            `api.js`. For more information, check out the{" "}
            <a href="https://github.com/daily-demos/call-object-react-daily-hooks/blob/main/README.md">
              readme
            </a>{" "}
            :)
          </p>
        </div>
      );
    }

    // No API errors? Let's check our hair then.
    if (showHairCheck) {
      return (
        <DailyProvider callObject={callObject}>
          <HairCheck joinCall={joinCall} cancelCall={startLeavingCall} />
        </DailyProvider>
      );
    }

    // No API errors, we passed the hair check, and we've joined the call? Then show the call.
    if (showCall) {
      return (
        <DailyProvider callObject={callObject}>
          <Call />
          <Tray leaveCall={startLeavingCall} />
        </DailyProvider>
      );
    }

    // The default view is the HomeScreen, from where we start the demo.
    return (
      <HomeScreen
        onCreateNewRoom={onCreateNewRoom}
        startHairCheck={startHairCheck}
      />
    );
  };

  return (
    <React.Fragment>
      <div className="app">
        <Header />
        {renderApp()}
      </div>
    </React.Fragment>
  );
}
