# Public Model Service（自有服务器部署版）

这是给 **Japan Travel Guide** 前端配套的公共模型服务，已按你的服务器地址预配置：

- 对外服务地址：`http://115.159.221.212:1217`
- 后端容器内部端口：`8000`
- Docker Compose 端口映射：`1217:8000`

服务兼容 OpenAI 风格接口，前端会调用：

- `POST /api/chat`
- `POST /api/chat/stream`
- `GET /api/health`

---

## 1. 部署到你的服务器

登录服务器后执行：

```bash
git clone https://github.com/yangdezhicy/Japan-Travel-Guide.git
cd Japan-Travel-Guide/public_model_service
cp .env.example .env
```

然后编辑 `.env`，至少填写：

```env
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=你的模型服务 API Key
MODEL_NAME=gpt-4o-mini
```

启动：

```bash
docker compose up -d --build
```

查看日志：

```bash
docker compose logs -f
```

---

## 2. 健康检查

```bash
curl http://115.159.221.212:1217/api/health
```

预期返回：

```json
{
  "ok": true,
  "service": "public-japan-travel-ai",
  "provider": "openai-compatible",
  "model": "gpt-4o-mini",
  "configured": true
}
```

如果 `configured=false`，说明 `.env` 里的 `OPENAI_API_KEY` 或 `OPENAI_BASE_URL` 没填对。

---

## 3. 测试普通对话

```bash
curl -X POST http://115.159.221.212:1217/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "帮我规划东京3日游"}],
    "knowledge": "【东京景点】浅草寺、涩谷、上野公园"
  }'
```

---

## 4. 测试流式对话

```bash
curl -N -X POST http://115.159.221.212:1217/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "帮我规划东京3日游"}],
    "knowledge": "【东京景点】浅草寺、涩谷、上野公园"
  }'
```

---

## 5. 前端接入

前端已默认指向：

```env
VITE_API_BASE_URL=http://115.159.221.212:1217
```

如果未来你换成域名和 HTTPS，例如：

```env
VITE_API_BASE_URL=https://ai.yourdomain.com
```

重新构建前端即可：

```bash
npm install
npm run build
```

---

## 6. 支持的模型平台

这套服务支持所有 OpenAI-compatible 服务，例如：

- OpenAI
- OpenRouter
- DeepSeek
- 火山方舟（公网 endpoint）
- 其他兼容 `/chat/completions` 的服务

示例：

### OpenAI

```env
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-xxxxxxxx
MODEL_NAME=gpt-4o-mini
```

### DeepSeek

```env
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_API_KEY=sk-xxxxxxxx
MODEL_NAME=deepseek-chat
```

### OpenRouter

```env
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=sk-or-xxxxxxxx
MODEL_NAME=openai/gpt-4o-mini
OPENAI_EXTRA_HEADERS={"HTTP-Referer":"http://115.159.221.212:1217","X-Title":"Japan Travel Guide"}
```

---

## 7. 安全建议

1. 不要提交 `.env`。
2. 生产环境建议配置域名 + HTTPS。
3. 若前端部署为 HTTPS，后端也建议配置 HTTPS，否则浏览器可能拦截 HTTP 请求。
4. 公网使用建议增加请求限流和鉴权。
