// -------------- CONFIG -----------------
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1437197635982463110/CXIfYq5NLxA1Kh94mwW_k_OL4IhAtFiIPX83Eck0q3sDdfRdeiNXlm-_Nc2nvXWMO6hx"; // βάλε το δικό σου
const COUNTER_URL = "https://api.counterapi.dev/v2/error404s-team-1607/first-counter-1607";
const API_KEY = "ut_wd8PBVQA8lJId93BN3E6rhKyemeWzf3YvG82xN3u";
// --------------------------------------

async function sendVisitLog() {
  try {
    // --- συλλογή στοιχείων ---
    const device = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const referrer = document.referrer || "Direct visit";
    const time = new Date().toLocaleString();

    // --- αύξηση global counter ---
    const counterRes = await fetch(`${COUNTER_URL}/up`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json"
      }
    });
    const counterData = await counterRes.json();
    const totalVisits = counterData.count || counterData.value || "N/A";

    // --- προετοιμασία embed ---
    const embed = {
      embeds: [
        {
          title: "🚨 Νέα επίσκεψη στο Error404 Roleplay",
          color: 16711680,
          fields: [
            { name: "🕒 Ημερομηνία & Ώρα", value: time },
            { name: "💻 Συσκευή", value: device.slice(0, 200) },
            { name: "🌍 Γλώσσα", value: language },
            { name: "↩️ Από", value: referrer },
            { name: "👥 Συνολικές Επισκέψεις", value: totalVisits.toString() }
          ],
          footer: { text: "Error404Roleplay.gr — Visitor Tracker" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // --- αποστολή στο Discord ---
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

sendVisitLog();
