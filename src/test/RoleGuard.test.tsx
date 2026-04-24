import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createRouter, createRootRoute, createRoute, createMemoryHistory, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/RoleGuard";
import { useApp } from "@/lib/store";
import { useAudit } from "@/lib/audit";

function renderWithRouter(ui: React.ReactNode) {
  const root = createRootRoute({ component: () => <Outlet /> });
  const index = createRoute({ getParentRoute: () => root, path: "/", component: () => <>{ui}</> });
  const login = createRoute({ getParentRoute: () => root, path: "/login", component: () => <div>login</div> });
  const directory = createRoute({ getParentRoute: () => root, path: "/directory", component: () => <div>directory</div> });
  const workspace = createRoute({ getParentRoute: () => root, path: "/workspace", component: () => <div>workspace</div> });
  const router = createRouter({
    routeTree: root.addChildren([index, login, directory, workspace]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

beforeEach(() => useAudit.setState({ events: [] }));

describe("RoleGuard", () => {
  it("renders children when role is allowed", () => {
    useApp.setState({ user: { name: "Alex", email: "a@a", role: "client" } });
    renderWithRouter(
      <RoleGuard action="view:directory" requiredRole="client">
        <div>directory content</div>
      </RoleGuard>
    );
    expect(screen.getByText("directory content")).toBeInTheDocument();
  });

  it("blocks wrong role and shows Access denied state", () => {
    useApp.setState({ user: { name: "Alex", email: "a@a", role: "client" } });
    renderWithRouter(
      <RoleGuard action="view:workspace" requiredRole="lawyer">
        <div>workspace content</div>
      </RoleGuard>
    );
    expect(screen.queryByText("workspace content")).not.toBeInTheDocument();
    expect(screen.getByTestId("access-denied")).toBeInTheDocument();
    expect(screen.getByText(/Access denied/i)).toBeInTheDocument();
  });

  it("logs an access_denied audit event when blocked", () => {
    useApp.setState({ user: { name: "Alex", email: "a@a", role: "client" } });
    renderWithRouter(
      <RoleGuard action="generate:invoice">
        <div>secret</div>
      </RoleGuard>
    );
    const events = useAudit.getState().events;
    expect(events.some((e) => e.type === "access_denied" && e.detail.includes("generate:invoice"))).toBe(true);
  });

  it("blocks unauthenticated users", () => {
    useApp.setState({ user: null });
    renderWithRouter(
      <RoleGuard action="view:dashboard">
        <div>dash</div>
      </RoleGuard>
    );
    expect(screen.queryByText("dash")).not.toBeInTheDocument();
    expect(screen.getByTestId("access-denied")).toBeInTheDocument();
  });
});
