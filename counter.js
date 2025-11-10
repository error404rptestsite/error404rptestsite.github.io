<script>
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1437197635982463110/CXIfYq5NLxA1Kh94mwW_k_OL4IhAtFiIPX83Eck0q3sDdfRdeiNXlm-_Nc2nvXWMO6hx";
const GIST_URL = "https://gist.githubusercontent.com/error404rptestsite/a9a238ec42d6e02e6ac09185f0395e71/raw/341f40b1c2330fb4ce522f6ccee25ebc63fc7d4c/gistfile1.txt"; // <-- Βάλε εδώ το δικό σου Gist URL

async function sendVisitLog() {
  try {
    // 📦 Βήμα 1: Πάρε το τωρινό count
    const res = await fetch(GIST_URL + "?nocache=" + Date.now());
    let data = await res.json();
    let totalVisits = (data.count || 0) + 1;

    // 📤 Βήμα 2: Κάνε update στο Gist (με χρήση GitHub API)
    await fetch(GIST_URL.replace('/raw/', '/'), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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" // <-- θα βάλεις εδώ το προσωπικό σου GitHub token (μόνο 1 φορά)
      },
      body: JSON.stringify({
        files: { "visit-counter.json": { content: JSON.stringify({ count: totalVisits }) } }
      })
    });

    // 📅 Πληροφορίες επισκέπτη
    const device = navigator.userAgent;
    const language = navigator.language;
    const referrer = document.referrer || "Direct visit";
    const time = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });

    // 💬 Embed
    const embed = {
      embeds: [
        {
          title: "🚨 Νέα Επίσκεψη στο Error404 Roleplay",
          color: 16711680,
          fields: [
            { name: "🕒 Ημερομηνία & Ώρα", value: time },
            { name: "💻 Συσκευή", value: device.slice(0, 150) },
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

    console.log(`✅ Εστάλη embed — σύνολο επισκέψεων: ${totalVisits}`);
  } catch (err) {
    console.error("❌ Σφάλμα:", err);
  }
}

sendVisitLog();
</script>

