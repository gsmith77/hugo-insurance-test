import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Store {
  application: {
    firstName: string | undefined;
    lastName: string | undefined;
    DOB: Date | undefined;
    street: string | undefined;
    city: string | undefined;
    state: string | undefined;
    zipCode: number | undefined;
    // need to make vehicles an array once you get the stuff above accomplished
    vehicleVIN: string | undefined;
    vehicleYear: string | undefined;
    vehicleMakeAndModel: string | undefined;
  };
}

const initialStore: Store = {
  application: {
    firstName: "",
    lastName: "",
    DOB: undefined, // 04/03/1977
    street: "",
    city: "",
    state: "",
    zipCode: 0,
    // need to make vehicles an array once you get the stuff above accomplished
    vehicleVIN: "",
    vehicleYear: "",
    vehicleMakeAndModel: ""
  }
};

const useStore = create(
  persist((set, get): Store => initialStore, {
    name: "hugo-insurance-state-management" // unique name
  })
);

export default useStore;
