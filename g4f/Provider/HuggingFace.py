from __future__ import annotations

import orjson

from aiohttp import ClientSession, BaseConnector
from ..typing import AsyncResult, Messages
from .base_provider import AsyncGeneratorProvider, ProviderModelMixin
from .helper import get_connector
from ..errors import RateLimitError, ModelNotFoundError
from ..raise_for_status import raise_for_status

class HuggingFace(AsyncGeneratorProvider, ProviderModelMixin):
    url = "https://huggingface.co/chat"
    working = True
    supports_message_history = True
    models = [
        "mistralai/Mixtral-8x7B-Instruct-v0.1",
        'microsoft/Phi-3-mini-4k-instruct',
        'meta-llama/Meta-Llama-3-8B-Instruct',
        'google/gemma-1.1-7b-it'
    ]
    
    default_model = "mistralai/Mixtral-8x7B-Instruct-v0.1"

    @classmethod
    async def create_async_generator(
        cls,
        model: str,
        messages: Messages,
        stream: bool = True,
        proxy: str = None,
        connector: BaseConnector = None,
        api_base: str = "https://api-inference.huggingface.co",
        api_key: str = "",
        temperature: float = 0.2,
        max_new_tokens: int = 2048,
        **kwargs
    ) -> AsyncResult:
        headers = {}
        if api_key is not None:
            headers["Authorization"] = f"Bearer {api_key}"
        params = {
            "return_full_text": False,
            "max_new_tokens": max_new_tokens,
            "temperature": temperature,
            **kwargs
        }
        payload = {"inputs": format_prompt(messages, model), "parameters": params, "stream": stream}
        async with ClientSession(
            headers=headers,
            connector=get_connector(connector, proxy)
        ) as session:
            async with session.post(f"{api_base.rstrip('/')}/models/{model}", json=payload) as response:
                if response.status == 404:
                    raise ModelNotFoundError(f"Model is not supported: {model}")
                await raise_for_status(response)
                if stream:
                    first = True
                    async for line in response.content:
                        if line.startswith(b"data:"):
                            data = orjson.loads(line[5:])
                            if not data["token"]["special"]:
                                chunk = data["token"]["text"]
                                if first:
                                    first = False
                                    chunk = chunk.lstrip()
                                yield chunk
                else:
                    yield (await response.json())[0]["generated_text"].strip()

def format_prompt(messages: Messages, model: str, do_continue: bool = False) -> str:
    if model in ({
    "mistralai/Mixtral-8x7B-Instruct-v0.1": format_prompt_mistral,
    "microsoft/Phi-3-mini-4k-instruct": format_prompt_custom,
    "meta-llama/Meta-Llama-3-8B-Instruct": format_prompt_llama,
    "google/gemma-1.1-7b-it": format_prompt_gemma
}):
        return ({
    "mistralai/Mixtral-8x7B-Instruct-v0.1": format_prompt_mistral,
    "microsoft/Phi-3-mini-4k-instruct": format_prompt_custom,
    "meta-llama/Meta-Llama-3-8B-Instruct": format_prompt_llama,
    "google/gemma-1.1-7b-it": format_prompt_gemma
})[model](messages, do_continue)
    else:
        raise ValueError(f"Modell {model} not supported")

def format_prompt_mistral(messages: Messages, do_continue: bool = False) -> str:
    system_messages = [message["content"] for message in messages if message["role"] == "system"]
    question = " ".join([messages[-1]["content"], *system_messages])
    history = "\n".join([
        f"<s>[INST]{messages[idx-1]['content']} [/INST] {message['content']}</s>"
        for idx, message in enumerate(messages)
        if message["role"] == "assistant"
    ])
    if do_continue:
        return history[:-len('</s>')]
    return f"{history}\n<s>[INST] {question} [/INST]"

def format_prompt_qwen(messages: Messages, do_continue: bool = False) -> str:
    prompt = "".join([
        f"<|im_start|>{message['role']}\n{message['content']}\n<|im_end|>\n" for message in messages
    ]) + ("" if do_continue else "<|im_start|>assistant\n")
    if do_continue:
        return prompt[:-len("\n<|im_end|>\n")]
    return prompt

def format_prompt_qwen2(messages: Messages, do_continue: bool = False) -> str:
    prompt = "".join([
        f"\u003C｜{message['role'].capitalize()}｜\u003E{message['content']}\u003C｜end▁of▁sentence｜\u003E" for message in messages
    ]) + ("" if do_continue else "\u003C｜Assistant｜\u003E")
    if do_continue:
        return prompt[:-len("\u003C｜Assistant｜\u003E")]
    return prompt

def format_prompt_llama(messages: Messages, do_continue: bool = False) -> str:
    prompt = "<|begin_of_text|>" + "".join([
        f"<|start_header_id|>{message['role']}<|end_header_id|>\n\n{message['content']}\n<|eot_id|>\n" for message in messages
    ]) + ("" if do_continue else "<|start_header_id|>assistant<|end_header_id|>\n\n")
    if do_continue:
        return prompt[:-len("\n<|eot_id|>\n")]
    return prompt

def format_prompt_custom(messages: Messages, end_token: str = "</s>", do_continue: bool = False) -> str:
    prompt = "".join([
        f"<|{message['role']}|>\n{message['content']}{end_token}\n" for message in messages
    ]) + ("" if do_continue else "<|assistant|>\n")
    if do_continue:
        return prompt[:-len(end_token + "\n")]
    return prompt

def format_prompt_gemma(messages: Messages, end_token: str = "</s>", do_continue: bool = False) -> str:
    prompt = "".join([
        f"<|{message['role']}|>\n{message['content']}\n" for message in messages
    ]) + ("" if do_continue else "<|assistant|>\n")
    if do_continue:
        return prompt[:-len(end_token + "\n")]
    return prompt
   