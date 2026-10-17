import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Caught by ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center px-6">
          <AlertTriangle className="h-12 w-12 text-expense" />
          <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
          <p className="text-muted max-w-md">
            The dashboard hit an unexpected error. Try refreshing the page — if it persists, your data is still safe.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
