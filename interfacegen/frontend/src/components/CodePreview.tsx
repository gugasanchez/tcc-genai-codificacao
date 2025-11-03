type Props = { code: string; height?: number };

export default function CodePreview({ code, height = 480 }: Props) {
  const csp = [
    "default-src 'none'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "font-src 'self' data:",
    "connect-src 'none'",
    "frame-ancestors 'none'",
  ].join("; ");

  const wrapped = `<!doctype html><html><head><meta charset=\"utf-8\"><meta http-equiv=\"Content-Security-Policy\" content=\"${csp}\"></head><body>${code}</body></html>`;

  return (
    <iframe
      title="preview"
      sandbox="allow-scripts"
      className="w-full"
      style={{ height }}
      srcDoc={wrapped}
    />
  );
}
