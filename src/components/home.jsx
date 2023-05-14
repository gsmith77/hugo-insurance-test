import { useEffect, useState } from "react";
import axios from "axios";
import { shallow } from "zustand/shallow";
import useStore, { Store } from "../store";
import "../styles/general.css";

function Home() {
  const { application }: { application: Store.application } = useStore(
    store => ({ application: store.application }),
    shallow
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:3100/application");
        useStore.setState({ application: data[0] });
      } catch (err) {
        console.log("Error occured when fetching books");
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
      <button>
        <a
          className="navigation-button"
          href={
            Boolean(Object.keys(application || {}).length === 0) ? "/" : "/form"
          }
        >
          Resume application
        </a>
      </button>
    </div>
  );
}

export default Home;
