import logging
import openai
from django.core.management.base import BaseCommand
import pandas as pd
from Crawling import settings

OPENAI_API_KEY = settings.OPEN_AI_API_KEY

# OpenAI API 설정
openai.api_key = OPENAI_API_KEY

def translate_news(title, content, domain="general", style="formal"):
    """
    뉴스 기사를 번역하고 JSON 형식으로 반환하는 함수
    Args:
        title (str): 뉴스 기사 제목
        content (str): 뉴스 기사 내용
        domain (str, optional): 뉴스 기사 도메인 (예: technology, finance, etc.). Defaults to "general".
        style (str, optional): 번역 스타일 (예: formal, informal, casual). Defaults to "formal".
    Returns:
        dict: 번역 결과를 담은 JSON 형식의 딕셔너리
    """
    # OpenAI API 프롬프트 설정
    prompt = (f"제목: {title}. 내용: {content}. "
              f"다음 지침에 따라 이 정보를 정확하게 번역해 주세요.\n"
              f"1. 먼저 영어로 세 가지 난이도(어려운, 중간, 쉬운)로 번역해 주세요.\n"
              f"2. 그리고, 각각의 영어 번역에 맞는 한국어 해석도 제공해 주세요.\n"
              f"3. 한국어 해석과 영어 번역에서 문장 수가 반드시 일치해야 하며, 문장의 기준은 마침표(.)의 개수입니다. 절대 문장을 합치지 마세요.\n"
              f"    - 예시: 중간 난이도의 한국어 해석에 문장이 10개라면, 중간 난이도의 영어 번역도 반드시 10문장이어야 합니다.\n"
              f"4. 내용 안에 사용된 모든 \"는 '로 변환해 주세요. 단, JSON 문법에서 사용되는 \"는 그대로 유지해야 합니다.\n"
              f"    예시로, \"텍스트\"는 '텍스트'로 바꿔야 하지만, JSON에서 필드 이름을 감싸는 \"는 그대로 유지해 주세요.\n"
              f"5. 번역된 내용은 아래의 JSON 형식으로 제공해 주세요:\n"
              f"{{ "
              f"   \"high_kor\": \"...\", "
              f"   \"medium_kor\": \"...\", "
              f"   \"low_kor\": \"...\", "
              f"   \"high\": \"...\", "
              f"   \"medium\": \"...\", "
              f"   \"low\": \"...\""
              f" }}\n"
              f"문장 수 일치 규칙을 반드시 지켜야 하며, 문장 수가 일치하지 않으면 번역이 잘못된 것으로 간주됩니다. 문장 수를 확인하고 다시 제출해 주세요."
              )

    # OpenAI API를 사용하여 번역 요청
    try:
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",  # GPT 모델 엔진 선택
            prompt=prompt,
            max_tokens=2048,
            temperature=0.7
        )

        response_text = response.choices[0].text.strip()
        print(response_text)

        # JSON에서 각각의 번역 추출
        high_translation = response_text.split('"high": "')[1].split('",')[0].strip()
        medium_translation = response_text.split('"medium": "')[1].split('",')[0].strip()
        low_translation = response_text.split('"low": "')[1].split('"')[0].strip()

        high_kor_translation = response_text.split('"high_kor": "')[1].split('",')[0].strip()
        medium_kor_translation = response_text.split('"medium_kor": "')[1].split('",')[0].strip()
        low_kor_translation = response_text.split('"low_kor": "')[1].split('"')[0].strip()

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

        # 번역된 데이터를 새로운 CSV 파일로 저장
        chunk.to_csv(output_filename, mode='a', header=False, index=False)

class Command(BaseCommand):
    help = 'Translates news articles from CSV file'

    def handle(self, *args, **options):
        filename = "20240919.csv"  # CSV 파일 경로를 적절히 수정하세요
        translate_csv(filename)
        self.stdout.write(self.style.SUCCESS('Successfully translated news articles'))
