import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message } = await request.json()

  const crewaiUrl = process.env.CREWAI_SERVICE_URL

  const response = await fetch(`${crewaiUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })

  const data = await response.json()

  return NextResponse.json({
    reply: data.reply,
    actions: data.actions || []
  })
}
