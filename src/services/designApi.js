import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getMimeType(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return allowed.includes(file.type) ? file.type : 'image/jpeg'
}

/**
 * 1단계: 사진 유효성 검사
 * 사진이 해당 신체 부위를 찍은 것인지 확인
 * @returns {{ valid: boolean, reason: string }}
 */
export async function validatePhoto(photoFile, category) {
  const base64 = await fileToBase64(photoFile)
  const mimeType = getMimeType(photoFile)

  const prompt = `이 사진을 분석해주세요.

"${category.name}"을 제작하려면 사람의 "${category.bodyPart}" 부위 사진이 필요합니다.

다음을 확인해주세요:
1. 사진에 사람의 신체가 있는가?
2. 그 신체 부위가 "${category.bodyPart}"인가?

아래 JSON 형식으로만 답변하세요. 다른 텍스트는 쓰지 마세요.
{ "valid": true 또는 false, "reason": "한 줄 이유" }`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 128,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
        { type: 'text', text: prompt },
      ],
    }],
  })

  const text = message.content[0].text.trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return { valid: false, reason: '사진을 분석할 수 없습니다.' }

  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    return { valid: false, reason: '사진을 분석할 수 없습니다.' }
  }
}

/**
 * 2단계: 디자인 시안 생성
 * 사진 + 요구사항 + 착용자 정보를 바탕으로 시안 2~3개 생성
 */
export async function generateDesigns(photoFile, requirements, wearerInfo, category) {
  const base64 = await fileToBase64(photoFile)
  const mimeType = getMimeType(photoFile)

  // 요구사항 텍스트 조합
  const reqParts = [
    requirements.style && `선호 스타일: ${requirements.style}`,
    requirements.color && `선호 색상: ${requirements.color}`,
    requirements.purpose && `주요 용도: ${requirements.purpose}`,
  ].filter(Boolean)

  // 착용자 정보 텍스트 조합
  const wearerParts = [
    wearerInfo.ageGroup && `나이대: ${wearerInfo.ageGroup}`,
    wearerInfo.skinType && `피부 민감도: ${wearerInfo.skinType}`,
    wearerInfo.sweating && `땀 분비: ${wearerInfo.sweating}`,
  ].filter(Boolean)

  // 알레르기 제한 텍스트
  const allergies = wearerInfo.allergies ?? []
  const allergyText = allergies.length > 0
    ? `\n⚠️ 절대 사용 금지 소재 (알레르기): ${allergies.join(', ')}`
    : ''

  const contextText = [
    reqParts.length > 0 ? `[사용자 요구사항]\n${reqParts.join('\n')}` : '',
    wearerParts.length > 0 ? `[착용자 정보]\n${wearerParts.join('\n')}` : '',
    allergyText,
  ].filter(Boolean).join('\n\n')

  const prompt = `당신은 의료기기 디자인 전문가입니다.
이 사진 속 신체 부위를 분석하여 "${category.name}" 맞춤 디자인 시안을 2~3개 만들어주세요.

${contextText}

시안 작성 시 다음을 반드시 반영하세요:
- 착용자의 나이대와 피부 민감도에 맞는 소재 선택
- 알레르기 유발 소재는 절대 포함하지 말 것
- 사진 속 신체 부위의 형태·색상·크기 특징을 시안에 반영

아래 JSON 배열 형식으로만 답변하세요.

[
  {
    "name": "시안 이름 (짧고 감각적으로)",
    "concept": "컨셉 설명 (2~3문장, 신체 특징 반영 내용 포함)",
    "materials": "소재 제안 (알레르기 고려한 구체적 소재 2~3가지)",
    "features": ["특징1", "특징2", "특징3"]
  }
]`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
        { type: 'text', text: prompt },
      ],
    }],
  })

  const text = message.content[0].text.trim()
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('API 응답을 읽을 수 없습니다.')
  return JSON.parse(jsonMatch[0])
}
