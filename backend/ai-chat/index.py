import json
import os
import urllib.request
import urllib.error

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_BASE = "https://api.openai.com/v1"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def openai_request(path: str, payload: dict) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{OPENAI_BASE}{path}",
        data=data,
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def handler(event: dict, context) -> dict:
    """Чат с ИИ и генерация изображений. Поддерживает GPT-4o, DALL-E 3."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if not OPENAI_API_KEY:
        return {
            "statusCode": 503,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "OpenAI API key not configured"}),
        }

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid JSON"})}

    action = body.get("action", "chat")

    # ── Генерация изображения ────────────────────────────────────────────────
    if action == "generate_image":
        prompt = body.get("prompt", "").strip()
        model = body.get("model", "dall-e-3")  # dall-e-3 | dall-e-2
        size = body.get("size", "1024x1024")
        style = body.get("style", "vivid")  # vivid | natural

        if not prompt:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Prompt required"})}

        payload = {
            "model": model,
            "prompt": prompt,
            "n": 1,
            "size": size,
        }
        if model == "dall-e-3":
            payload["style"] = style
            payload["quality"] = body.get("quality", "standard")

        result = openai_request("/images/generations", payload)
        image_url = result["data"][0]["url"]
        revised_prompt = result["data"][0].get("revised_prompt", prompt)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"url": image_url, "revised_prompt": revised_prompt}),
        }

    # ── Чат ─────────────────────────────────────────────────────────────────
    messages = body.get("messages", [])
    model = body.get("model", "gpt-4o")
    system_prompt = body.get("system", "Ты полезный ИИ-ассистент. Отвечай на русском языке, если пользователь пишет по-русски.")

    if not messages:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Messages required"})}

    payload = {
        "model": model,
        "messages": [{"role": "system", "content": system_prompt}] + messages,
        "max_tokens": 2048,
        "temperature": 0.7,
    }

    result = openai_request("/chat/completions", payload)
    reply = result["choices"][0]["message"]["content"]

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"reply": reply, "model": model}),
    }
