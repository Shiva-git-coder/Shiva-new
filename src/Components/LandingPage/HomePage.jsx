import React, { useState, useEffect } from "react";
// import { FaBell, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';
import micImg from '../../assets/micImg.png';
import msgImg from '../../assets/msgImg.png';
import docsImg from '../../assets/docsImg.png'



function HomePage() {
  const [isSticky, setIsSticky] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      // Adjust this value as needed
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="app">
      <header className="navbar">
        {/* <div className="logo">
          <img src="/logo-placeholder.png" alt="Logo" />
          <span>Sunoh.ai</span>
        </div> */}
        <nav className="nav-links">
          <a href="#how-it-works">How Sunoh Works</a>
          <a href="#faqs">FAQs</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
          <a href="#blog">Blog</a>
          <a href="#about">About</a>
        </nav>
        <div style={{ display: "flex" }}>
          <button className="signup-btn" onClick={() => navigate("/patient-login")}>Patient Login</button>
          <button className="signup-btn" style={{ marginLeft: "5px" }} onClick={() => navigate("/Login")}>Login</button>
        </div>
      </header>
      <div className="main-content-container">
        <h1>The Best AI Medical Scribe for Physicians</h1>
        <p style={{ padding: "10px" }}>Trusted by over 60,000 physicians.</p>

        <div className="wave-container" style={{ margin: "30px" }}>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>

          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>


          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>

          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>

          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
        </div>

        <button className="get-started-btn">Get Started</button>
      </div>

      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div className="container" style={{ width: "50%" }}>
          <div className="content">
            <h1 style={{ textAlign: "left" }}>Your AI Medical Scribe</h1>
            <div style={{ display: "flex" }}>
              <hr style={{ backgroundColor: "#fb2b66", width: "10px", border: "none", marginRight: "10px" }} />
              <p style={{ fontSize: "23px", textAlign: "left", lineHeight: "1.6", marginLeft: "10px" }}>
                Save up to two hours daily with Sunoh AI medical scribe. Sunoh
                listens and converts the natural conversations between healthcare
                providers and patients into clinical notes. Sunoh gives you more
                face time with your patients and helps make the documentation of
                clinical notes faster and easier.face time with your patients and helps make the documentation of clinical notes faster and easier.
              </p>
            </div>
          </div>
        </div>

        <div className="video-container" style={{ width: "50%", marginTop: '10px' }}>
          <div className="video-overlay">
            <p>Clinical documentation cutting into pajama time?</p>
          </div>
          <video controls>
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div style={{ backgroundColor: "rgb(216, 216, 249)" }}>
        <div>
          <h1>How Ai Medical Scribe Works</h1>

          <div style={{ display: "flex", backgroundColor: "rgb(11, 7, 208)", justifyContent: "space-around" }}>
            <marquee>
              <div style={{display:"flex"}}>
              {/* <div style={{ backgroundColor: "rgb(11, 7, 208)" }}> */}
                <div style={{ backgroundColor: "#FFFFFF", border: "1px solid red", margin: "10px" }}>
                  <p style={{ color: "rgb(11, 7, 208)" }}>Listens to the Conversation</p>
                  <img src={micImg} style={{ height: "100px" }} />
                  <p>Heal5.ai listens to real-time
                    patient-provider interactions to
                    ensure accurate and efficient
                    documentation of clinical details.</p>
                </div>
              {/* </div> */}
              {/* <div style={{ backgroundColor: "rgb(11, 7, 208)" }}> */}
                <div style={{ backgroundColor: "#FFFFFF", border: "1px solid red", margin: "10px"}}>
                  <p style={{ color: "rgb(11, 7, 208)" }}>Listens to the Conversation</p>
                  <img src={msgImg} style={{ height: "100px" }} />
                  <p>Leveraging advanced AI and speech
                    recognition, Heal5.ai converts the
                    conversation into a clear and
                    detailed transcript.</p>
                {/* </div> */}
              </div>
              {/* <div style={{ backgroundColor: "rgb(11, 7, 208)" }}> */}
                <div style={{ backgroundColor: "#FFFFFF", border: "1px solid red",margin: "10px" }}>
                  <p style={{ color: "rgb(11, 7, 208)" }}>Listens to the Conversation</p>
                  <img src={docsImg} style={{ height: "100px" }} />
                  <p>Leveraging advanced AI and speech
                    recognition, Heal5.ai converts the
                    conversation into a clear and
                    detailed transcript.</p>
                </div>
                </div>
              {/* </div> */}
            </marquee>
          </div>

        </div>

        {/* <div style={{ display: "flex" }}> */}
        {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
        {/* <marquee>
            <div>
            This text will scroll from right to left
              <h3>Welcome to React!</h3>
              <p>
                This is a simple heading and paragraph example rendered using
                React.This is a simple heading and paragraph example rendered
                using React.
              </p>
            </div>
          </marquee> */}
        {/* <div>
              <h3>Welcome to React!</h3>
              <p>
                This is a simple heading and paragraph example rendered using
                React.This is a simple heading and paragraph example rendered
                using React.
              </p>
            </div> */}
        {/* </div> */}

        {/* <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <h3>Welcome to React!</h3>
              <p>
                This is a simple heading and paragraph example rendered using
                React.This is a simple heading and paragraph example rendered
                using React.
              </p>
            </div>
            <div>
              <h3>Welcome to React!</h3>
              <p>
                This is a simple heading and paragraph example rendered using
                React.This is a simple heading and paragraph example rendered
                using React.
              </p>
            </div>
            <div>
              <h3>Welcome to React!</h3>
              <p>
                This is a simple heading and paragraph example rendered using
                React.This is a simple heading and paragraph example rendered
                using React.
              </p>
            </div>
          </div> */}
        {/* </div> */}


      </div>

      <div>
        <h3>Why Clinicians Love Sunoh</h3>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            // border: "1px solid #ddd",
            // borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/400x200"
            alt="Card"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Card Title
          </h2>
          {/* <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            agjagshaghjagdja
          </p> */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read More
          </button>
        </div>
        <div
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            // border: "1px solid #ddd",
            // borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/400x200"
            alt="Card"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Card Title
          </h2>
          {/* <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            agjagshaghjagdja
          </p> */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read More
          </button>
        </div>
        <div
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            // border: "1px solid #ddd",
            // borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/400x200"
            alt="Card"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Card Title
          </h2>
          {/* <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            agjagshaghjagdja
          </p> */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read More
          </button>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            // border: "1px solid #ddd",
            // borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/400x200"
            alt="Card"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Card Title
          </h2>
          {/* <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            agjagshaghjagdja
          </p> */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read More
          </button>
        </div>
        <div
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            // border: "1px solid #ddd",
            // borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/400x200"
            alt="Card"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Card Title
          </h2>
          {/* <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            agjagshaghjagdja
          </p> */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read More
          </button>
        </div>
        <div
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            // border: "1px solid #ddd",
            // borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/400x200"
            alt="Card"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "10px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Card Title
          </h2>
          {/* <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            agjagshaghjagdja
          </p> */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;




