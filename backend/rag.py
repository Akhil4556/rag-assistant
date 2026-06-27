from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

load_dotenv()

client = InferenceClient(
    api_key=os.getenv("HF_TOKEN")
)

def generate_answer(context, question):

    prompt = f"""Answer ONLY using the context below.

If the answer is not present in the context, reply exactly: I don't know.

Context:
{context}

Question:
{question}

Answer:"""

    models = [
        "google/gemma-2-2b-it",
        "Qwen/Qwen2.5-7B-Instruct",
        "meta-llama/Meta-Llama-3-8B-Instruct",
        "HuggingFaceH4/zephyr-7b-beta",
    ]

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=256,
                temperature=0.1
            )
            return response.choices[0].message.content.strip()

        except Exception as e:
            print(f"Model {model} failed: {str(e)}")
            continue

    return "ERROR: All models failed. Please enable providers at https://huggingface.co/settings/inference-providers"