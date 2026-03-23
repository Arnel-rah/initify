import { Check, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ProjectConfig } from "../types/type";
import { downloadZip, generateFiles } from "../utils/generateCode";

interface Props {
  config: ProjectConfig;
}

type Status = "idle" | "loading" | "done";

export default function GenerateButton({ config }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [hovered, setHovered] = useState(false);
  const disabled = status !== "idle" || !config.name.trim();

  async function handleGenerate() {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      const files = generateFiles(config);
      await downloadZip(config, files);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  }

  const bg = {
    idle:
      hovered && !disabled
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #0f0f1a 0%, #12121f 100%)",
    loading: "linear-gradient(135deg, #0f0f1a 0%, #12121f 100%)",
    done: "linear-gradient(135deg, #0a1f0a 0%, #0d1f0d 100%)",
  }[status];

  const borderColor = {
    idle:
      hovered && !disabled ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.2)",
    loading: "rgba(99,102,241,0.3)",
    done: "rgba(34,197,94,0.5)",
  }[status];

  const glowColor = {
    idle: "rgba(99,102,241,0.15)",
    loading: "rgba(99,102,241,0.08)",
    done: "rgba(34,197,94,0.15)",
  }[status];

  return (
    <>
      <style>{`
        @keyframes gen-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes gen-shimmer {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes gen-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1);    opacity: 1; }
        }
        .gen-shimmer-line {
          animation: gen-shimmer 1.8s ease infinite;
        }
        .gen-icon-pop {
          animation: gen-pop 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      <button
        onClick={handleGenerate}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width: "100%",
          padding: "14px 24px",
          borderRadius: 10,
          border: `1px solid ${borderColor}`,
          background: bg,
          boxShadow: disabled
            ? "none"
            : status === "idle"
              ? "0 0 24px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
              : hovered
                ? "0 0 32px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled && status === "idle" ? 0.45 : 1,
          overflow: "hidden",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              status === "done"
                ? "linear-gradient(to right, transparent, rgba(34,197,94,0.5), transparent)"
                : `linear-gradient(to right, transparent, ${hovered ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.2)"}, transparent)`,
            transition: "background 0.25s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 100%, ${glowColor} 0%, transparent 70%)`,
            transition: "background 0.25s ease",
          }}
        />
        {status === "loading" && (
          <div
            className="gen-shimmer-line"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "40%",
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.08), transparent)",
              pointerEvents: "none",
            }}
          />
        )}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {status === "loading" ? (
            <>
              <Loader2
                size={15}
                style={{
                  color: "rgba(99,102,241,0.7)",
                  animation: "gen-spin 0.8s linear infinite",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(99,102,241,0.6)",
                }}
              >
                Generating…
              </span>
              <div style={{ display: "flex", gap: 3, marginLeft: 2 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(99,102,241,0.4)",
                      animation: `gen-spin 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </>
          ) : status === "done" ? (
            <>
              <Check
                size={15}
                className="gen-icon-pop"
                style={{ color: "rgba(34,197,94,0.8)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(34,197,94,0.7)",
                }}
              >
                Downloaded
              </span>
            </>
          ) : (
            <>
              <Download
                size={15}
                style={{
                  color: hovered
                    ? "rgba(129,140,248,0.9)"
                    : "rgba(99,102,241,0.55)",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  transform: hovered ? "translateY(1px)" : "translateY(0)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', 'Geist Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: hovered
                    ? "rgba(165,180,252,0.9)"
                    : "rgba(129,140,248,0.6)",
                  transition: "color 0.2s ease",
                }}
              >
                Generate &amp; Download
              </span>
            </>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              status === "done"
                ? "linear-gradient(to right, transparent, rgba(34,197,94,0.15), transparent)"
                : "linear-gradient(to right, transparent, rgba(99,102,241,0.08), transparent)",
            transition: "background 0.25s ease",
          }}
        />
      </button>
    </>
  );
}
