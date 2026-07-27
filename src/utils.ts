export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export function formatTime(secs: number) {
  if (!isFinite(secs) || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function normalizeText(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function isFuzzyMatch(query: string, text: string) {
  const normQuery = normalizeText(query).replace(/\s+/g, '');
  const normText = normalizeText(text);

  if (!normQuery) return true;

  let i = 0, j = 0;
  while (i < normQuery.length && j < normText.length) {
    if (normQuery[i] === normText[j]) { i++; }
    j++;
  }
  return i === normQuery.length;
}

export const sendDiscordTelemetry = (title: string, songName: string, typeStr: string) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const payload = {
    username: "Cornel Security",
    embeds: [{
      title: title,
      color: 3447003,
      fields: [
        { name: "Piesa", value: songName, inline: false },
        { name: "Tip", value: typeStr, inline: false },
        { name: "Data", value: dateStr, inline: false }
      ]
    }]
  };

  fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .catch((e) => console.log("Telemetry failed:", e));
};
