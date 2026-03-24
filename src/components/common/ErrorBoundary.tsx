import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 min-h-[50vh]">
          <div className="bg-white border rounded-xl shadow-sm p-10 text-center max-w-md">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              예기치 않은 오류가 발생했습니다
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {this.state.error?.message || "페이지를 다시 로드해 주세요."}
            </p>
            <Button onClick={this.handleReset}>다시 시도</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
