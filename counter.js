// ---------- CONFIG ----------
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/XXXXXX"; // <--- βάλε εδώ το webhook σου
// ----------------------------

async function sendVisitLog() {
  try {
    // --- συλλογή πληροφοριών χρήστη ---
    const device = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const referrer = document.referrer || "Direct visit";
    const time = new Date().toLocaleString();

    // --- αποθήκευση τελευταίας επίσκεψης ---
    const lastVisit = sessionStorage.getItem("lastVisit") || null;
    const isRefresh = performance.getEntriesByType("navigation")[0]?.type === "reload";

    // --- counter μόνο για πρώτη επίσκεψη στη session (όχι refresh) ---
    if (isRefresh) {
      console.log("🔁 Refresh detected — log skipped.");
      return;
    }

    // --- counter από localStorage (ανά συσκευή) ---
    let totalVisits = localStorage.getItem("visitCounter") || 0;
    totalVisits = parseInt(totalVisits) + 1;
    localStorage.setItem("visitCounter", totalVisits);
    sessionStorage.setItem("lastVisit", time);

    // --- embed για Discord ---
    const embed = {
      embeds: [
        {
          title: "🚨 Νέα επίσκεψη στο Error404 Roleplay",
          color: 16711680,
          fields: [
            { name: "🕒 Ημερομηνία & Ώρα", value: time, inline: false },
            { name: "💻 Συσκευή", value: device.slice(0, 200), inline: false },
            { name: "🌍 Γλώσσα", value: language, inline: true },
            { name: "↩️ Από", value: referrer, inline: false },
            { name: "👥 Συνολικές Επισκέψεις", value: totalVisits.toString(), inline: true }
          ],
          footer: { text: "Error404Roleplay.gr — Visitor Tracker" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // --- αποστολή embed στο Discord ---
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    });

    console.log("✅ Visit logged to Discord!");
  } catch (err) {
    console.error("❌ Error sending log:", err);
  }
}

// τρέχει αυτόματα
sendVisitLog();
