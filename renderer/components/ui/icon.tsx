interface IconProps {
  type:
    | "setting"
    | "mic"
    | "headphone"
    | "not-mic"
    | "not-headphone"
    | "brush"
    | "eye"
    | "shield"
    | "member"
    | "trash"
    | "pen"
    | "plus"
    | "file"
    | "friend";
}

function Icon({ type }: IconProps) {
  if (type === "setting") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />{" "}
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (type === "mic") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />{" "}
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />{" "}
        <line x1="12" y1="19" x2="12" y2="23" />{" "}
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  }
  if (type === "headphone") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />{" "}
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    );
  }
  if (type === "not-mic") {
    return (
      <svg
        className="h-5 w-5 text-destructive"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <line x1="1" y1="1" x2="23" y2="23" />{" "}
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />{" "}
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />{" "}
        <line x1="12" y1="19" x2="12" y2="23" />{" "}
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  }
  if (type === "not-headphone") {
    return (
      <svg
        className="h-5 w-5 text-destructive"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        <line
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          stroke="destext-destructive"
          strokeWidth="2"
        />
      </svg>
    );
  }
  if (type === "brush") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <path d="M3 21v-4a4 4 0 1 1 4 4h-4" />{" "}
        <path d="M21 3a16 16 0 0 0 -12.8 10.2" />{" "}
        <path d="M21 3a16 16 0 0 1 -10.2 12.8" />{" "}
        <path d="M10.6 9a9 9 0 0 1 4.4 4.4" />
      </svg>
    );
  }

  if (type === "eye") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (type === "member") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  }

  if (type === "trash") {
    return (
      <svg
        className="h-5 w-5 text-destructive"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    );
  }
  if (type === "pen") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    );
  }
  if (type === "plus") {
    return (
      <svg
        className="h-5 w-5 text-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }
  if (type === "file") {
    return (
      <svg
        className="h-20 w-20 text-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />{" "}
        <polyline points="14 2 14 8 20 8" />{" "}
        <line x1="16" y1="13" x2="8" y2="13" />{" "}
        <line x1="16" y1="17" x2="8" y2="17" />{" "}
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }

  if (type === "friend") {
    return (
      <svg
        className=""
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          className=""
        ></path>
        <path
          fill="currentColor"
          d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z"
          className=""
        ></path>
      </svg>
    );
  }
}

export default Icon;
