import logging
from datetime import datetime
from django.core.management.base import BaseCommand
import pandas as pd
from Crawling import settings
import google.generativeai as genai
import os

# Gemini API 설정
GEN_AI_SECRET_KEY = settings.GEN_AI_SECRET_KEY
genai.configure(api_key=GEN_AI_SECRET_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def translate_news(title, content, domain="general", style="formal"):
    """
    뉴스 기사를 영어로만 번역하고 JSON 형식으로 반환하는 함수
    """
    # 번역 로직은 기존과 동일합니다.
    prompt = (f"Title: {title}. Content: {content}. "
              f"Please translate this information accurately into English according to the following guidelines. You can skip translating any information unrelated to the article content (e.g., names of journalists or newspapers).\n"
              f"1. Translate the title i English"
              f"1. Translate the content into three levels of difficulty (hard, medium, easy) in English.\n"
              f"2. Periods should only be used at the end of a sentence.\n"
              f"3. Do not use any special characters except for periods at the end of sentences. For example, avoid using quotation marks (' or \").\n"
              f"4. Provide the translated content in the following JSON format:\n"
              f"{{ "
              f"   \"title_eng\": \"...\", "
              f"   \"high\": \"...\", "
              f"   \"medium\": \"...\", "
              f"   \"low\": \"...\""
              f" }}\n")

    response = model.generate_content(prompt)

    if not response.candidates:
        logging.error("API 응답이 없습니다. 요청이 차단되었을 수 있습니다.")
        return None
    try:
        response_text = response.text

        title_eng_start = response_text.find('"title_eng": "') + 14
        high_start = response_text.find('"high": "') + 9
        medium_start = response_text.find('"medium": "') + 11
        low_start = response_text.find('"low": "') + 8

        title_eng_end = response_text.find('",', title_eng_start)
        high_end = response_text.find('",', high_start)
        medium_end = response_text.find('",', medium_start)
        low_end = response_text.find('"', low_start)

        if high_start == 8 or medium_start == 10 or low_start == 7 or \
                high_end == -1 or medium_end == -1 or low_end == -1 or title_eng_start == 13 or title_eng_end == -1:
            logging.warning("번역 결과 누락")
            return None

        title_eng = response_text[title_eng_start:title_eng_end].strip().replace('\\', '')
        high_translation = response_text[high_start:high_end].strip().replace('\\', '')
        medium_translation = response_text[medium_start:medium_end].strip().replace('\\', '')
        low_translation = response_text[low_start:low_end].strip().replace('\\', '')


        return {
            "title_eng": title_eng,
            "high": high_translation,
            "medium": medium_translation,
            "low": low_translation,
        }
    except Exception as e:
        logging.error(f"Error processing response: {e}")
        if 'response_text' in locals():
            logging.error(f"Response text: {response_text}")
        else:
            logging.error("No response text available")
        return None

def translate_to_korean(sentences):
    """
    영어 문장을 한국어로 번역하는 함수
    """
    sentences_str = ', '.join(f'"{sentence}"' for sentence in sentences)

    prompt = (f"Please translate the following English sentences into Korean in the exact order as provided: [{sentences_str}]. "
              f"Each sentence must be translated into a **single** sentence. Under no circumstances should the translation result in multiple sentences. "
              f"The number of translated sentences **must match** the number of original sentences. Keep the original sentence order intact.\n"
              f"Do not use any special characters. Ensure that every sentence ends with exactly one period (.)\n"
              f"{{ "
              f"   \"translated_sentences\": [\"...\", \"...\", \"...\"]"
              f" }}\n")

    response = model.generate_content(prompt)

    try:
        response_text = response.text

        sentences_start = response_text.find('"translated_sentences": [') + 25
        sentences_end = response_text.find(']', sentences_start)

        if sentences_start == 24 or sentences_end == -1:
            logging.warning("번역 결과 누락")
            return None

        translated_sentences = response_text[sentences_start:sentences_end].strip()

        sentences_list = translated_sentences.split('", "')
        sentences_list = [s.strip('"').strip() for s in sentences_list]

        processed_sentences = []
        for sentence in sentences_list:
            sentence = sentence.replace(',\n        ', ' ').strip()
            sentence = sentence.replace(', \n        ', ' ').strip()
            sentence = sentence.replace('"', '')
            sentence = sentence.replace('\\', '')
            sentence = sentence.replace('..', '.')
            processed_sentences.append(sentence)

        final_result = ' '.join(processed_sentences).strip()

        if not final_result.endswith('.'):
            final_result += '.'

        return final_result
    except Exception as e:
        logging.error(f"Error processing response: {e}")
        if 'response_text' in locals():
            logging.error(f"Response text: {response_text}")
        else:
            logging.error("No response text available")
        return None

def translate_csv(filename, output_filename, chunksize=5):
    """
    CSV 파일을 chunk 단위로 읽어 번역하는 함수
    """
    reader = pd.read_csv(filename, chunksize=chunksize)

    is_first_chunk = True

    for chunk in reader:
        for index, row in chunk.iterrows():

            # 영어 번역
            result = translate_news(row['title'], row['content'])

            if result:
                chunk.loc[index, 'title_eng'] = result.get('title_eng', '')
                chunk.loc[index, 'translated_high'] = result.get('high', '')
                chunk.loc[index, 'translated_medium'] = result.get('medium', '')
                chunk.loc[index, 'translated_low'] = result.get('low', '')

                high_sentences = result.get('high', '').split('.')
                medium_sentences = result.get('medium', '').split('.')
                low_sentences = result.get('low', '').split('.')

                high_sentences = [s.strip() for s in high_sentences if s]
                medium_sentences = [s.strip() for s in medium_sentences if s]
                low_sentences = [s.strip() for s in low_sentences if s]

                high_kor_result = translate_to_korean(high_sentences)
                medium_kor_result = translate_to_korean(medium_sentences)
                low_kor_result = translate_to_korean(low_sentences)

                if high_kor_result:
                    chunk.loc[index, 'translated_high_kor'] = high_kor_result
                else:
                    chunk.loc[index, 'translated_high_kor'] = ''

                if medium_kor_result:
                    chunk.loc[index, 'translated_medium_kor'] = medium_kor_result
                else:
                    chunk.loc[index, 'translated_medium_kor'] = ''

                if low_kor_result:
                    chunk.loc[index, 'translated_low_kor'] = low_kor_result
                else:
                    chunk.loc[index, 'translated_low_kor'] = ''

            else:
                chunk.loc[index, 'title_eng'] = ''
                chunk.loc[index, 'translated_high'] = ''
                chunk.loc[index, 'translated_medium'] = ''
                chunk.loc[index, 'translated_low'] = ''
                chunk.loc[index, 'translated_high_kor'] = ''
                chunk.loc[index, 'translated_medium_kor'] = ''
                chunk.loc[index, 'translated_low_kor'] = ''

        # 첫 번째 chunk에만 header를 포함하고, 이후로는 포함하지 않음
        chunk.to_csv(output_filename, mode='a', header=is_first_chunk, index=False)
        is_first_chunk = False

class Command(BaseCommand):
    help = 'Translates news articles from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('--filename', type=str, help="입력 CSV 파일 경로", required=True)
        parser.add_argument('--output', type=str, help="출력 CSV 파일 경로", required=True)

    def handle(self, *args, **options):
        filename = options['filename']
        output = options['output']
        translate_csv(filename, output)
        self.stdout.write(self.style.SUCCESS('Successfully translated news articles'))
