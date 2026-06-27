from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

client = InferenceClient(api_key=os.getenv("HF_TOKEN"))

r = client.chat.completions.create(
    model="google/gemma-2-2b-it",
    messages=[{"role": "user", "content": "Say hello"}],
    max_tokens=50
)

print(r.choices[0].message.content)