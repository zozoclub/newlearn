import logging
import pandas as pd
from django.core.management.base import BaseCommand
from Crawling import settings
import google.generativeai as genai
import re

GEN_AI_SECRET_KEY = settings.GEN_AI_SECRET_KEY
OPEN_AI_API_KEY = settings.OPEN_AI_API_KEY

# Gemini API 설정
genai.configure(api_key=GEN_AI_SECRET_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


def translate_news(title, content, domain="general", style="formal"):
    """
    뉴스 기사를 번역하고 JSON 형식으로 반환하는 함수
    """
    if not title or not content:
        logging.error("No title or content provided for translation.")
        return None

    prompt = (f"Title: {title}. Content: {content}. "
              f"Please translate this information accurately according to the following guidelines.\n"
              f"1. First, translate the content into English with three difficulty levels: hard, medium, and easy.\n"
              f"2. Then, provide the corresponding Korean translation for each English version.\n"
              f"3. The number of sentences in both the Korean and English translations must match. Each English sentence should have the same meaning in its corresponding Korean translation. For example, the second sentence in the English version should have the same meaning as the second sentence in the Korean version.\n"
              f"4. Sentences are separated by periods ('.'), exclamation marks ('!'), and question marks ('?'). Do not combine sentences.\n"
              f"5. Convert all double quotes (\") inside the content to single quotes (''), except for JSON syntax where double quotes must be retained.\n"
              f"6. Ensure that dates are written using '-' instead of '.' (e.g., 9-15 instead of 9.15) to avoid confusion with periods.\n"
              f"7. Provide the translated content in the following JSON format:\n"
              f"{{ "
              f"   \"high_kor\": \"...\", "
              f"   \"medium_kor\": \"...\", "
              f"   \"low_kor\": \"...\", "
              f"   \"high\": \"...\", "
              f"   \"medium\": \"...\", "
              f"   \"low\": \"...\""
              f" }}")

    response = model.generate_content(prompt)

    try:
        response_text = response.text
        print(response_text)


        high_start = response_text.find('"high": "') + 9
        medium_start = response_text.find('"medium": "') + 11
        low_start = response_text.find('"low": "') + 8

        high_kor_start = response_text.find('"high_kor": "') + 13
        medium_kor_start = response_text.find('"medium_kor": "') + 15
        low_kor_start = response_text.find('"low_kor": "') + 12

        high_end = response_text.find('",', high_start)
        medium_end = response_text.find('",', medium_start)
        low_end = response_text.find('"', low_start)

        high_kor_end = response_text.find('",', high_kor_start)
        medium_kor_end = response_text.find('",', medium_kor_start)
        low_kor_end = response_text.find('"', low_kor_start)

        if high_start == 8 or medium_start == 10 or low_start == 7 or \
                high_end == -1 or medium_end == -1 or low_end == -1 or \
                high_kor_start == 12 or medium_kor_start == 14 or low_kor_start == 15 or \
                high_kor_end == -1 or medium_kor_end == -1 or low_kor_end == -1:
            logging.warning("번역 결과 누락")
            return None

        high_translation = response_text[high_start:high_end].strip()
        medium_translation = response_text[medium_start:medium_end].strip()
        low_translation = response_text[low_start:low_end].strip()

        high_kor_translation = response_text[high_kor_start:high_kor_end].strip()
        medium_kor_translation = response_text[medium_kor_start:medium_kor_end].strip()
        low_kor_translation = response_text[low_kor_start:low_kor_end].strip()

        print(high_translation)
        print(high_kor_translation)
        print(medium_translation)
        print(medium_kor_translation)
        print(low_translation)
        print(low_kor_translation)

        return {
            "high": high_translation,
            "medium": medium_translation,
            "low": low_translation,
            "high_kor": high_kor_translation,
            "medium_kor": medium_kor_translation,
            "low_kor": low_kor_translation
        }
    except Exception as e:
        logging.error(f"Error processing response: {e}")
        if 'response_text' in locals():
            logging.error(f"Response text: {response_text}")
        else:
            logging.error("No response text available")
        return None


def check_sentence_alignment(row):
    """
    한국어 번역과 영어 번역의 문장 수가 일치하는지 확인하고,
    일치하지 않을 경우 Gemini에 수정 요청.
    """
    def split_sentences(text):
        if pd.isna(text):
            return []
        return re.split(r'\.\s*', str(text).strip())

    # NaN 또는 float 값을 처리하여 split_sentences에 넣음
    high_kor_sentences = split_sentences(row.get('translated_high_kor', ''))
    high_sentences = split_sentences(row.get('translated_high', ''))

    medium_kor_sentences = split_sentences(row.get('translated_medium_kor', ''))
    medium_sentences = split_sentences(row.get('translated_medium', ''))

    low_kor_sentences = split_sentences(row.get('translated_low_kor', ''))
    low_sentences = split_sentences(row.get('translated_low', ''))

    def align_sentences(kor_sentences, eng_sentences, level):
        if len(kor_sentences) != len(eng_sentences):
            prompt = (f"Please adjust the number of sentences in the following translations.\n"
                      f"The sentence count must match exactly, and punctuation such as periods ('.'), exclamation marks ('!'), and question marks ('?') must be used as sentence boundaries.\n"
                      f"Korean {level} translation: {' '.join(kor_sentences)}\n"
                      f"English {level} translation: {' '.join(eng_sentences)}\n"
                      f"The number of sentences must match exactly, and each English sentence must correspond to the same meaning in the Korean translation. For example, the second sentence in the English version should have the same meaning as the second sentence in the Korean version.\n"
                      f"Also, ensure that dates are written using '-' instead of '.' (e.g., 9-15 instead of 9.15).\n"
                      f"Please return the adjusted translations in the following JSON format:\n"
                      f"{{\n"
                      f"   \"kor\": \"Adjusted Korean translation\",\n"
                      f"   \"eng\": \"Adjusted English translation\"\n"
                      f"}}")

            response = model.generate_content(prompt)
            try:
                json_response = response.text.strip()
                kor_translation = json_response.split('"kor": "')[1].split('",')[0]
                eng_translation = json_response.split('"eng": "')[1].split('"')[0]

                return split_sentences(kor_translation), split_sentences(eng_translation)
            except Exception as e:
                logging.error(f"Error adjusting sentences for {level}: {e}")
                return kor_sentences, eng_sentences

        return kor_sentences, eng_sentences

    high_kor_sentences, high_sentences = align_sentences(high_kor_sentences, high_sentences, "high")
    medium_kor_sentences, medium_sentences = align_sentences(medium_kor_sentences, medium_sentences, "medium")
    low_kor_sentences, low_sentences = align_sentences(low_kor_sentences, low_sentences, "low")

    row['translated_high_kor'] = clean_text('. '.join(high_kor_sentences) + '.')
    row['translated_high'] = clean_text('. '.join(high_sentences) + '.')
    row['translated_medium_kor'] = clean_text('. '.join(medium_kor_sentences) + '.')
    row['translated_medium'] = clean_text('. '.join(medium_sentences) + '.')
    row['translated_low_kor'] = clean_text('. '.join(low_kor_sentences) + '.')
    row['translated_low'] = clean_text('. '.join(low_sentences) + '.')

    return row


def clean_text(text):
    """
    문장에서 불필요한 공백 제거 및 중복 마침표 방지
    """
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\.\.+', '.', text)
    return text.strip()


def translate_csv(filename, chunksize=5):
    """
    CSV 파일을 chunk 단위로 읽어 번역하는 함수
    """
    reader = pd.read_csv(filename, chunksize=chunksize)

    output_filename = "translated_" + filename
    is_first_chunk = True

    for chunk in reader:
        for index, row in chunk.iterrows():
            print(f"Processing row: {index}")
            result = translate_news(row['title'], row['main'])

            if result:
                chunk.loc[index, 'translated_high'] = result.get('high', '')
                chunk.loc[index, 'translated_medium'] = result.get('medium', '')
                chunk.loc[index, 'translated_low'] = result.get('low', '')

                chunk.loc[index, 'translated_high_kor'] = result.get('high_kor', '')
                chunk.loc[index, 'translated_medium_kor'] = result.get('medium_kor', '')
                chunk.loc[index, 'translated_low_kor'] = result.get('low_kor', '')
            else:
                chunk.loc[index, 'translated_high'] = ''
                chunk.loc[index, 'translated_medium'] = ''
                chunk.loc[index, 'translated_low'] = ''
                chunk.loc[index, 'translated_high_kor'] = ''
                chunk.loc[index, 'translated_medium_kor'] = ''
                chunk.loc[index, 'translated_low_kor'] = ''

        chunk.to_csv(output_filename, mode='a', header=is_first_chunk, index=False)
        is_first_chunk = False

    return output_filename


def update_csv_with_sentence_alignment(filename):
    """
    번역된 CSV 파일을 불러와서, 문장 수 일치 여부를 확인하고 수정하는 함수
    """
    df = pd.read_csv(filename)

    for index, row in df.iterrows():
        df.loc[index] = check_sentence_alignment(row)

    df.to_csv(filename, index=False)
    print(f"CSV 파일 {filename}이(가) 업데이트되었습니다.")


class Command(BaseCommand):
    help = 'Translates news articles from CSV file and checks sentence alignment.'

    def handle(self, *args, **options):
        filename = "20240919.csv"
        translated_file = translate_csv(filename)
        update_csv_with_sentence_alignment(translated_file)
        self.stdout.write(self.style.SUCCESS('Successfully translated and updated news articles with sentence alignment.'))
