import React from "react";

const messageLines = [
  "Relationship main baar baar mujhe khud ki innocence prove karni pade",
  "Woh bhi kisi aur ke rotten twisted dimaag ke wajah se",
  "Loyal rah ke bhi baar baar cheat karne ka ilzaam lagta rahe",
  "Khud ki naukri ki kasam khani pade taaki saamne wala meri baat samjhe without an agenda",
  "Main ye sab ab sahan nahi kar sakta hoon",
];

export default function App() {
  return (
    <>
      <style>{`
        @keyframes message-arrive {
          from { opacity: 0; transform: translateY(14px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .message-line {
          color: #5a3d58;
          animation: message-arrive 700ms cubic-bezier(.2,.75,.25,1) both;
          text-wrap: balance;
        }
        @media (prefers-reduced-motion: reduce) {
          .message-line { animation: none; }
        }
      `}</style>
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
      <section
        aria-label="Message"
        style={{
          width: "100%",
          maxWidth: "480px",
          textAlign: "center",
        }}
      >
        {messageLines.map((line, index) => (
          <h2
            key={line}
            className="message-line"
            style={{
              fontSize: "clamp(15px, 4.4vw, 22px)",
              lineHeight: 1.3,
              margin: "0 0 0.7em",
              overflowWrap: "anywhere",
              animationDelay: `${index * 180}ms`,
            }}
          >
            {line}
          </h2>
        ))}
      </section>
      </main>
    </>
  );
}
