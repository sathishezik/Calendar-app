import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import eventsData from "../data/calendarfromtoenddate.json";
import meetingsData from "../data/calendar_meeting.json";
import { Popover, OverlayTrigger } from "react-bootstrap";
import "../styles/CalendarStyles.css";
import EventModal from './EventModal'
import moment from "moment-timezone";


const localizer = momentLocalizer(moment);

const BigCalendar = () => {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month");
    const [activePopover, setActivePopover] = useState(null); // Track active popover ID

    useEffect(() => {
        const groupedEvents = {};
        eventsData.forEach(event => {
            const dateKey = moment(event.start).format("YYYY-MM-DD");
            if (!groupedEvents[dateKey]) {
                groupedEvents[dateKey] = [];
            }
            groupedEvents[dateKey].push(event);
        });

        const meetingsArray = Array.isArray(meetingsData) ? meetingsData : Object.values(meetingsData);

        const formattedEvents = Object.keys(groupedEvents).map(dateKey => {
            const eventList = groupedEvents[dateKey];
            return {
                id: dateKey,
                start: moment(dateKey).toDate(),
                end: moment(dateKey).toDate(),
                title: eventList[0].title,
                count: eventList.length,
                details: eventList.map(event => {
                    const meetingDetails = meetingsArray.find(meeting => meeting?.id === event?.id);
                    return {
                        ...event,
                        interviewer: meetingDetails?.user_det?.handled_by?.firstName || "Unknown",
                        interviewTime: meetingDetails
                            ? `${moment(meetingDetails.start).format("hh:mm A")} - ${moment(meetingDetails.end).format("hh:mm A")}`
                            : "N/A",
                        jobRole: meetingDetails?.job_id?.jobRequest_Title || "N/A"
                    };
                })
            };
        });

        setEvents(formattedEvents);
    }, []);

    const CustomEvent = ({ event }) => {
        console.log(event);

        const targetRef = useRef(null);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [showPopover, setShowPopover] = useState(false);
        const overlayRef = useRef(null);

        const handleClosePopover = () => {
            setShowPopover(false);
        };

        return (
            <>
                <OverlayTrigger
                    trigger="click"
                    placement="right"
                    rootClose={false}
                    show={showPopover}
                    overlay={
                        <Popover id={`popover-${event.id}`} ref={overlayRef}>
                            <div className="popover-header d-flex justify-content-between align-items-center">
                                <strong>Meetings</strong>
                                <button className="btn-close" onClick={handleClosePopover}></button>
                            </div>
                            <Popover.Body className="p-0">
                                {event.details.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="popover-card p-2 mb-3"
                                        onClick={() => setSelectedEvent(detail)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <strong>{detail.jobRole}</strong>
                                        <p className="mb-0">Round: {detail.desc} Interviewer: {detail.interviewer}</p>
                                        <p className="mb-0">
                                            Date: {moment(detail.start).format("DD MMM YYYY")} Time: {detail.interviewTime}
                                        </p>
                                    </div>
                                ))}
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <div
                        ref={targetRef}
                        onClick={() => setShowPopover(!showPopover)}
                        style={{
                            position: "relative",
                            background: "#004085",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            textAlign: "center"
                        }}
                    >
                      
                        <div style={{ fontSize: "12px" }}>Role: {event.details[0].jobRole}</div>
                        <div style={{ fontSize: "12px" }}>Interviewer: {event.details[0].interviewer}</div>
                        <div style={{ fontSize: "12px" }}>  Time: {moment(event.details[0].start).format("hh:mm A")}</div>

                        {event.count > 1 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "0",
                                    backgroundColor: "goldenrod",
                                    color: "#000",
                                    borderRadius: "50%",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                }}
                            >
                                {event.count}
                            </span>
                        )}
                    </div>
                </OverlayTrigger>

                {/* Event Modal */}
                {selectedEvent && (
                    <EventModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </>
        );
    };

    const updatedEvents = events.map(event => {
        let startDate = new Date(event.start);
        let endDate = new Date(event.end);

        // Convert UTC to IST (UTC+5:30)
        let istOffset = 5.5 * 60; // 5 hours 30 minutes in minutes
        startDate.setMinutes(startDate.getMinutes() + istOffset - startDate.getTimezoneOffset());
        endDate.setMinutes(endDate.getMinutes() + istOffset - endDate.getTimezoneOffset());

        console.log("Original Start (UTC):", event.start);
        console.log("Converted Start (IST):", startDate.toISOString());
        console.log("Converted End (IST):", endDate.toISOString());

        return {
            ...event,
            start: startDate,
            end: endDate
        };
    });




    return (
        <div style={{ display: "flex", height: "100vh", padding: "20px" }}>
            <div style={{ flex: 2 }}>
                <h2 className="text-center">Event Calendar</h2>
                <Calendar
                    localizer={localizer}
                    events={updatedEvents}
                    startAccessor="start"
                    endAccessor="end"
                    date={currentDate}
                    view={view}
                    onView={setView}
                    onNavigate={date => setCurrentDate(date)}
                    selectable
                    step={80}
                    timeslots={2}
                    min={new Date(2024, 7, 29, 8, 0, 0)} // 8:00 AM
                    max={new Date(2024, 7, 29, 20, 0, 0)} // 8:00 PM
                    style={{ height: "100%" }}
                    components={{ event: CustomEvent }}
                />;



            </div>
        </div>
    );
};

export default BigCalendar;
