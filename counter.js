// -------------- CONFIG -----------------
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1437197635982463110/CXIfYq5NLxA1Kh94mwW_k_OL4IhAtFiIPX83Eck0q3sDdfRdeiNXlm-_Nc2nvXWMO6hx"; // βάλε εδώ το δικό σου webhook
// --------------------------------------

async function sendVisitLog() {
  try {
    // --- συλλογή στοιχείων χρήστη ---
    const device = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const referrer = document.referrer || "Direct visit";
    const time = new Date().toLocaleString();

    // --- counter από localStorage (απλός, client-side) ---
    let totalVisits = localStorage.getItem("visitCounter") || 0;
    totalVisits = parseInt(totalVisits) + 1;
    localStorage.setItem("visitCounter", totalVisits);

    // --- προετοιμασία embed ---
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

    // --- αποστολή στο Discord webhook ---
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

// Τρέχει αυτόματα μόλις φορτώσει η σελίδα
sendVisitLog();

