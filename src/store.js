import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialStore = {
  application: {
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
  },
  quote: undefined
};

const useStore = create(
  persist((set, get) => initialStore, {
    name: "hugo-insurance-state-management"
  })
);

export default useStore;
