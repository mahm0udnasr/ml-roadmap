"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useIsAdmin() {
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const viewer = useQuery(api.viewer.getViewer);

  const isLoading = isConvexAuthLoading || viewer === undefined;
  const isAdmin = viewer?.isAdmin === true;

  return { isAdmin, isLoading, isAuthenticated, viewer };
}
