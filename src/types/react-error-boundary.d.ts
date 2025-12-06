declare module 'react-error-boundary' {
  import type { ComponentType, ReactNode } from 'react';

  export type FallbackProps = {
    error: unknown;
    resetErrorBoundary: () => void;
  };

  export const ErrorBoundary: ComponentType<{
    FallbackComponent?: ComponentType<FallbackProps>;
    fallbackRender?: (props: FallbackProps) => ReactNode;
    onError?: (error: unknown, info: { componentStack: string }) => void;
    children?: ReactNode;
  }>;

  export default ErrorBoundary;
}
