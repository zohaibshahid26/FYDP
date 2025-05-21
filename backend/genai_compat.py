import google.generativeai as generativeai
import sys
import types

class Client:
    def __init__(self, api_key):
        generativeai.configure(api_key=api_key)

if 'google' not in sys.modules:
    google_module = types.ModuleType('google')
    sys.modules['google'] = google_module
else:
    google_module = sys.modules['google']

genai_module = types.SimpleNamespace(Client=Client)
setattr(google_module, 'genai', genai_module)
