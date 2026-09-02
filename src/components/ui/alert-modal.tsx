"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

type AlertType = "success" | "error" | "info";
type ModalMode = "alert" | "confirm" | "prompt";

interface AlertModalContextType {
  showAlert: (title: string, message: string, type?: AlertType) => void;
  showConfirm: (title: string, message: string) => Promise<boolean>;
  showPrompt: (title: string, message: string) => Promise<string | null>;
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

export function useAlertModal() {
  const context = useContext(AlertModalContext);
  if (!context) throw new Error("useAlertModal must be used within AlertModalProvider");
  return context;
}

export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("alert");
  const [inputValue, setInputValue] = useState("");
  const [resolveFn, setResolveFn] = useState<((value: any) => void) | null>(null);
  
  const [modalData, setModalData] = useState<{ title: string; message: string; type: AlertType }>({
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (title: string, message: string, type: AlertType = "info") => {
    setModalData({ title, message, type });
    setMode("alert");
    setResolveFn(null);
    setIsOpen(true);
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalData({ title, message, type: "info" });
      setMode("confirm");
      setResolveFn(() => resolve);
      setIsOpen(true);
    });
  };

  const showPrompt = (title: string, message: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalData({ title, message, type: "info" });
      setInputValue("");
      setMode("prompt");
      setResolveFn(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = (value: any = false) => {
    setIsOpen(false);
    if (resolveFn) {
      resolveFn(value);
      setResolveFn(null);
    }
  };

  return (
    <AlertModalContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => mode === "alert" && handleClose()} // Only click outside to close if alert
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm md:max-w-md rounded-2xl bg-background p-8 shadow-2xl border border-border"
            >
              <button
                onClick={() => handleClose(mode === "prompt" ? null : false)}
                className="absolute right-4 top-4 rounded-sm opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-4">
                {modalData.type === "success" && (
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                )}
                {modalData.type === "error" && (
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 mb-2">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                )}
                {modalData.type === "info" && mode === "alert" && (
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 mb-2">
                    <Info className="w-8 h-8" />
                  </div>
                )}
                
                <h3 className="text-xl font-bold font-serif text-foreground">{modalData.title}</h3>
                <p className="text-sm text-muted-foreground">{modalData.message}</p>

                {mode === "prompt" && (
                  <div className="w-full mt-4">
                    <Input 
                      autoFocus
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)} 
                      placeholder="Type your reason here..."
                      className="w-full"
                    />
                  </div>
                )}

                <div className={`w-full mt-6 flex gap-3 ${mode === 'alert' ? 'justify-center' : 'justify-end'}`}>
                  {mode === "alert" && (
                    <Button onClick={() => handleClose()} className="min-w-32">
                      Okay
                    </Button>
                  )}
                  
                  {(mode === "confirm" || mode === "prompt") && (
                    <>
                      <Button variant="outline" onClick={() => handleClose(mode === "prompt" ? null : false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleClose(mode === "prompt" ? inputValue : true)}>
                        Confirm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertModalContext.Provider>
  );
}
