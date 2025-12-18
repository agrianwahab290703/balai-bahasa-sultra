import requests
import json

# Test dengan OpenRouter
API_KEY = "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"
BASE_URL = "https://openrouter.ai/api/v1"

# Test 1: Cek models
print("=== Testing Model List ===")
response = requests.get(
    f"{BASE_URL}/models",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Balai Bahasa Sultra"
    }
)
print(f"Status: {response.status_code}")
if response.status_code != 200:
    print(f"Error: {response.text}")
else:
    models = response.json()
    # Cari model yang tersedia
    available_models = [m['id'] for m in models['data'] if 'mistral' in m['id'].lower() or 'free' in m['id'].lower()]
    print(f"Available free models: {available_models[:5]}")  # Show first 5

# Test 2: Coba chat dengan model yang berbeda
print("\n=== Testing Chat Completion ===")
test_models = [
    "mistralai/devstral-2512:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "openai/gpt-3.5-turbo",
    "meta-llama/llama-3.2-3b-instruct:free"
]

for model in test_models:
    print(f"\nTesting model: {model}")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Balai Bahasa Sultra"
    }

    data = {
        "model": model,
        "messages": [
            {"role": "user", "content": "Say hello!"}
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }

    response = requests.post(
        f"{BASE_URL}/chat/completions",
        headers=headers,
        json=data
    )

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['choices'][0]['message']['content']}")
    else:
        print(f"Error: {response.text}")

# Test 3: Cek API Key validity
print("\n=== Checking API Key Info ===")
response = requests.get(
    "https://openrouter.ai/api/v1/auth/key",
    headers={"Authorization": f"Bearer {API_KEY}"}
)
print(f"Key info status: {response.status_code}")
if response.status_code == 200:
    print(f"Key info: {response.json()}")