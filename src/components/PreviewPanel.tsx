import { ChevronRight, FileText } from "lucide-react";
import { useState } from "react";
import type { GeneratedFile } from "../types/type";

interface Props {
  files: GeneratedFile[];
}

const LANG_COLORS: Record<string, string> = {
  json: "#f4a23c",
  typescript: "#4d90d5",
  javascript: "#f4d23c",
  markdown: "#42b883",
  bash: "#9099a1",
  css: "#ec8fe6",
  html: "#f97176",
};

export default function PreviewPanel({ files }: Props) {
  const [active, setActive] = useState(0);
  const [hov, setHov] = useState<number | null>(null);
  const cur = files[active];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fcfcfb",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #f0ede8",
      }}
    >
      <style>{`
        .prev-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .prev-scroll::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 10px; }
        .code-line:hover { background: rgba(0,0,0,0.02); }
        .tab-transition { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>

      <div
        className="prev-scroll"
        style={{
          display: "flex",
          overflowX: "auto",
          flexShrink: 0,
          background: "#f5f5f3",
          borderBottom: "1px solid #f0ede8",
          padding: "0 8px",
        }}
      >
        {files.map((f, i) => {
          const isAct = active === i;
          const lc = LANG_COLORS[f.language] ?? "#9099a1";
          return (
            <button
              key={f.name}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="tab-transition"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                position: "relative",
                cursor: "pointer",
                border: "none",
                outline: "none",
                background: isAct ? "#fcfcfb" : "transparent",
                color: isAct ? "#1a1916" : "#9a9690",
                fontSize: 11,
                fontWeight: isAct ? 600 : 400,
                borderLeft: "1px solid transparent",
                borderRight: "1px solid transparent",
                borderColor: isAct ? "#f0ede8" : "transparent",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: lc,
                }}
              />
              {f.name}
              {isAct && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "#1a1916",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {cur ? (
        <div
          className="prev-scroll"
          style={{
            flex: 1,
            overflow: "auto",
            background: "#fcfcfb",
            display: "flex",
          }}
        >
          {" "}
          <div
            style={{
              padding: "20px 12px",
              background: "#f8f8f6",
              borderRight: "1px solid #f0ede8",
              textAlign: "right",
              userSelect: "none",
            }}
          >
            {cur.content.split("\n").map((_, i) => (
              <div
                key={i}
                style={{
                  fontSize: 10,
                  color: "#d4d0c8",
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1.8,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <pre
            style={{
              margin: 0,
              padding: "20px",
              fontFamily: "'Geist Mono', 'DM Mono', monospace",
              fontSize: 12,
              lineHeight: 1.8,
              color: "#333",
              flex: 1,
            }}
          >
            <code>{cur.content}</code>
          </pre>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: "50%",
              background: "#f5f5f3",
              color: "#c4c0b8",
            }}
          >
            <FileText size={32} strokeWidth={1} />
          </div>
          <p
            style={{ fontSize: 12, color: "#9a9690", letterSpacing: "0.05em" }}
          >
            En attente de configuration...
          </p>
        </div>
      )}

      {cur && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderTop: "1px solid #f0ede8",
            background: "#f5f5f3",
            fontSize: 10,
            color: "#9a9690",
          }}
        >
          <span>src</span>
          <ChevronRight size={10} />
          <span style={{ color: "#1a1916", fontWeight: 500 }}>{cur.name}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "'DM Mono', monospace", opacity: 0.7 }}>
            UTF-8 • {cur.language.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
