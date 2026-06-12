import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

// 이미지 파일을 base64 문자열로 변환
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // "data:image/jpeg;base64,XXXX" 형태에서 실제 base64 부분만 추출
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 파일 MIME 타입 정규화 (API가 허용하는 형식만)
function getMimeType(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return allowed.includes(file.type) ? file.type : 'image/jpeg'
}

/**
 * 업로드된 사진과 요구사항을 바탕으로 디자인 시안 2~3개 생성
 * @param {File} photoFile
 * @param {{ style: string, color: string, purpose: string }} requirements
 * @param {{ id: string, name: string }} category
 * @returns {Promise<Array<{ name, concept, materials, features }>>}
 */
export async function generateDesigns(photoFile, requirements, category) {
  const base64 = await fileToBase64(photoFile)
  const mimeType = getMimeType(photoFile)

  const reqParts = [
    requirements.style && `스타일: ${requirements.style}`,
    requirements.color && `색상: ${requirements.color}`,
    requirements.purpose && `용도: ${requirements.purpose}`,
  ].filter(Boolean)

  const reqText =
    reqParts.length > 0
      ? `\n\n사용자 요구사항:\n${reqParts.join('\n')}`
      : ''

  const prompt = `이 사진을 보고 "${category.name}" 맞춤 디자인 시안을 2~3개 만들어주세요.${reqText}

각 시안을 아래 JSON 배열 형식으로만 답변해주세요. 설명이나 다른 텍스트는 쓰지 마세요.

[
  {
    "name": "시안 이름 (짧고 감각적으로)",
    "concept": "컨셉 설명 (2~3문장, 디자인 철학과 전체적인 느낌)",
    "materials": "소재 제안 (구체적인 소재 2~3가지)",
    "features": ["특징1", "특징2", "특징3"]
  }
]`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: base64 },
          },
          { type: 'text', text: prompt },
        ],
      },
    ],
  })

  const text = message.content[0].text.trim()
  // 응답에서 JSON 배열 부분만 추출 (모델이 앞뒤에 텍스트를 붙이는 경우 대비)
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('API 응답을 읽을 수 없습니다.')
  return JSON.parse(jsonMatch[0])
}
