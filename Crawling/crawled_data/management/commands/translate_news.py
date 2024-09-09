from django.core.management.base import BaseCommand
import google.generativeai as genai
import pandas as pd
from tqdm import tqdm

class Command(BaseCommand):
    help = "CSV 파일에 있는 뉴스를 제미나이 API를 통해 번역하여 저장."

    def handle(self, *args, **kwargs):
        # gemini API 설정
        api_key = "YOUR_GEMINI_API_KEY"
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        def translate_with_gemini(title, content):
            try:
                question = f"{title}가 제목이고, {content}가 내용이야. 제목과 내용을 영어로 번역해줘."
                response = model.generate_content(question)
                return response.text  # 번역된 결과 반환
            except Exception as e:
                # 에러 발생 시, 에러 메시지 출력 후 넘어감
                print(f"Error translating article: {e}")
                return None

        # CSV 파일 읽기
        df = pd.read_csv("article_df.csv")

        # 번역 결과를 저장할 컬럼 추가
        df['title_en'] = ""
        df['main_en'] = ""

        for i in tqdm(range(len(df))):
            try:
                title_en = translate_with_gemini(df.at[i, 'title'], df.at[i, 'main'])
                if title_en:  # 번역 결과가 있는 경우에만 저장
                    df.at[i, 'title_en'] = title_en  # 번역된 제목 저장
                    df.at[i, 'main_en'] = title_en  # 번역된 본문 저장
            except Exception as e:
                # 각 문서 처리 중 에러가 발생해도 다음 문서로 넘어감
                print(f"Error processing row {i}: {e}")
                continue

        # 번역된 데이터로 새로운 CSV 파일 저장
        df.to_csv("translated_article_df.csv", index=False)
        self.stdout.write(self.style.SUCCESS('번역 및 CSV 저장 완료!'))
