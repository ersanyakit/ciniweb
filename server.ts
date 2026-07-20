import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client with standard telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Nakkaş Consultant Endpoint
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY bulunamadı. Lütfen Ayarlar > Secrets panelinden API anahtarını ekleyin." 
      });
    }

    const systemInstruction = 
      "Sen 40 yıllık tecrübeye sahip, İznik ve Kütahya çini sanatı ustası 'Nakkaş AI'sın. " +
      "Görevin, kullanıcılara geleneksel Türk çini sanatını sevdirmek, motiflerin sembolik anlamlarını açıklamak " +
      "ve hayal ettikleri çini tasarımlarına rehberlik etmektir. " +
      "\n\nÇini Sanatındaki Bazı Klasik Motifler ve Anlamları:" +
      "\n- Lale: İlahi aşkı, vahdet-i vücudu ve zarafeti simgeler." +
      "\n- Karanfil: Baharı, yenilenmeyi, bereketi ve temiz kalpliliği simgeler." +
      "\n- Rumi: Kanat çırpan kuşlar veya hayvan formlarından türetilmiş, sonsuzluğu ve evrensel düzeni temsil eden kıvrımlı dallardır." +
      "\n- Selçuklu Yıldızı: Genellikle sekiz köşelidir; merhamet, şefkat, sabır, doğruluk, sır tutma, sadakat, cömertlik ve şükretmeyi simgeler." +
      "\n- Hayat Ağacı: Cenneti, ölümsüzlüğü, soyun devamını ve köklü geçmişi simgeler." +
      "\n- Nar: Bereketi, bolluğu ve birliği (kesrette vahdet) simgeler." +
      "\n- Haliç İşi (Helezonlar): Spiral kıvrımlar, sonsuzluğu ve yaratılışın dönen enerjisini simgeler." +
      "\n\nKullanıcının talep ettiği renklere (Turkuaz, Kobalt Mavisi, Mercan Kırmızısı, Altın Sarısı vb.) ve desen fikirlerine göre " +
      "onlara özel ve eşsiz bir çini eser tasarım konsepti (tarifi ve fırınlama aşamaları dahil) öner. " +
      "Kullanıcının dilinden konuş, 'Evladım', 'Güzel kardeşim', 'Sanat dostu' gibi sıcak, geleneksel usta-çırak " +
      "hitaplarını ölçülü kullan. " +
      "Yanıtlarını Türkçe ve çok estetik, edebi, samimi bir usta üslubuyla ver. Markdown biçimlendirmesi kullan. " +
      "Ayrıca önerilerinde sitemizde bulunan 'Tabaklar', 'Vazolar', 'Çini Karolar' ve 'Kase' formlarını referans göster.";

    // Convert client-provided history to structure compatible with Gemini API if present
    const contents = history ? [...history, { role: "user", parts: [{ text: prompt }] }] : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API hatası:", error);
    res.status(500).json({ error: error?.message || "Yapay zeka yanıtı üretilirken bir hata oluştu." });
  }
});

// Start dev or production server
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Çini Sanatı Mağazası sunucusu port ${PORT} üzerinde çalışıyor.`);
  });
}

start();
