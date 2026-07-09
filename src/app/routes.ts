import {createHashRouter } from "react-router";
import Root from "./layout/Root";
import Home from "./pages/Home";
import Quran from "./pages/Quran";
import Games from "./pages/Games";
import Fun from "./pages/Fun";
import Certificate from "./pages/Certificate";
import Whiteboard from "./pages/Whiteboard";
import Tasks from "./pages/Tasks";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,             Component: Home        },
      { path: "quran",           Component: Quran       },
      { path: "games",           Component: Games       },
      { path: "fun",             Component: Fun         },
      { path: "certificate",     Component: Certificate },
      { path: "whiteboard",      Component: Whiteboard  },
      { path: "tasks",           Component: Tasks       },
    ],
  },
]);
