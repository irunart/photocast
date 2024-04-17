import React, { useLayoutEffect, useRef } from "react";
import { Router } from "react-router-dom";
import {
  Location,
  To,
  UrlHistory,
  UrlHistoryOptions,
  createLocation,
  getUrlBasedHistory,
  parsePath,
  warning,
} from "./history";

export interface QueryRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

export interface QueryHistory extends UrlHistory {}

export type QueryHistoryOptions = UrlHistoryOptions;

const createQueryHistory = (options: QueryHistoryOptions = {}): QueryHistory => {
  const createQueryLocation = (window: Window, globalHistory: Window["history"]) => {
    const searchParams = new URLSearchParams(window.location.search);
    const path = Array.from(searchParams).find(([k]) => k.startsWith("/"));
    let pathname = "/";
    let search = "";
    if (path) {
      pathname = path[0];
      searchParams.delete(path[0]);
      search = searchParams.toString();
    }
    return createLocation(
      "",
      { pathname, search },
      // state defaults to `null` because `window.history.state` does
      (globalHistory.state && globalHistory.state.usr) || null,
      (globalHistory.state && globalHistory.state.key) || "default"
    );
  };

  const createQueryHref = (_: Window, to: To) => {
    let href = "";
    const toPath = typeof to === "string" ? parsePath(to) : to;
    href += "?" + (toPath.pathname || "/");
    const search = toPath.search?.substring(1);
    if (search) {
      href += "&" + search;
    }
    return href;
  };

  const validateLocation = (location: Location, to: To) => {
    warning(
      location.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(to)})`
    );
  };

  return getUrlBasedHistory(createQueryLocation, createQueryHref, validateLocation, options);
};

export const QueryRouter: React.FC<QueryRouterProps> = ({ basename, children, window }) => {
  let historyRef = useRef<QueryHistory>();
  if (historyRef.current == null) {
    historyRef.current = createQueryHistory({ window, v5Compat: true });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history, setState]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};
