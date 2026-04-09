function baseProps(className) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": "true",
  };
}

export function Icon({ name, className = "h-5 w-5" }) {
  const props = baseProps(className);

  if (name === "workout") {
    return (
      <svg {...props}>
        <path d="M3 10v4" />
        <path d="M6 8v8" />
        <path d="M18 8v8" />
        <path d="M21 10v4" />
        <path d="M6 12h12" />
      </svg>
    );
  }

  if (name === "home") {
    return (
      <svg {...props}>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6.5 9.5V20h11V9.5" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  }

  if (name === "ranks") {
    return (
      <svg {...props}>
        <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" />
        <path d="m12 8 1.5 3 3.3.3-2.5 2.2.8 3.2-3.1-1.8-3.1 1.8.8-3.2-2.5-2.2 3.3-.3L12 8Z" />
      </svg>
    );
  }

  if (name === "nutrition") {
    return (
      <svg {...props}>
        <path d="M12 20c4.2-2.8 6.5-6 6.5-9.5A4.5 4.5 0 0 0 14 6c-1 0-1.9.3-2.7.8C10.5 6.3 9.6 6 8.6 6A4.6 4.6 0 0 0 4 10.5C4 14 6.4 17.2 12 20Z" />
        <path d="M12 6V3" />
      </svg>
    );
  }

  if (name === "friends") {
    return (
      <svg {...props}>
        <circle cx="9" cy="9" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M4.5 19a4.5 4.5 0 0 1 9 0" />
        <path d="M14 19a3.5 3.5 0 0 1 6 0" />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg {...props}>
        <path d="M15 17H5.5l1.2-1.6A4 4 0 0 0 7.5 13V10a4.5 4.5 0 1 1 9 0v3c0 .9.3 1.8.8 2.5L18.5 17H15" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="m19 12 1.5-1-1.5-3-1.8.3a6.8 6.8 0 0 0-1.4-1.4L16 5l-3-1.5L12 5l-1-.5L8 6l.3 1.8c-.5.4-1 .9-1.4 1.4L5 8.5 3.5 11 5 12l-.5 1L6 16l1.8-.3c.4.5.9 1 1.4 1.4L8.5 19 11 20.5 12 19l1 .5 3-1.5-.3-1.8c.5-.4 1-.9 1.4-1.4L19 15.5 20.5 13 19 12Z" />
      </svg>
    );
  }

  if (name === "help") {
    return (
      <svg {...props}>
        <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.8.8-1.8 1.3-1.8 2.8" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  if (name === "fire") {
    return (
      <svg {...props}>
        <path d="M12 3c1.2 2.1 2.5 3.3 3.6 4.4 1.2 1.1 2.4 2.4 2.4 4.8A6 6 0 0 1 6 12.2c0-1.9.8-3.2 2-4.4 1-1 2.4-2.2 4-4.8Z" />
      </svg>
    );
  }

  if (name === "xp") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="8" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }

  if (name === "spark") {
    return (
      <svg {...props}>
        <path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4Z" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...props}>
        <path d="m5 12 4 4 10-10" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
