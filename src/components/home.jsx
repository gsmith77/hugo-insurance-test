import { useEffect } from "react";
import axios from "axios";
import { shallow } from "zustand/shallow";
import useStore from "../store";
import "../styles/general.css";

function Home() {
  const { application } = useStore(
    store => ({ application: store.application }),
    shallow
  );

  useEffect(() => {
    (async () => {
      try {
        const { data = [{}] } = await axios.get(
          "http://localhost:3100/application"
        );
        useStore.setState({ application: data[0], quote: undefined });
      } catch (err) {
        console.log("Error occured when fetching application");
      }
    })();
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
      {Boolean(
        Object.keys(application || {}).some(key => !!application[key])
      ) && (
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
