import React, { useState } from "react";
import AuthModal from "../components/AuthModal";
import Header from '../components/Header';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => {
    setShowAuthModal(true);
  }

  const closeAuthModal = () => {
    setShowAuthModal(false);
  }
  return (
    <>
      <Header
        handleOpenModal={openAuthModal}
      />
      {/* Main Section */}
      <main>
        <section className="hero-section">
          <div className="container">
            <div className="hero-section-col left">
              <h1>Readsy - Your Personal AI-Powered Reading Assistant</h1>
              <h3>Effortlessly organize all your notes.</h3>

              <div className="keypoints-and-btn-cta">
                <ul className="hero-section-keypoints">
                  <li>
                    <img src="src/assets/images/taskarcadeicon.svg" alt="auto-note icon" />
                    <p className="font-normal bold">
                      Auto-Note Taking<span className="li-line">-</span>
                    </p>
                    <p className="font-normal">Automatically capture key points as you read.</p>
                  </li>
                  <li>
                    <img src="src/assets//images/briefarcadeicon.svg" alt="AI Summarization Icon" />
                    <p className="font-normal bold">
                      AI Summarization<span className="li-line">-</span>
                    </p>
                    <p className="font-normal">Get concise summaries instantly.</p>
                  </li>
                  <li>
                    <img src="src/assets/images/searcharcadeicon.svg" alt="Smart Search Quickly Icon" />
                    <p className="font-normal bold">
                      Smart Search Quickly<span className="li-line">-</span>
                    </p>
                    <p className="font-normal">Find specific content with advanced search.</p>
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn-primary full"
                  onClick={openAuthModal}>
                  Try It Now!
                </button>
              </div>
            </div>
            <div className="hero-section-col right">
              <img
                src="src/assets/images/herosectionillustration.svg"
                alt="Readsy Hero Page Illustration"
                className="hero-section-illustration"
              />
            </div>
          </div>
        </section>
      </main>

      <AuthModal
        showAuthModal={showAuthModal}
        closeModal={closeAuthModal} />
    </>
  );
};

export default LandingPage;
