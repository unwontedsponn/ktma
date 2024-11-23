"use client";
import React, { useState } from "react";

interface ContactProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Contact({ showModal, setShowModal }: ContactProps) {
  // State to hold input values
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // For showing success/error messages
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Track if the message is success or error

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message }),
    });

    if (response.ok) {
      setStatusMessage("Your email has been sent successfully!");
      setIsSuccess(true);
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      setStatusMessage("There was an error sending your email. Please try again.");
      setIsSuccess(false);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setStatusMessage(null); // Clear message when closing the modal
    setIsSuccess(null);
  };

  return (
    <div
      id="myModal"
      className={`fixed inset-0 z-10 bg-black/40 ${showModal ? "block" : "hidden"}`} // Modal overlay styles
    >
      <div className="modal-content m-auto w-4/5 md:w-1/2 lg:w-1/3 p-5 border-3 border-thick-border-gray bg-white">
        {/* Close Button */}
        <span
          className="float-right text-3xl font-bold text-gray-400 cursor-pointer hover:text-black focus:text-black close"
          role="button"
          tabIndex={0}
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") closeModal();
          }}
        >
          &times;
        </span>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <h2 className="font-gopher-mono-semi text-xl">Drop me an email:</h2>
            <label htmlFor="email" className="font-gopher-mono text-grey-black-brown">
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              className="block w-full mt-1 p-2 border-3 border-thick-border-gray"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Subject Input */}
          <div>
            <label htmlFor="subject" className="font-gopher-mono text-grey-black-brown">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              className="block w-full mt-1 p-2 border-3 border-thick-border-gray"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="font-gopher-mono text-grey-black-brown">
              Message:
            </label>
            <textarea
              id="message"
              className="block w-full mt-1 p-2 border-3 border-thick-border-gray"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mt-4 text-center font-gopher-mono ${
                isSuccess ? "text-grey-black-brown" : "text-dark-pink"
              }`}
            >
              {statusMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="font-gopher-mono bg-thick-border-gray text-white py-2 px-4 border-3 border-thick-border-gray hover:bg-pink hover:text-thick-border-gray"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
