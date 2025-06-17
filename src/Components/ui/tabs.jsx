import React, { useState, useEffect } from "react";
import clsx from "clsx";

// Tabs container
export function Tabs({ value, onValueChange, children }) {
  useEffect(() => {
    const handler = (e) => onValueChange?.(e.detail);
    window.addEventListener("tab-change", handler);
    return () => window.removeEventListener("tab-change", handler);
  }, [onValueChange]);

  return <div data-value={value} className="tabs">{children}</div>;
}

// Tabs List
export function TabsList({ children, className = "" }) {
  return <div className={clsx("tabs-list", className)}>{children}</div>;
}

// Tabs Trigger
export function TabsTrigger({ value, children }) {
  const handleClick = () => {
    const event = new CustomEvent("tab-change", { detail: value });
    window.dispatchEvent(event);
  };

  return (
    <button
      type="button"
      className="tabs-trigger px-4 py-2 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

// Tabs Content
export function TabsContent({ value, children, asChild = false }) {
  const [activeTab, setActiveTab] = useState(value);

  useEffect(() => {
    const handler = (e) => setActiveTab(e.detail);
    window.addEventListener("tab-change", handler);
    return () => window.removeEventListener("tab-change", handler);
  }, []);

  if (activeTab !== value) return null;

  return asChild ? children : <div>{children}</div>;
}
