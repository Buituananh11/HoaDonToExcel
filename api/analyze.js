export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Missing imageBase64" });
  }

  const prompt = `Bạn là OCR chuyên đọc hóa đơn Việt Nam. Đọc chính xác toàn bộ thông tin trong ảnh.
Trả về JSON thuần túy (không markdown, không backtick, không giải thích):
{
  "supplier": "tên cửa hàng/nhà cung cấp",
  "address": "địa chỉ",
  "phone": "số điện thoại cửa hàng",
  "customer": "tên khách hàng",
  "customer_phone": "số điện thoại khách",
  "date": "ngày tháng năm",
  "invoice_number": "số hóa đơn",
  "items": [
    {
      "stt": số thứ tự,
      "name": "tên mặt hàng",
      "unit": "đơn vị tính",
      "quantity": số lượng dạng số nguyên hoặc thập phân,
      "unit_price": đơn giá dạng số nguyên không dấu phẩy,
      "total": thành tiền dạng số nguyên không dấu phẩy
    }
  ],
  "subtotal": tổng cộng dạng số nguyên,
  "debt": số tiền dư nợ nếu có hoặc 0,
  "notes": "ghi chú nếu có"
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 1000,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
