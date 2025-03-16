import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import '../styles/ModalStyles.css'
import meetLogo from '../assets/logo_meet.png'

const EventModal = ({ event, onClose }) => {
    console.log(event);

    if (!event) return null;

    return (
        <Modal size="lg" show={true} onHide={onClose} centered style={{ zIndex: "9999" }}>
            <Modal.Header closeButton>
                <Modal.Title>Interview Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="event-modal-content p-2 d-flex">
                    {/* Left Section */}
                    <div className="left-section p-2">
                        <p><strong>Interview With:</strong> {event.candidate || "N/A"}</p>
                        <p><strong>Position:</strong> {event.jobRole || "N/A"}</p>
                        <p><strong>Created By:</strong> -</p>
                        <p><strong>Interview Date:</strong> {moment(event.start).format("DD MMM YYYY")}</p>
                        <p><strong>Interview Time:</strong> {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}</p>
                        <p><strong>Interview Via:</strong> {event.interviewPlatform || "Google Meet"}</p>

                        {/* Resume & Aadhar Buttons */}
                        <button type="button" className="btn btn-outline-primary w-100 mb-2">
                            <i className="fa fa-file"></i> Resume.docx
                        </button>
                        <button type="button" className="btn btn-outline-primary w-100">
                            <i className="fa fa-id-card"></i> Aadhar Card
                        </button>

                        {/* Attachments Section */}
                        {event.attachments?.length > 0 && (
                            <div className="attachments mt-2">
                                {event.attachments.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file.link}
                                        className="btn btn-outline-primary d-flex align-items-center gap-2 w-100 mb-2"
                                        download
                                    >
                                        <i className="fa fa-paperclip"></i> {file.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="right-section d-flex flex-column align-items-center p-4">
                        <img src={meetLogo} alt="Google Meet" className="d-block mx-auto mb-2" style={{ width: "100px" }} />

                        {event.meetingLink ? (
                            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-100">
                                <i className="fa fa-video"></i> Join Meeting
                            </a>
                        ) : (
                            <button className="btn btn-secondary w-100" disabled>
                                No Link Available
                            </button>
                        )}
                    </div>
                </div>


            </Modal.Body>
        </Modal>
    );
};

export default EventModal;
