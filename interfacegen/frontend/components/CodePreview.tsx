type Props = {
  code: string;
  className?: string;
};

export function CodePreview({ code, className }: Props) {
  const wrapped = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'"> 
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    ${code}
  </body>
</html>`;

  return (
    <iframe
      title="preview"
      sandbox="allow-scripts"
      className={className || "h-[600px] w-full rounded-md border"}
      srcDoc={wrapped}
    />
  );
}


