import AddCourse from "../AddCourse";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "redux-mock-store";


const myMockStore = configureStore([]);
const myStore = myMockStore({
  user: {
    user: null,
    msg: null,
    loading: false
  }
});

test("snapshot of AddCourse.js UI", () => {
  const { container } = render(
    <Provider store={myStore}>
      <BrowserRouter>
        <AddCourse />
      </BrowserRouter>
    </Provider>
  );
  expect(container).toMatchSnapshot();
});
