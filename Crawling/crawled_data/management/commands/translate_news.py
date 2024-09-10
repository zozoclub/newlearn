import json
import logging
from django.core.management.base import BaseCommand
import google.generativeai as genai
import pandas as pd
from tqdm import tqdm
from Crawling import settings
from datetime import datetime
import re

GEN_AI_SECRET_KEY = settings.GEN_AI_SECRET_KEY

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Command(BaseCommand):
    help = "CSV 파일에 있는 뉴스를 제미나이 API를 통해 번역하여 저장."

    def handle(self, *args, **kwargs):
        # Gemini API 설정
        genai.configure(api_key=GEN_AI_SECRET_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')

        def translate_with_gemini(title, content):
            try:
                question = (f"제목: {title}. 내용: {content}. "
                            f"다음 지침에 따라 이 정보를 영어로 번역해 주세요. "
                            f"1. 제목과 내용을 영어로 번역하십시오. "
                            f"2. 내용의 번역은 세 가지 난이도로 제공하십시오: "
                            f"   - 어려운 버전(high) "
                            f"   - 중간 버전(medium) "
                            f"   - 쉬운 버전(low) "
                            f"3. 각 버전을 한국어로도 번역하십시오. "
                            f"4. 결과는 다음 형식의 JSON으로 제공해 주세요: "
                            f"{{"
                            f"  \"title\": \"번역된 제목\", "
                            f"  \"content_translation_high\": \"어려운 영어 번역\", "
                            f"  \"content_translation_medium\": \"중간 영어 번역\", "
                            f"  \"content_translation_low\": \"쉬운 영어 번역\", "
                            f"  \"content_korean_high\": \"어려운 영어 번역의 한국어 번역\", "
                            f"  \"content_korean_medium\": \"중간 영어 번역의 한국어 번역\", "
                            f"  \"content_korean_low\": \"쉬운 영어 번역의 한국어 번역\" "
                            f"}}"
                            f"5. 내용 내부에 \"\"를 쓰는 경우, \\\"로 작성해 주세요.")
                response = model.generate_content(question)
                response_text = response.text
                save_response_to_file(response_text)
                return response_text
            except Exception as e:
                logging.error(f"Error translating article: {e}")
                return None

        def save_response_to_file(response_text):
            try:
                current_date = datetime.now().strftime("%Y%m%d")
                response_filename = f"{current_date}_responses.txt"
                with open(response_filename, 'a') as file:
                    file.write(response_text + '\n')
                logging.info(f"API 응답을 텍스트로 저장했습니다: {response_filename}")
            except Exception as e:
                logging.error(f"Error saving response to file: {e}")

        def parse_json_response(response):
            try:
                # 백틱과 'json' 태그 제거
                cleaned_response = re.sub(r'```(?:json)?\s*', '', response).strip()
                cleaned_response = re.sub(r'```$', '', cleaned_response).strip()

                # JSON 파싱
                json_content = json.loads(cleaned_response)
                logging.debug(f"Extracted JSON content: {json_content}")
                return json_content
            except json.JSONDecodeError as e:
                logging.error(f"JSON parsing error: {e}")
                logging.error(f"Problematic JSON content: {response}")
                return None
            except Exception as e:
                logging.error(f"Unexpected error while parsing JSON: {e}")
                return None

        current_date = datetime.now().strftime("%Y%m%d")
        filename = f"{current_date}.csv"

        try:
            df = pd.read_csv(filename)
        except FileNotFoundError:
            logging.error(f"CSV file not found: {filename}")
            return

        new_columns = ['content_translation_high', 'content_translation_medium', 'content_translation_low',
                       'content_korean_high', 'content_korean_medium', 'content_korean_low']
        for col in new_columns:
            if col not in df.columns:
                df[col] = ""

        # Limit to 10 rows
        num_rows_to_process = min(len(df), 10)
        for i in tqdm(range(num_rows_to_process)):
            try:
                translated_data = translate_with_gemini(df.at[i, 'title'], df.at[i, 'main'])
                if translated_data:
                    logging.info(f"API 응답 결과 Raw data / row {i}: {translated_data}")
                    # 직접 JSON 파싱
                    translation_result = parse_json_response(translated_data)
                    if translation_result:
                        for col in new_columns:
                            df.at[i, col] = translation_result.get(col, "")
                        logging.info(f"Updated row {i} with translation results.")
                    else:
                        logging.warning(f"Failed to parse JSON for row {i}")
                else:
                    logging.warning(f"No translation data for row {i}")
            except Exception as e:
                logging.error(f"Error processing row {i}: {e}")
                continue

        try:
            df.to_csv(filename, index=False)
            logging.info(f'Translation completed and saved to {filename}')
        except Exception as e:
            logging.error(f"Error saving CSV file: {e}")

        self.stdout.write(self.style.SUCCESS(f'번역 및 CSV 저장 완료! 파일명: {filename}'))
