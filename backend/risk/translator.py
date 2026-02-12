from deep_translator import GoogleTranslator

def safe_translate(text, target_lang="hi"):
    try:
        return GoogleTranslator(source="auto", target=target_lang).translate(text)
    except:
        return text
