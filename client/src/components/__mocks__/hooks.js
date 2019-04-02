import { act } from "react-testing-library";

export const wrapAsync = jest.fn(cb => {act(() => cb())}) 