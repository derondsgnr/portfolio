import React from "react";
import type { DeviceType } from "../../../types/case-study";

/**
 * DEVICE MOCKUP FRAMES
 * Phone, Browser, Tablet, Watch — pure CSS frames
 * that wrap any content (image, iframe, video).
 */

interface DeviceMockupProps {
  device: DeviceType;
  children: React.ReactNode;
  className?: string;
}

export function DeviceMockup({ device, children, className = "" }: DeviceMockupProps) {
  if (device === "none") return <div className={className}>{children}</div>;

  const frames: Record<Exclude<DeviceType, "none">, () => React.ReactNode> = {
    phone: () => <PhoneMockup className={className}>{children}</PhoneMockup>,
    browser: () => <BrowserMockup className={className}>{children}</BrowserMockup>,
    tablet: () => <TabletMockup className={className}>{children}</TabletMockup>,
    watch: () => <WatchMockup className={className}>{children}</WatchMockup>,
  };

  return <>{frames[device]()}</>;
}

function PhoneMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div
        className="relative rounded-[2.5rem] border-[3px] border-[#2a2a2a] bg-[#111] p-2 shadow-2xl"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.8)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-[1.5rem] bg-[#111] rounded-b-2xl z-10" />
        {/* Screen — children fill entirely via [&_img]:object-cover */}
        <div className="relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] aspect-[9/19.5] [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
          {children}
        </div>
        {/* Bottom indicator */}
        <div className="flex justify-center mt-1.5 mb-0.5">
          <div className="w-[35%] h-[4px] bg-[#333] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function BrowserMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex flex-col w-full ${className}`}>
      <div
        className="relative rounded-xl border border-[#2a2a2a] bg-[#111] overflow-hidden shadow-2xl"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 25px 50px -12px rgba(0,0,0,0.7)",
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1a1a1a] bg-[#0f0f0f]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-8">
            <div className="bg-[#1a1a1a] rounded-md px-3 py-1 text-[10px] text-[#666] font-mono text-center">
              app.dara.finance
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="relative bg-[#0a0a0a]">
          {children}
        </div>
      </div>
    </div>
  );
}

function TabletMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div
        className="relative rounded-[1.5rem] border-[3px] border-[#2a2a2a] bg-[#111] p-2 shadow-2xl"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.8)",
        }}
      >
        <div className="relative rounded-[1rem] overflow-hidden bg-[#0a0a0a] aspect-[4/3]">
          {children}
        </div>
      </div>
    </div>
  );
}

function WatchMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* Watch band top hint */}
      <div className="w-[60%] h-3 bg-[#1a1a1a] rounded-t-lg" />
      <div
        className="relative rounded-[2rem] border-[3px] border-[#2a2a2a] bg-[#111] p-1.5 shadow-2xl"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 15px 30px -8px rgba(0,0,0,0.8)",
        }}
      >
        {/* Crown button */}
        <div className="absolute -right-[6px] top-[30%] w-[4px] h-[16px] bg-[#333] rounded-r" />
        <div className="relative rounded-[1.5rem] overflow-hidden bg-[#0a0a0a] aspect-square w-full">
          {children}
        </div>
      </div>
      <div className="w-[60%] h-3 bg-[#1a1a1a] rounded-b-lg" />
    </div>
  );
}

export { PhoneMockup, BrowserMockup, TabletMockup, WatchMockup };