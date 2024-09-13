import json
import logging
import google.generativeai as genai
import pandas as pd
from Crawling import settings
import re

GEN_AI_SECRET_KEY = settings.GEN_AI_SECRET_KEY

# Gemini API 설정
genai.configure(api_key=GEN_AI_SECRET_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

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
    prompt = (f"제목: {title}. 내용: {content}. "
              f"다음 지침에 따라 이 정보를 영어로 번역해 주세요. "
              f"1. 번역 스타일은 {style} 스타일로 하여 정확하고 간결하게 번역해 주세요. "
              f"2. 내용의 도메인은 {domain}이며, 전문적인 용어는 정확하게 번역해 주세요. "
              f"3. 내용의 번역은 세 가지 난이도로 제공하십시오: "
              f"   - 어려운 버전(high) "
              f"   - 중간 버전(medium) "
              f"   - 쉬운 버전(low) "
              f"4. 결과는 다음과 같은 JSON 형식으로 제공해 주세요: {{ "
              f"   \"high\": \"...\", "
              f"   \"medium\": \"...\", "
              f"   \"low\": \"...\""
              f" }}")

    # 모델 API 호출 (가정: model.generate_content()는 dict 형식으로 결과를 반환)
    response = model.generate_content(prompt)

    try:
        # API 응답에서 JSON 데이터 추출
        response_text = response.text
        print(response_text)

        # JSON 데이터 추출을 위한 정규 표현식
        json_match = re.search(r'```json(.*?)```', response_text, re.DOTALL)
        if json_match:
            json_data_str = json_match.group(1).strip()

            # JSON 데이터에서 시작과 끝의 ``` 제거
            json_data_str = json_data_str.lstrip('```').rstrip('```').strip()

            try:
                json_data = json.loads(json_data_str)
                return json_data
            except json.JSONDecodeError as e:
                logging.error(f"JSON parsing error: {e}")
                logging.error(f"JSON data: {json_data_str}")
                return None
        else:
            logging.error(f"Failed to find JSON data in response: {response_text}")
            return None
    except AttributeError as e:
        logging.error(f"Invalid JSON format in response: {response_text}")
        return None
    except Exception as e:
        logging.error(f"Unexpected error occurred: {e}")
        logging.error(f"Response text: {response_text}")
    return None

def translate_csv(filename, chunksize=5):
    """
    CSV 파일을 chunk 단위로 읽어 번역하는 함수

    Args:
        filename (str): CSV 파일 이름
        chunksize (int, optional): 한 번에 읽어들일 데이터 개수. 기본값은 4.
    """
    reader = pd.read_csv(filename, chunksize=chunksize)
    for chunk in reader:
        for index, row in chunk.iterrows():
            print(f"Processing row: {index}")
            result = translate_news(row['title'], row['main'])

            if result:
                chunk.loc[index, 'translated_high'] = result.get('high', '')
                chunk.loc[index, 'translated_medium'] = result.get('medium', '')
                chunk.loc[index, 'translated_low'] = result.get('low', '')
            else:
                chunk.loc[index, 'translated_high'] = ''
                chunk.loc[index, 'translated_medium'] = ''
                chunk.loc[index, 'translated_low'] = ''

        # 번역된 데이터를 새로운 CSV 파일로 저장
        chunk.to_csv("translated_" + filename, mode='a', header=False, index=False)

# 메인 함수
if __name__ == "__main__":
    filename = "../../../20240913.csv"
    translate_csv(filename)
