import { TextResult, Translator } from 'deepl-node';
import { NextResponse } from 'next/server';

const translator = new Translator(process.env.DEEPL_API_KEY as string);

export async function POST(request: Request) {
  const body = await request.json();
  const isKorean = body.source.match(/[ㄱ-ㅎ가-힣]/);
  const translated = (await translator.translateText(body.source, isKorean ? 'ko' : 'en', isKorean ? 'en-US' : 'ko')) as TextResult;
  const reverseTranslated = await translator.translateText(translated.text, isKorean ? 'en' : 'ko', isKorean ? 'ko' : 'en-US');

  return new NextResponse(JSON.stringify({ translated: translated.text, reverseTranslated: reverseTranslated.text }));
}
