from __future__  import annotations

from dataclasses import dataclass

from .Provider import RetryProvider, ProviderType
from .Provider import (
    Liaobots,
    HuggingFace
)


@dataclass(unsafe_hash=True)
class Model:
    """
    Represents a machine learning model configuration.

    Attributes:
        name (str): Name of the model.
        base_provider (str): Default provider for the model.
        best_provider (ProviderType): The preferred provider for the model, typically with retry logic.
    """
    name: str
    base_provider: str
    best_provider: ProviderType = None

    @staticmethod
    def __all__() -> list[str]:
        """Returns a list of all model names."""
        return _all_models

default = Model(
    name          = "",
    base_provider = "",
    best_provider = ""
)

# GPT-3.5 too, but all providers supports long requests and responses
gpt_35_long = Model(
    name          = 'gpt-3.5-turbo',
    base_provider = 'openai',
    best_provider = Liaobots
)

# GPT-3.5 / GPT-4
gpt_35_turbo = Model(
    name          = 'gpt-3.5-turbo',
    base_provider = 'openai',
    best_provider = Liaobots
)

gpt_4 = Model(
    name          = 'gpt-4',
    base_provider = 'openai',
    best_provider = Liaobots
)

llama2_7b = Model(
    name          = "meta-llama/Llama-2-7b-chat-hf",
    base_provider = 'meta',
    best_provider = ""
)

llama2_13b = Model(
    name          = "meta-llama/Llama-2-13b-chat-hf",
    base_provider = 'meta',
    best_provider = ""
)

llama2_70b = Model(
    name          = "meta/llama-2-70b-chat",
    base_provider = "meta",
    best_provider = ""
)

llama3_8b_instruct = Model(
    name          = "meta-llama/Meta-Llama-3-8B-Instruct",
    base_provider = "meta",
    best_provider = HuggingFace
)

llama3_70b = Model(
    name          = "meta-llama/Meta-Llama-3-70B",
    base_provider = "meta",
    best_provider = HuggingFace
)

codellama_70b_instruct = Model(
    name          = "codellama/CodeLlama-70b-Instruct-hf",
    base_provider = "meta",
    best_provider = ""
)

# Mistral
mixtral_8x7b = Model(
    name          = "mistralai/Mixtral-8x7B-Instruct-v0.1",
    base_provider = "huggingface",
    best_provider = HuggingFace
)

mistral_7b = Model(
    name          = "mistralai/Mistral-7B-Instruct-v0.1",
    base_provider = "huggingface",
    best_provider = ""
)

mistral_7b_v02 = Model(
    name          = "mistralai/Mistral-7B-Instruct-v0.2",
    base_provider = "huggingface",
    best_provider = ""
)

mixtral_8x22b = Model(
    name          = "HuggingFaceH4/zephyr-orpo-141b-A35b-v0.1",
    base_provider = "huggingface",
    best_provider = ""
)

# Misc models
dolphin_mixtral_8x7b = Model(
    name          = "cognitivecomputations/dolphin-2.6-mixtral-8x7b",
    base_provider = "huggingface",
    best_provider = ""
)

lzlv_70b = Model(
    name          = "lizpreciatior/lzlv_70b_fp16_hf",
    base_provider = "huggingface",
    best_provider = ""
)

airoboros_70b = Model(
    name          = "deepinfra/airoboros-70b",
    base_provider = "huggingface",
    best_provider = ""
)

openchat_35 = Model(
    name          = "openchat/openchat_3.5",
    base_provider = "huggingface",
    best_provider = ""
)

phi_3_mini = Model(
    name          = "microsoft/Phi-3-mini-4k-instruct",
    base_provider = "huggingface",
    best_provider = HuggingFace
)

gemma_1_1_7b_it = Model(
    name          = "google/gemma-1.1-7b-it",
    base_provider = "huggingface",
    best_provider = HuggingFace
)


# Bard
claude_3_opus = Model(
    name          = 'claude-3-opus',
    base_provider = 'anthropic',
    best_provider = ""
)

claude_3_sonnet = Model(
    name          = 'claude-3-sonnet',
    base_provider = 'anthropic',
    best_provider = ""
)

gpt_35_turbo_16k = Model(
    name          = 'gpt-3.5-turbo-16k',
    base_provider = 'openai',
    best_provider = gpt_35_long.best_provider
)

gpt_35_turbo_16k_0613 = Model(
    name          = 'gpt-3.5-turbo-16k-0613',
    base_provider = 'openai',
    best_provider = gpt_35_long.best_provider
)

gpt_35_turbo_0613 = Model(
    name          = 'gpt-3.5-turbo-0613',
    base_provider = 'openai',
    best_provider = gpt_35_turbo.best_provider
)

gpt_4_0613 = Model(
    name          = 'gpt-4-0613',
    base_provider = 'openai',
    best_provider = gpt_4.best_provider
)

gpt_4_32k = Model(
    name          = 'gpt-4-32k',
    base_provider = 'openai',
    best_provider = gpt_4.best_provider
)

gpt_4_32k_0613 = Model(
    name          = 'gpt-4-32k-0613',
    base_provider = 'openai',
    best_provider = gpt_4.best_provider
)

gemini_pro = Model(
    name          = 'gemini-pro',
    base_provider = 'google',
    best_provider = ""
)

dbrx_instruct = Model(
    name = 'databricks/dbrx-instruct',
    base_provider = 'mistral',
    best_provider = ""
)

class ModelUtils:
    """
    Utility class for mapping string identifiers to Model instances.

    Attributes:
        convert (dict[str, Model]): Dictionary mapping model string identifiers to Model instances.
    """
    convert: dict[str, Model] = {
        # gpt-3.5
        'gpt-3.5-turbo'          : gpt_35_turbo,
        'gpt-3.5-turbo-0613'     : gpt_35_turbo_0613,
        'gpt-3.5-turbo-16k'      : gpt_35_turbo_16k,
        'gpt-3.5-turbo-16k-0613' : gpt_35_turbo_16k_0613,
        
        'gpt-3.5-long': gpt_35_long,
        
        # gpt-4
        'gpt-4'          : gpt_4,
        'gpt-4-0613'     : gpt_4_0613,
        'gpt-4-32k'      : gpt_4_32k,
        'gpt-4-32k-0613' : gpt_4_32k_0613,

        # Llama
        'llama2-7b' : llama2_7b,
        'llama2-13b': llama2_13b,
        'llama2-70b': llama2_70b,
        
        'llama3-8b' : llama3_8b_instruct, # alias
        'llama3-70b': llama3_70b, # alias
        'llama3-8b-instruct' : llama3_8b_instruct,
        
        'codellama-70b-instruct': codellama_70b_instruct,

        # Mistral Opensource
        'mixtral-8x7b': mixtral_8x7b,
        'mistral-7b': mistral_7b,
        'mistral-7b-v02': mistral_7b_v02,
        'mixtral-8x22b': mixtral_8x22b,
        'dolphin-mixtral-8x7b': dolphin_mixtral_8x7b,
        
        # google
        'gemini-pro': gemini_pro,
        'gemma-1.1-7b-it' : gemma_1_1_7b_it,
        
        # anthropic
        'claude-3-opus': claude_3_opus,
        'claude-3-sonnet': claude_3_sonnet,
                
        # other
        'dbrx-instruct': dbrx_instruct,
        'lzlv-70b': lzlv_70b,
        'airoboros-70b': airoboros_70b,
        'openchat_3.5': openchat_35,
        'phi-3-mini': phi_3_mini,       
    }

_all_models = list(ModelUtils.convert.keys())
