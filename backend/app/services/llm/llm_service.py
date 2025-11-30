from ollama import generate
from app.db.init_db import AureliusDB


class LLMService:

    def __init__(self):
        self.db_context = AureliusDB()

    def assemble_prompt(self, user_prompt):
        user_context_dict = self.db_context.load_memory()
        get_user_last_messages = self.db_context.get_recent_messages()
        last_chat_summaries = self.db_context.get_summary()
        user_model = self.db_context.get_user_model()

        prompt = f"""
        You are an intelligent assistant. 
        Your goals:
        1. Provide clear, helpful, reliable responses.
        2. Use the user's stored context to personalize answers.
        3. If you detect new patterns, preferences or new info that could help future interactions, propose NEW CONTEXT VARIABLES in a section called "context_suggestions" (do not repeat any context variables).
        4. Summaries of the conversation should be improved if needed in a section "summary_suggestions".
        5. Only modify context when asked or when suggestions are explicitly accepted.

        ========================
        USER CONTEXT (memory)
        {user_context_dict}

        ========================
        RECENT CHAT MESSAGES
        {get_user_last_messages}

        ========================
        CHAT SUMMARIES
        {last_chat_summaries}

        ========================
        USER MESSAGE
        {user_prompt}

        ========================
        RESPONSE FORMAT
        Reply normally to the user.
        At the end of your response, optionally include:

        <context_suggestions>
        (list of suggested variables to save for memory. Ej: key:value )
        </context_suggestions>

        <summary_suggestions>
        (optional improved summary of the conversation)
        </summary_suggestions>

        If no suggestions are needed, leave the sections empty.
        ========================
        """
        response = self.generate_response(prompt, user_model)

        return self.extract_and_save_context(response)

        # Invoke tts service

    def generate_response(self, prompt, model):
        response = generate(model=model, prompt=prompt)
        response_text = response['response']
        return response_text

    def extract_and_save_context(self, answer):
        pass
