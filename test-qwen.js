import 'dotenv/config';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('没有读取到 API Key，请检查项目根目录的 .env 文件。');
  process.exit(1);
}

console.log('开始测试千问 API...');

try {
  const response = await fetch(
    'https://maas.qianwenaiapi.com/compatible-mode/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3.8-max',
        messages: [{ role: 'user', content: '请只回复：API连接成功' }],
      }),
    }
  );

  const body = await response.text();

  console.log('HTTP 状态：', response.status);
  console.log('返回内容：', body.slice(0, 2000));
} catch (error) {
  console.error('连接失败：', error.message);
}
