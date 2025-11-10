const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1437197635982463110/CXIfYq5NLxA1Kh94mwW_k_OL4IhAtFiIPX83Eck0q3sDdfRdeiNXlm-_Nc2nvXWMO6hx";
const COUNTER_PROXY = "https://eooxxricods0l55.m.pipedream.net"; // <-- βάλε το δικό σου Pipedream URL

async function sendVisitLog() {
  try {
    const device = navigator.userAgent;
    const language = navigator.language;
    const referrer = document.referrer || "Direct visit";
    const time = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });

    // 🔁 Counter μέσω Proxy (πάντα λειτουργεί)
    const counterRes = await fetch(COUNTER_PROXY);
    const counterData = await counterRes.json();
    const totalVisits = counterData.count || counterData.value || counterData.total || "N/A";

    // 📦 Embed
    const embed = {
      embeds: [
        {
          title: "🚨 Νέα επίσκεψη στο Error404 Roleplay",
          color: 16711680,
          fields: [
            { name: "🕒 Ημερομηνία & Ώρα", value: time },
            { name: "💻 Συσκευή", value: device.slice(0, 180) },
            { name: "🌍 Γλώσσα", value: language },
            { name: "↩️ Από", value: referrer },
            { name: "👥 Συνολικές Επισκέψεις", value: String(totalVisits) }
          ],
          footer: { text: "Error404Roleplay.gr — Visitor Tracker" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    });

    console.log("✅ Visit sent via proxy!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

sendVisitLog();
