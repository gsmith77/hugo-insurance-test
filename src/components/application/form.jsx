import { useCallback, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import axios from "axios";
import useStore from "../../store";

const initialState = {
  firstName: "",
  lastName: "",
  DOB: "",
  street: "",
  city: "",
  state: "",
  zipCode: 0,
  vehicle1VIN: "",
  vehicle1Year: "",
  vehicle1MakeAndModel: "",
  vehicle2VIN: "",
  vehicle2Year: "",
  vehicle2MakeAndModel: "",
  vehicle3VIN: "",
  vehicle3Year: "",
  vehicle3MakeAndModel: ""
};

function Home() {
  const { application, quote } = useStore(
    store => ({ application: store.application, quote: store.quote }),
    shallow
  );

  const [state, setState] = useState(
    Object.keys(application || {}).length
      ? Object.assign(initialState, application)
      : initialState
  );

  const [errors, setErrors] = useState("");

  const formattedDOB = useMemo(
    () =>
      !state.DOB
        ? undefined
        : new Date(state.DOB)?.toISOString()?.split("T")?.[0],
    [state.DOB]
  );

  const errorMessages = useMemo(
    () => ({
      DOB: "Date of birth - You must be older than 16.",
      zipCode: "Zip code must be 5 numerics digits.",
      vehicle1Year:
        "Vehicle year 1 must be numeric digits and between 1985 and current year + 1.",
      vehicle2Year:
        "Vehicle year 2 must be numeric digits and between 1985 and current year + 1.",
      vehicle3Year:
        "Vehicle year 3 must be numeric digits and between 1985 and current year + 1.",
      vehicle1:
        "All of the fields for vehicle 1 are required if you have any of the inputs for vehicle 1 are filled out.",
      vehicle2:
        "All of the fields for vehicle 2 are required if you have any of the inputs for vehicle 2 are filled out.",
      vehicle3:
        "All of the fields for vehicle 3 are required if you have any of the inputs for vehicle 3 are filled out."
    }),
    []
  );

  const anyErrors = useMemo(() => errors.length, [errors]);

  const validation = useCallback(
    (
      type: "DOB" | "zipCode" | "vehicleYear",
      value: string | Date | number
    ) => {
      if (type === "DOB") {
        const currentYear = new Date().getFullYear();
        const year = new Date(value).getFullYear();
        return currentYear - year >= 16;
      } else if (type === "zipCode") {
        return value.length === 5;
      }
      // vehicleYear validation
      const year = Number(value);
      const currentYear = new Date().getFullYear() + 1;
      return year >= 1985 && year <= currentYear;
    },
    []
  );

  /**
   * Validate entire form
   */
  const validateEntireForm = useCallback(() => {
    const errorsMsgs = [];

    ["firstName", "lastName", "street", "city", "state"].forEach(input => {
      if (!String(state[input]).length) {
        const message = `${input} cannot be blank`;
        errorsMsgs.push(message);
      }
    });

    ["DOB", "zipCode"].forEach(input => {
      if (!String(state[input]).length) {
        const message = `${input} cannot be blank`;
        return errorsMsgs.push(message);
      }
      const valid = validation(input, state[input]);
      if (!valid) {
        return errorsMsgs.push(errorMessages[input]);
      }
    });
    // vehicle1 validation
    const validVehicle1Year = validation("vehicleYear", state["vehicle1Year"]);
    if (!validVehicle1Year) {
      errorsMsgs.push(errorMessages[`vehicle1Year`]);
    }
    const vehicle1Inputs = [
      `vehicle1VIN`,
      `vehicle1Year`,
      `vehicle1MakeAndModel`
    ];
    const didNotFillOutAllOfTheVehicleInputs = vehicle1Inputs.every(
      key => !!state[key]
    );
    if (!didNotFillOutAllOfTheVehicleInputs) {
      errorsMsgs.push(errorMessages[`vehicle1`]);
    }

    [2, 3].forEach(num => {
      const vehicleOptionalInputs = [
        `vehicle${num}VIN`,
        `vehicle${num}Year`,
        `vehicle${num}MakeAndModel`
      ];
      const didNotFillOutAllOfTheVehicleInputs = vehicleOptionalInputs.some(
        key => !state[key]
      );
      const hasAtLeastOneVehicleInputFilledOut = vehicleOptionalInputs.some(
        key => state[key]
      );

      if (
        hasAtLeastOneVehicleInputFilledOut &&
        didNotFillOutAllOfTheVehicleInputs
      ) {
        errorsMsgs.push(errorMessages[`vehicle${num}`]);
      }
    });
    const messges = errorsMsgs.join(", ");
    setErrors(messges);
    return messges.length ? true : false;
  }, [errorMessages, state, validation]);

  const handleFormChange = useCallback(
    (e: Event) => {
      setState({
        ...state,
        [e.target.name]: e.target.value
      });
    },
    [state]
  );

  const handleFormSubmit = useCallback(
    (e: Event) => {
      e.preventDefault();
      const errors = validateEntireForm();
      if (!errors) {
        if (Object.keys(application || {}).length) {
          (async () => {
            const { data } = await axios.put(
              "http://localhost:3100/application",
              {
                ...state
              }
            );
            console.log("put data", data.quote);
            useStore.setState({ quote: data.quote });
          })();
        } else {
          (async () => {
            const { data } = await axios.post(
              "http://localhost:3100/application",
              {
                ...state
              }
            );
            console.log("post data", data.quote);
            useStore.setState({ quote: data.quote });
          })();
        }
      }
    },
    [application, state, validateEntireForm]
  );

  return (
    <div>
      <h1>Application</h1>
      {!!anyErrors && <h4 className="error-message">{errors}</h4>}
      <form onSubmit={handleFormSubmit}>
        <h4>Contact Information</h4>
        <label>First name</label>
        <input
          type="text"
          name="firstName"
          value={state.firstName}
          onChange={handleFormChange}
        />
        <label>Last name</label>

        <input
          type="text"
          name="lastName"
          value={state.lastName}
          onChange={handleFormChange}
        />
        <label>Date of birth</label>
        <input
          type="date"
          name="DOB"
          value={formattedDOB}
          onChange={handleFormChange}
        />
        <h4>Address</h4>
        <label>Street</label>
        <input
          type="text"
          name="street"
          value={state.street}
          onChange={handleFormChange}
        />
        <label>City</label>
        <input
          type="text"
          name="city"
          value={state.city}
          onChange={handleFormChange}
        />
        <label>State</label>
        <input
          type="text"
          name="state"
          value={state.state}
          onChange={handleFormChange}
        />
        <label>Zip code</label>
        <input
          name="zipCode"
          type="number"
          min="0"
          max="99999"
          size="5"
          value={state.zipCode}
          onChange={handleFormChange}
        />

        <h4>Vehicles</h4>
        <h5>Vehicle1</h5>
        <label>VIN</label>
        <input
          type="text"
          name="vehicle1VIN"
          value={state.vehicle1VIN}
          onChange={handleFormChange}
        />
        <label>Year</label>
        <input
          type="number"
          name="vehicle1Year"
          value={state.vehicle1Year}
          onChange={handleFormChange}
        />
        <label>Make and Model</label>
        <input
          type="text"
          name="vehicle1MakeAndModel"
          value={state.vehicle1MakeAndModel}
          onChange={handleFormChange}
        />
        <h5>Vehicle2</h5>
        <label>VIN</label>
        <input
          type="text"
          name="vehicle2VIN"
          value={state.vehicle2VIN}
          onChange={handleFormChange}
        />
        <label>Year</label>
        <input
          type="number"
          name="vehicle2Year"
          value={state.vehicle2Year}
          onChange={handleFormChange}
        />
        <label>Make and Model</label>
        <input
          type="text"
          name="vehicle2MakeAndModel"
          value={state.vehicle2MakeAndModel}
          onChange={handleFormChange}
        />
        <h5>Vehicle3</h5>
        <label>VIN</label>
        <input
          type="text"
          name="vehicle3VIN"
          value={state.vehicle3VIN}
          onChange={handleFormChange}
        />
        <label>Year</label>
        <input
          type="number"
          name="vehicle3Year"
          value={state.vehicle3Year}
          onChange={handleFormChange}
        />
        <label>Make and Model</label>
        <input
          type="text"
          name="vehicle3MakeAndModel"
          value={state.vehicle3MakeAndModel}
          onChange={handleFormChange}
        />
        <br />
        <br />
        <input
          onSubmit={handleFormSubmit}
          type="submit"
          value="Submit application"
        />
      </form>
      {!!quote && <h1>Your quote is: ${quote}</h1>}
    </div>
  );
}

export default Home;
