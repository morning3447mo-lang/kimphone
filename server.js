import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'AI server is running' });
});

app.post('/api/chat', async (req, res) => {
  console.log('[API] 收到聊天请求');
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('[API] 千问密钥是否已读取：', Boolean(apiKey));
    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing OPENROUTER_API_KEY',
      });
    }

    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'messages must be an array',
      });
    }

    const response = await fetch(
      'https://maas.qianwenaiapi.com/compatible-mode/v1/chat/completions',

      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen3.8-flash',
          messages,
        }),
      }
    );

    const responseText = await response.text();
    console.log('[API] 实际请求地址：', response.url);
    console.log('[API] 千问 HTTP 状态：', response.status);
    console.log('[API] 千问响应内容：', responseText.slice(0, 1000));

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        error: `千问返回了空内容或非有效 JSON，HTTP ${response.status}`,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || data.message || 'Qwen API request failed',
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content ?? '',
    });
  } catch (error) {
    console.error('[API] AI 请求真实错误：', error);
    res.status(500).json({ error: 'AI server request failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI server listening on port ${PORT}`);
});
