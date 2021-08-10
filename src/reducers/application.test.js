import reducer from "reducers/application";

describe("Application Reducer", () => {
  //use toThrowError mather to ensure the error message matches what our reducer throws
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});