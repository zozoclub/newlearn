import logging
from django.core.management.base import BaseCommand
import pandas as pd
from Crawling import settings
import google.generativeai as genai

GEN_AI_SECRET_KEY = settings.GEN_AI_SECRET_KEY
OPEN_AI_API_KEY = settings.OPEN_AI_API_KEY

# Gemini API 설정
genai.configure(api_key=GEN_AI_SECRET_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


def translate_news(title, content, domain="general", style="formal"):
    """
    뉴스 기사를 영어로만 번역하고 JSON 형식으로 반환하는 함수
    Args:
        title (str): 뉴스 기사 제목
        content (str): 뉴스 기사 내용
        domain (str, optional): 뉴스 기사 도메인 (예: technology, finance, etc.). Defaults to "general".
        style (str, optional): 번역 스타일 (예: formal, informal, casual). Defaults to "formal".
    Returns:
        dict: 번역 결과를 담은 JSON 형식의 딕셔너리
    """
    prompt = (f"제목: {title}. 내용: {content}. "
              f"다음 지침에 따라 이 정보를 정확하게 영어로 번역해 주세요.\n"
              f"1. 영어로 세 가지 난이도(어려운, 중간, 쉬운)로 번역해 주세요.\n"
              f"2. 문장 수가 반드시 일치해야 하며, 문장의 기준은 마침표(.)의 개수입니다. 절대 문장을 합치지 마세요.\n"
              f"3. 내용 안에 사용된 모든 \"는 '로 변환해 주세요. 단, JSON 문법에서 사용되는 \"는 그대로 유지해야 합니다.\n"
              f"4. 번역된 내용은 아래의 JSON 형식으로 제공해 주세요:\n"
              f"{{ "
              f"   \"high\": \"...\", "
              f"   \"medium\": \"...\", "
              f"   \"low\": \"...\""
              f" }}\n")

    response = model.generate_content(prompt)

    try:
        response_text = response.text
        print(response_text)

        high_start = response_text.find('"high": "') + 9
        medium_start = response_text.find('"medium": "') + 11
        low_start = response_text.find('"low": "') + 8

        high_end = response_text.find('",', high_start)
        medium_end = response_text.find('",', medium_start)
        low_end = response_text.find('"', low_start)

        if high_start == 8 or medium_start == 10 or low_start == 7 or \
                high_end == -1 or medium_end == -1 or low_end == -1:
            logging.warning("번역 결과 누락")
            return None

        high_translation = response_text[high_start:high_end].strip()
        medium_translation = response_text[medium_start:medium_end].strip()
        low_translation = response_text[low_start:low_end].strip()

        return {
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
    Args:
        sentences (list): 영어 문장 리스트
    Returns:
        list: 번역된 한국어 문장 리스트
    """
    sentences_str = ', '.join(f'"{sentence}"' for sentence in sentences)

    prompt = (f"다음 영어 문장들을 한국어로 번역해 주세요: [{sentences_str}]. "
              f"각 문장의 순서를 유지하고, 각 문장을 개별적으로 번역해 주세요.\n"
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

        return translated_sentences.split('", "')  # 번역된 문장들을 리스트로 반환
    except Exception as e:
        logging.error(f"Error processing response: {e}")
        if 'response_text' in locals():
            logging.error(f"Response text: {response_text}")
        else:
            logging.error("No response text available")
        return None


def translate_csv(filename, chunksize=5):
    """
    CSV 파일을 chunk 단위로 읽어 번역하는 함수

    Args:
        filename (str): CSV 파일 이름
        chunksize (int, optional): 한 번에 읽어들일 데이터 개수. 기본값은 5.
    """
    reader = pd.read_csv(filename, chunksize=chunksize)
    output_filename = "translated_" + filename

    is_first_chunk = True

    for chunk in reader:
        for index, row in chunk.iterrows():
            print(f"Processing row: {index}")

            # 영어 번역
            result = translate_news(row['title'], row['main'])

            if result:
                chunk.loc[index, 'translated_high'] = result.get('high', '')
                chunk.loc[index, 'translated_medium'] = result.get('medium', '')
                chunk.loc[index, 'translated_low'] = result.get('low', '')

                # 번역된 영어 문장을 한국어로 변환
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
                    chunk.loc[index, 'translated_high_kor'] = '. '.join(high_kor_result)
                else:
                    chunk.loc[index, 'translated_high_kor'] = ''

                if medium_kor_result:
                    chunk.loc[index, 'translated_medium_kor'] = '. '.join(medium_kor_result)
                else:
                    chunk.loc[index, 'translated_medium_kor'] = ''

                if low_kor_result:
                    chunk.loc[index, 'translated_low_kor'] = '. '.join(low_kor_result)
                else:
                    chunk.loc[index, 'translated_low_kor'] = ''

            else:
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

    def handle(self, *args, **options):
        filename = "20240919.csv"  # CSV 파일 경로를 적절히 수정하세요
        translate_csv(filename)
        self.stdout.write(self.style.SUCCESS('Successfully translated news articles'))
