import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";

interface AnniversaryBannerProps {
  onReplayFireworks: () => void;
}

const AnniversaryBanner = ({ onReplayFireworks }: AnniversaryBannerProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section
      className={`pointer-events-none fixed left-1/2 z-dropdown -translate-x-1/2 sm:top-3 sm:w-fit ${
        collapsed ? "top-1 w-auto max-w-[calc(100vw-2rem)]" : "top-2 w-[calc(100vw-1rem)]"
      }`}
    >
      <div
        className="pointer-events-auto relative flex w-full overflow-hidden rounded-xl border shadow-md transition-all duration-200 sm:w-auto sm:max-w-[calc(100vw-6rem)]"
        style={{
          background: "var(--celebration-banner-bg)",
          borderColor: "var(--celebration-banner-border)",
          color: "var(--celebration-banner-fg)",
          padding: collapsed ? "0.35rem 0.45rem" : "0.5rem 0.75rem",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_15%_20%,white_0%,transparent_35%),radial-gradient(circle_at_85%_80%,white_0%,transparent_30%)]" />

        <div className="relative z-10 flex w-full items-start gap-1.5 sm:w-auto sm:items-center">
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 space-y-0.5 pr-1">
                <p className="text-sm font-semibold leading-tight sm:text-base">🎉 我们的一周年快乐 🎉</p>
                <p className="text-[11px] leading-tight wrap-break-word sm:text-xs">✨🥂 Happy 1st Anniversary, darling! 🥂✨</p>
              </div>

              <button
                type="button"
                onClick={onReplayFireworks}
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-transparent bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:brightness-95 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"
              >
                <Sparkles className="size-3.5" />
              </button>
            </>
          )}

          {collapsed && (
            <span className="rounded-full px-1.5 py-0 text-[12px] font-medium text-foreground/90 sm:px-2 sm:py-0.5 sm:text-[11px]">
              💛 1st Anniversary
            </span>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className={`inline-flex shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/90 text-primary-foreground shadow-sm transition-all hover:brightness-95 cursor-pointer ${
              collapsed ? "px-1.5 py-0.5" : "px-2 py-1"
            }`}
          >
            {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnniversaryBanner;
