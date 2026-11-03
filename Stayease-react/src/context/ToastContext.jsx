import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bgClass = "bg-gray-900 border-gray-700 text-white";
          let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

          if (toast.type === "success") {
            bgClass = "bg-[#0d1f1d] border-[#00CEC9]/40 text-[#d1faf5]";
            icon = <CheckCircle2 className="w-5 h-5 text-[#00CEC9] shrink-0" />;
          } else if (toast.type === "error") {
            bgClass = "bg-[#251014] border-red-500/40 text-red-100";
            icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
          } else if (toast.type === "warning") {
            bgClass = "bg-[#261f0d] border-amber-500/40 text-amber-100";
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
