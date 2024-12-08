import React from "react";

const Contact = () => {
  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Contact Me</h1>
      <div style={{ fontSize: "18px", lineHeight: "1.8em" }}>
        <p>
          <b>Phone:</b> 410-212-3640
        </p>
        <p>
          <b>Email:</b>{" "}
          <a href="mailto:jjohns196@students.towson.edu" style={{ color: "blue", textDecoration: "underline" }}>
            jjohns196@students.towson.edu
          </a>
        </p>
        <p>
          <b>LinkedIn:</b>{" "}
          <a
            href="https://www.linkedin.com/in/joshua-johnson-21a203320/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Link to my LinkedIn Profile
          </a>
        </p>
        <p>
          <b>Indeed:</b>{" "}
          <a
            href="https://profile.indeed.com/p/joshuaj-p4v3q1p"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Link to Resume
          </a>{" "}
          will take you to my resume on my Indeed account.
        </p>
        <p>
          <b>Facebook:</b>{" "}
          <a
            href="https://www.facebook.com/share/XPwYaUrGDkkz5zwP/?mibextid=LQQJ4d"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Link to profile
          </a>
        </p>
        <p>
          <b>GitHub:</b>{" "}
          <a
            href="https://github.com/jjohns197"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Link to GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
