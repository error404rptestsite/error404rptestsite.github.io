// -------------- CONFIG -----------------
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1437197635982463110/CXIfYq5NLxA1Kh94mwW_k_OL4IhAtFiIPX83Eck0q3sDdfRdeiNXlm-_Nc2nvXWMO6hx";
const COUNTER_URL = "https://api.counterapi.dev/v2/error404s-team-1607/first-counter-1607";
const API_KEY = "ut_wd8PBVQA8lJId93BN3E6rhKyemeWzf3YvG82xN3u";
// --------------------------------------

async function sendVisitLog() {
  try {
    // 🧠 Έλεγχος για refresh (session-based)
    if (sessionStorage.getItem("visitLogged") === "true") {
      console.log("↩️ Refresh detected — δε στέλνεται νέο log.");
      return;
    }
    sessionStorage.setItem("visitLogged", "true");

    // --- συλλογή στοιχείων χρήστη ---
    const device = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const referrer = document.referrer || "Direct visit";
    const time = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });

    // --- αύξηση global counter (v2 API) ---
    let totalVisits = "N/A";
    try {
      const response = await fetch(`${COUNTER_URL}/up`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "accept": "application/json"
        }
      });

      const text = await response.text();
      console.log("📦 Raw API Response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      totalVisits = data.count ?? data.value ?? data.total ?? "N/A";
    } catch (err) {
      console.warn("⚠️ Counter API error:", err);
    }

    // --- δημιουργία embed ---
    const embed = {
      embeds: [
        {
          title: "🚨 Νέα επίσκεψη στο Error404 Roleplay",
          color: 16711680,
          fields: [
            { name: "🕒 Ημερομηνία & Ώρα", value: time, inline: false },
            { name: "💻 Συσκευή", value: device.slice(0, 180), inline: false },
            { name: "🌍 Γλώσσα", value: language, inline: true },
            { name: "↩️ Από", value: referrer, inline: false },
            { name: "👥 Συνολικές Επισκέψεις (Global)", value: String(totalVisits), inline: true }
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

    console.log(`✅ Visit logged! (Global count: ${totalVisits})`);
  } catch (err) {
    console.error("❌ Error sending log:", err);
  }
}

sendVisitLog();
