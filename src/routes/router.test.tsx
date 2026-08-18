import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { router } from "./router";
import Loading from "../components/Loading";
import store from "../stores";

describe("router", () => {
  it("renders the app shell and navigation links", async () => {
    render(
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    );

    expect(await screen.findByText("首页")).toBeInTheDocument();
    expect(await screen.findByText("专题")).toBeInTheDocument();
  });
});
