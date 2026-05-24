export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Missing imageBase64" });
  }

  const prompt = `Bạn là OCR chuyên đọc hóa đơn Việt Nam. Trả về JSON thuần túy (không markdown, không backtick):
{
  "supplier": "tên nhà cung cấp",
  "date": "ngày",
  "phone": "số điện thoại khách",
  "items": [
    { "name": "tên SP", "unit": "đvt", "quantity": số, "unit_price": số, "total": số }
  ],
  "total": tổng_cộng
}`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 1000,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
