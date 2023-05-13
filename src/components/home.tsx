import { useEffect, useState } from "react";
import "../styles/general.css";

function Home() {
  const [applicationToResume, setapplicationToResume] = useState<Boolean>(
    false
  );

  useEffect(() => {
    // on load of page
    // fetch to see if there is an application in the database
    const application = false; // fetch to see if there is an application  in the database
    if (application) {
      return setapplicationToResume(true);
    }
  }, []);

  return (
    <div>
      <h1>
        Welcome to Huge Insurance. Please start or resume your application to
        get a free quote from us!
      </h1>
      <button>
        <a className="navigation-button" href="/form">
          Start new application
        </a>
      </button>
      {/* Only show Resume application if there is an application in the database */}
      {applicationToResume && (
        <button>
          <a className="navigation-button" href="/form">
            Resume application
          </a>
        </button>
      )}
    </div>
  );
}

export default Home;
