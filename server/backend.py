import re
from datetime import datetime
import asyncio

import sys
sys.path.insert(0, '../g4f')

from g4f import __init__, ChatCompletion
from g4f.Provider import __providers__

from flask import request, Response, stream_with_context
from requests import get
import orjson
import subprocess
import platform

def find_provider(name):
    new_variable = None
    for provider in __providers__:
        if provider.__name__ == name and provider.working:
            new_variable = provider
            break
    return new_variable

class Backend_Api:
    def __init__(self, bp, config: dict) -> None:
        """
        Initialize the Backend_Api class.
        :param app: Flask application instance
        :param config: Configuration dictionary
        """
        self.bp = bp
        self.routes = {
            '/backend-api/v2/conversation': {
                'function': self._conversation,
                'methods': ['POST']
            }
        }

    def _conversation(self):
        """  
        Handles the conversation route.  

        :return: Response object containing the generated conversation stream  
        """
        conversation_id = request.json['conversation_id']

        try:
            model = request.json['model']
            messages = build_messages()
            provider = request.json.get('provider', '').replace('g4f.Provider.', '')
            print("provider " + provider)
            provider = provider if provider and provider != "Auto" else None
            
            provider_class = find_provider(provider)
           
            response = ChatCompletion.create(
                model=model,
                provider=provider_class,
                chatId=conversation_id,
                messages=messages,
                stream=True
            )
            
            return Response(stream_with_context(generate_stream(response)), mimetype='text/event-stream')

        except Exception as e:
            print(e)
            print(e.__traceback__.tb_next)

            return {
                '_action': '_ask',
                'success': False,
                "error": f"an error occurred {str(e)}"
            }, 400


def build_messages():
    """  
    Build the messages for the conversation.  

    :return: List of messages for the conversation  
    """
    _conversation = request.json['meta']['content']['conversation']
    internet_access = request.json['meta']['content']['internet_access']
    prompt = request.json['meta']['content']['parts'][0]

    conversation = _conversation

    conversation.append(prompt)

    if len(conversation) > 3:
        conversation = conversation[-4:]

    return conversation


def fetch_search_results(query):
    """  
    Fetch search results for a given query.  

    :param query: Search query string  
    :return: List of search results  
    """
    search = get('https://ddg-api.herokuapp.com/search',
                 params={
                     'query': query,
                     'limit': 3,
                 })

    snippets = ""
    for index, result in enumerate(search.json()):
        snippet = f'[{index + 1}] "{result["snippet"]}" URL:{result["link"]}.'
        snippets += snippet

    response = "Here are some updated web searches. Use this to improve user response:"
    response += snippets

    return [{'role': 'system', 'content': response}]


def generate_stream(response):
    """
    Generate the conversation stream.

    :param response: Response object from ChatCompletion.create
    :return: Generator object yielding messages in the conversation
    """
    
    yield from response
