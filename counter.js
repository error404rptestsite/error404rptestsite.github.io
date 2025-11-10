// -------------- CONFIG -----------------
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1437197635982463110/CXIfYq5NLxA1Kh94mwW_k_OL4IhAtFiIPX83Eck0q3sDdfRdeiNXlm-_Nc2nvXWMO6hx"; // ΒΑΛΕ νέο webhook εδώ
// --------------------------------------

(function () {
  // 1) ΜΗ στέλνεις σε refresh/back/forward
  const navEntry = performance.getEntriesByType("navigation")[0];
  const navType = navEntry ? navEntry.type : "navigate"; // "navigate" | "reload" | "back_forward" | "prerender"
  const isRefresh = navType === "reload";
  const isBFCache = navType === "back_forward";
  if (isRefresh || isBFCache) {
    console.log("⏭️ Skip log (refresh/back/forward)");
    return;
  }

  // 2) ΜΗ στέλνεις ξανά στο ίδιο tab/session
  if (sessionStorage.getItem("e404_logged")) {
    console.log("⏭️ Skip log (already logged this session)");
    return;
  }
  sessionStorage.setItem("e404_logged", "1");

  // 3) Προαιρετικό cooldown (π.χ. μην ξαναστείλεις από την ίδια συσκευή/visitor για 60s)
  const lastSent = Number(localStorage.getItem("e404_last_sent_ts") || 0);
  if (Date.now() - lastSent < 60_000) {
    console.log("⏭️ Skip log (cooldown)");
    return;
  }
  localStorage.setItem("e404_last_sent_ts", Date.now().toString());

  // 4) Συλλογή στοιχείων
  const device = navigator.userAgent;
  const language = navigator.language || navigator.userLanguage || "unknown";
  const referrer = document.referrer || "Direct visit";
  const time = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });

  // 5) Counter ανά συσκευή (localStorage)
  let totalVisits = parseInt(localStorage.getItem("visitCounter") || "0", 10) + 1;
  localStorage.setItem("visitCounter", String(totalVisits));

  // 6) Προετοιμασία embed
  const payload = {
    embeds: [
      {
        title: "🚨 Νέα επίσκεψη στο Error 404 Roleplay",
        color: 16711680,
        fields: [
          { name: "🕒 Ημερομηνία & Ώρα", value: time, inline: false },
          { name: "💻 Συσκευή", value: device.slice(0, 200), inline: false },
          { name: "🌍 Γλώσσα", value: language, inline: true },
          { name: "↩️ Από", value: referrer, inline: false },
          { name: "👥 Συνολικές Επισκέψεις", value: String(totalVisits), inline: true }
        ],
        footer: { text: "Error404Roleplay.gr — Visitor Tracker" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  // 7) Αποστολή στο Discord (με fallback σε sendBeacon)
  const json = JSON.stringify(payload);
  try {
    // Προσπάθησε με fetch
    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
      keepalive: true
    }).then(() => console.log("✅ Visit logged to Discord (fetch)"))
      .catch(() => {
        // Fallback σε sendBeacon (χωρίς headers)
        const blob = new Blob([json], { type: "application/json" });
        const ok = navigator.sendBeacon && navigator.sendBeacon(DISCORD_WEBHOOK, blob);
        console.log(ok ? "✅ Visit logged to Discord (beacon)" : "❌ Beacon failed");
      });
  } catch (e) {
    // Απόλυτο fallback σε beacon
    const blob = new Blob([json], { type: "application/json" });
    const ok = navigator.sendBeacon && navigator.sendBeacon(DISCORD_WEBHOOK, blob);
    console.log(ok ? "✅ Visit logged (beacon-only)" : "❌ Send failed", e);
  }
})();
