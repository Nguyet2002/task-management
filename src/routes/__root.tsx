import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import BottomNavigation from '@/components/common/bottom-navigation';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <ToastContainer />
    </React.Fragment>
  );
}
