import React from 'react';
import type { FallbackProps } from 'react-error-boundary';

const ErrorPage: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const message = (error && (error as Error).message) ? (error as Error).message : String(error);

  return (
    <div className="p-4 text-center m-4">
      <h2>哎呀！出了點問題</h2>
      <p className="mb-4">頁面載入時發生錯誤。</p>
      {message && (
        <div className="text-sm text-red-500 mb-4 break-words">{message}</div>
      )}
      <div className="flex justify-center gap-3">
        <button
          onClick={resetErrorBoundary}
          className="p-2 px-4 bg-blue-500 text-white rounded"
          type="button"
        >
          嘗試重新整理元件
        </button>
        <button
          onClick={() => window.location.reload()}
          className="p-2 px-4 border rounded"
          type="button"
        >
          手動重新載入
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
