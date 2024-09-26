export function getAccuracyFeedback(score: number) {
    if (score < 60) {
      return "발음이 전반적으로 부정확하며, 기본적인 음소와 단어의 발음을 개선할 필요가 있습니다. 꾸준한 연습을 통해 발음을 더 정확하게 교정하는 것이 필요합니다.";
    } else if (score < 70) {
      return "발음이 부족한 부분이 있습니다. 특히 특정 음소나 단어에서 발음이 명확하지 않으므로, 구체적인 발음 연습이 필요합니다.";
    } else if (score < 80) {
      return "발음이 대체로 정확하지만, 몇 가지 발음에서 불명확한 부분이 있습니다. 발음의 일관성을 더 높이기 위한 연습이 필요합니다.";
    } else if (score < 90) {
      return "발음이 대부분 정확합니다. 발음이 원어민에 가깝지만, 몇몇 미세한 부분에서 개선할 수 있습니다.";
    } else if (score <= 100) {
      return "발음이 매우 정확하며, 원어민과 거의 차이가 없습니다. 발음의 정밀함이 뛰어납니다.";
    }
  }
  
  export function getFluencyFeedback(score: number) {
    if (score < 60) {
      return "유창성이 부족하여 말의 흐름이 자주 끊깁니다. 더 자연스럽게 말하기 위해서는 연속적인 문장 연습이 필요합니다.";
    } else if (score < 70) {
      return "말의 흐름이 다소 부자연스럽고 중간중간 멈춤이 있습니다. 좀 더 부드럽고 자연스러운 말하기를 연습하세요.";
    } else if (score < 80) {
      return "발음이 대체로 유창하지만, 몇몇 구간에서 끊기거나 멈추는 부분이 있어 더 자연스럽게 말할 필요가 있습니다.";
    } else if (score < 90) {
      return "대부분의 발음이 유창하며, 자연스럽게 연결됩니다. 간혹 미세한 흐름의 끊김이 있을 수 있으나 전반적으로 매우 좋습니다.";
    } else if (score <= 100) {
      return "유창성이 매우 뛰어나며, 말의 흐름이 원어민처럼 자연스럽습니다.";
    }
  }
  
  export function getProsodyFeedback(score: number) {
    if (score < 60) {
      return "운율이 부자연스럽고, 억양과 리듬에서 많이 부족합니다. 억양과 강세를 연습해 더 자연스러운 발음을 만들어 보세요.";
    } else if (score < 70) {
      return "운율이 다소 어색하며, 억양과 리듬이 부자연스럽습니다. 좀 더 자연스러운 리듬과 억양을 위해 연습이 필요합니다.";
    } else if (score < 80) {
      return "운율이 괜찮지만, 몇몇 구간에서 억양이 어색할 수 있습니다. 조금 더 자연스러운 강세와 억양을 유지해보세요.";
    } else if (score < 90) {
      return "발음의 운율이 전반적으로 자연스럽고 강세와 리듬이 적절합니다. 억양이 약간 부자연스러운 부분이 있을 수 있지만 매우 좋습니다.";
    } else if (score <= 100) {
      return "운율이 매우 자연스러우며, 억양, 강세, 말하기 속도와 리듬 모두에서 원어민과 비슷합니다.";
    }
  }
  
  export function getCompletenessFeedback(score: number) {
    if (score < 60) {
      return "많은 단어가 누락되거나 불완전하게 발음되었습니다. 텍스트를 읽을 때 주의 깊게 발음하는 연습이 필요합니다.";
    } else if (score < 70) {
      return "일부 단어가 누락되거나 발음이 불완전합니다. 텍스트를 천천히 읽으면서 발음을 교정하는 것이 좋습니다.";
    } else if (score < 80) {
      return "대부분의 단어가 발음되었으나 몇몇 단어에서 발음 누락이나 불완전함이 있었습니다.";
    } else if (score < 90) {
      return "거의 모든 단어가 완전하게 발음되었습니다. 발음의 정확도가 좋습니다.";
    } else {
      return "모든 단어를 완벽히 발음했습니다. 텍스트를 매우 정확하고 완전하게 구사하고 있습니다.";
    }
  }
  