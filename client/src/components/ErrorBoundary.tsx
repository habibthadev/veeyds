import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-4">
            Something went wrong
          </p>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text)] mb-3">
            Unexpected error
          </h1>
          <p className="text-[var(--color-muted)] max-w-md mb-8 text-sm leading-relaxed">
            {this.state.error?.message ?? "An unknown error occurred."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium text-sm transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
