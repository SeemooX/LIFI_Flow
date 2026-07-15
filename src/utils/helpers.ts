export function highlight(obj: object): string {
  const raw = JSON.stringify(obj, null, 2)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return raw.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (m) => {
      if (/:$/.test(m)) return `<span class="jk">${m}</span>`;
      if (/^"/.test(m)) return `<span class="js">${m}</span>`;
      if (/true|false/.test(m)) return `<span class="jb">${m}</span>`;
      if (/null/.test(m)) return `<span class="jn">${m}</span>`;
      return `<span class="ji">${m}</span>`;
    }
  );
}