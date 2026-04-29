import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Kamu adalah asisten AI resmi Tanur Muthmainnah Tour, perusahaan travel umrah dan haji terpercaya di Indonesia yang masuk 3 besar pengirim jamaah umrah terbanyak di Indonesia.

Tugasmu membantu calon jamaah dengan informasi paket umrah dan haji, persyaratan dokumen, tips persiapan, biaya dan pembayaran, jadwal keberangkatan, prosedur manasik, tips kesehatan, serta informasi hotel dan transportasi.

Gunakan bahasa Indonesia yang ramah dan sopan. Sisipkan kata islami seperti Insya Allah dan Alhamdulillah. Jika butuh info lebih lanjut arahkan ke tanurmuthmainnah.com.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    return Response.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Maaf, terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}