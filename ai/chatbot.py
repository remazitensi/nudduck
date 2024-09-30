import threading
import json
import torch
from transformers import GPT2LMHeadModel, PreTrainedTokenizerFast
from utils.BotServer import BotServer
from concurrent.futures import ThreadPoolExecutor

# GPT-2 모델 및 토크나이저 로드
tokenizer = PreTrainedTokenizerFast.from_pretrained("./models/finetuned_kogpt2_interview")
model = GPT2LMHeadModel.from_pretrained("./models/finetuned_kogpt2_interview")


# 유저의 답변을 받아 연관된 질문을 생성하는 함수
def generate_followup_question(answer):
    inputs = tokenizer(answer, return_tensors="pt", max_length=512, truncation=True, padding=True)
    outputs = model.generate(
        inputs.input_ids,
        attention_mask=inputs.attention_mask,
        max_new_tokens=100,  # 생성할 질문의 길이 제한
        no_repeat_ngram_size=2,
        temperature=0.8,
        top_k=30,
        top_p=0.95,
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id,
        do_sample=True
    )
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    # 질문과 중복된 부분이 있을 경우 중복된 부분만 제거
    if generated_text.startswith(answer):
        generated_text = generated_text[len(answer):].strip()

    # ':'가 있으면 제거하는 로직 추가
    if generated_text.startswith(":"):
        generated_text = generated_text[1:].strip()

    # 불필요한 패턴이 등장하면 해당 패턴과 그 뒤를 모두 제거
    stop_phrases = ["답변:", "답변을:", "지원장:", "대답:", "지원자의:", "답변이:", "싶습니네:", "지원사:", "말씀:", "네:"]

    for phrase in stop_phrases:
        if phrase in generated_text:
            generated_text = generated_text.split(phrase)[0].strip()  # 해당 패턴 이후의 모든 텍스트 제거

    # 문장이 비정상적으로 짧거나 잘린 경우에 대한 처리
    if len(generated_text) > 50:
        last_sentence_end = max(generated_text.rfind('.'), generated_text.rfind('?'), generated_text.rfind('!'))
        if last_sentence_end != -1:
            generated_text = generated_text[:last_sentence_end + 1].strip()

    # 문장 끝에 .가 없으면 추가
    if not generated_text.endswith("."):
        generated_text += "."

    # 문장이 반복되는 패턴이 있으면 이를 필터링
    if len(set(generated_text.split())) < len(generated_text.split()) * 0.7:  # 단어 중복 비율이 70% 이상이면
        generated_text = "질문에 대해 정확한 답변을 제공하기 어려웠습니다. 다시 질문해주세요."

    # 문장이 비정상적으로 짧거나 비어있는 경우 기본 응답을 반환
    if len(generated_text) < 5 or not generated_text.strip():
        generated_text = "잘 이해하지 못했습니다. 다시 질문해주세요."

    return generated_text


def to_client(conn, addr):
    try:
        read = conn.recv(2048).decode('utf-8')  # 수신 시 UTF-8로 디코딩
        print('======================')
        print(f"Connection from: {addr}")

        if not read:
            print('클라이언트 연결 끊김')
            return

        recv_json_data = json.loads(read)
        query = recv_json_data.get('Query', '')

        if not query:
            print("잘못된 요청: Query가 비어있음")
            conn.send(json.dumps({"Error": "Query가 비어있습니다."}, ensure_ascii=False).encode('utf-8'))
            return

        # GPT-2로 연관 질문 생성 (유저의 답변을 기반으로)
        answer = generate_followup_question(query)

        # 응답 전송
        response = {
            "Query": query,
            "Answer": answer  # 후속 질문 대신 Answer로 변경
        }
        conn.send(json.dumps(response, ensure_ascii=False).encode('utf-8'))  # UTF-8로 인코딩하여 전송

    except UnicodeDecodeError:
        print("UnicodeDecodeError 발생: 잘못된 입력 처리")
        response = {
            "Answer": "잘못된 입력이 감지되었습니다. 다시 질문해주세요."
        }
        conn.send(json.dumps(response, ensure_ascii=False).encode('utf-8'))

    except json.JSONDecodeError:
        print("JSON 디코딩 오류 발생")
        conn.send(json.dumps({"Error": "잘못된 JSON 형식입니다."}, ensure_ascii=False).encode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")
        conn.send(json.dumps({"Error": "서버 내부 오류가 발생했습니다."}, ensure_ascii=False).encode('utf-8'))
    finally:
        conn.close()  # 연결 종료

if __name__ == '__main__':
    port = 5050
    listen = 1000
    bot = BotServer(port, listen)
    bot.create_sock()
    print("챗봇 서버 시작...")

    # 최대 스레드 수를 10으로 제한한 스레드 풀 생성
    executor = ThreadPoolExecutor(max_workers=10)

    while True:
        conn, addr = bot.ready_for_client()
        # 스레드 풀을 사용해 클라이언트 처리를 비동기적으로 실행
        executor.submit(to_client, conn, addr)
