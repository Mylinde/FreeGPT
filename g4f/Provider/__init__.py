from __future__ import annotations

from ..base_provider  import BaseProvider, ProviderType
from .retry_provider  import RetryProvider
from .base_provider   import AsyncProvider, AsyncGeneratorProvider


from .AiChatOnline    import AiChatOnline
from .Aura            import Aura
from .Bing            import Bing
from .ChatBase        import ChatBase
from .ChatForAi       import ChatForAi
from .ChatgptAi       import ChatgptAi
from .ChatgptDemo     import ChatgptDemo
from .ChatgptLogin    import ChatgptLogin
from .ChatgptNext     import ChatgptNext
from .Chatxyz         import Chatxyz
#from .DeepInfra       import DeepInfra
from .FreeChatgpt     import FreeChatgpt
from .GeminiPro       import GeminiPro
from .GeminiProChat   import GeminiProChat
from .Gpt6            import Gpt6
from .GPTalk          import GPTalk
from .GptChatly       import GptChatly
from .GptForLove      import GptForLove
from .GptGo           import GptGo
from .GptTalkRu       import GptTalkRu
#from .HuggingChat     import HuggingChat
from .Koala           import Koala
from .Liaobots        import Liaobots
from .Llama2          import Llama2
from .OnlineGpt       import OnlineGpt
from .PerplexityLabs  import PerplexityLabs
from .Pi              import Pi
from .You             import You


import sys

__modules__: list = [
    getattr(sys.modules[__name__], provider) for provider in dir()
    if not provider.startswith("__")
]
__providers__: list[ProviderType] = [
    provider for provider in __modules__
    if isinstance(provider, type)
    and issubclass(provider, BaseProvider)
]
__all__: list[str] = [
    provider.__name__ for provider in __providers__
]
__map__: dict[str, ProviderType] = dict([
    (provider.__name__, provider) for provider in __providers__
])

class ProviderUtils:
    convert: dict[str, ProviderType] = __map__
