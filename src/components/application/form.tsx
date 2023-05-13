// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback, useMemo, useState } from "react";

const initialState = {
  firstName: "",
  lastName: "",
  DOB: undefined, // 04/03/1977
  street: "",
  city: "",
  state: "",
  zipCode: "",
  // need to make vehicles an array once you get the stuff above accomplished
  vehicleVIN: "",
  vehicleYear: "",
  vehicleMakeAndModel: ""
};

function Home() {
  const [state, setState] = useState<any>(initialState);

  const [errorState, setErrorState] = useState<any>({
    DOB: false, // 04/03/1977
    zipCode: false,
    // need to make vehicles an array once you get the stuff above accomplished
    vehicleYear: false
  });

  const errorMessages = useMemo(
    () => ({
      DOB: "You must be older than 16.",
      zipCode: "Must be 5 numerics digits.",
      vehicleYear:
        "Must be numeric digits and vehicle year must be between 1985 and current year + 1"
    }),
    []
  );

  const anyErrors = useMemo(
    () => Object.values(errorState).some(value => value === true),
    [errorState]
  );

  const errors = useMemo(() => {
    const message = [];
    Object.keys(errorState).forEach((key: string) => {
      if (errorState[key]) {
        return message.push(errorMessages[key]);
      }
    });
    return message.join(" ");
  }, [anyErrors, errorState]);

  const validation = useCallback(
    (
      type: "DOB" | "zipCode" | "vehicleYear",
      value: string | Date | number
    ) => {
      if (value === initialState[type]) return true;
      if (type === "DOB") {
        const currentYear = new Date().getFullYear();
        const year = new Date(value).getFullYear();

        return (
          value.length === 10 &&
          value.split("-").length === 3 &&
          currentYear - year >= 16
        );
      } else if (type === "zipCode") {
        return value.length === 5;
      }
      const year = Number(value);
      const currentYear = new Date(year).getFullYear() + 1;
      return year >= 1985 && year <= currentYear;
    },
    []
  );

  const validator = useMemo(
    () => ({
      DOB: value => validation("DOB", value),
      zipCode: value => validation("zipCode", value),
      vehicleYear: value => validation("vehicleYear", value)
    }),
    []
  );

  const handleFormChange = useCallback(
    (e: Event) =>
      setState({
        ...state,
        [e.target.name]: e.target.value
      }),
    [state]
  );

  const handleOnBlurValidation = useCallback(
    (e: Event) => {
      const validation = validator[e.target.name](e.target.value);
      setErrorState({
        ...errorState,
        [e.target.name]: !validation
      });
    },
    [errorState]
  );

  const handleFormSubmit = useCallback((e: Event) => {
    e.preventDefault();
    // run validation on all inputs
  }, []);

  return (
    <div>
      <h1>Application</h1>
      {anyErrors && <h4 className="error-message">{errors}</h4>}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="firstName"
          value={state.firstName}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="lastName"
          value={state.lastName}
          onChange={handleFormChange}
        />
        <label>DOB (ex: 01/01/1990)</label>
        <input
          type="date"
          name="DOB"
          onBlur={handleOnBlurValidation}
          placeholder="01/01/1990"
          value={state.DOB}
          onChange={handleFormChange}
        />
        <h4>Address</h4>
        <input
          type="text"
          name="street"
          value={state.street}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="city"
          value={state.city}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="state"
          value={state.state}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="zipCode"
          onBlur={handleOnBlurValidation}
          value={state.zipCode}
          onChange={handleFormChange}
        />

        <h4>Vehicles</h4>
        <input
          type="text"
          name="vehicleVIN"
          value={state.vehicleVIN}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="vehicleYear"
          onBlur={handleOnBlurValidation}
          value={state.vehicleYear}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="vehicleMakeAndModel"
          value={state.vehicleMakeAndModel}
          onChange={handleFormChange}
        />
      </form>
    </div>
  );
}

export default Home;
