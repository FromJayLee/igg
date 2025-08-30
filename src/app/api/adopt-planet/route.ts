import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdoptionFormSchema } from '@/types/adoption';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(cookies());
    
    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // FormData 파싱
    const formData = await request.formData();
    const gameName = formData.get('gameName') as string;
    const description = formData.get('description') as string;
    const genre = formData.get('genre') as string;
    const tagline = formData.get('tagline') as string;
    const downloadUrl = formData.get('downloadUrl') as string;
    const homepageUrl = formData.get('homepageUrl') as string;

    const thumbnail = formData.get('thumbnail') as File;
    const screenshots = formData.getAll('screenshots') as File[];

    // 데이터 검증
    const validatedData = AdoptionFormSchema.parse({
      gameName,
      description,
      genre,
      tagline,
      downloadUrl,
      homepageUrl,
    });

    // 필수 파일 확인
    if (!thumbnail || !screenshots || screenshots.length === 0) {
      return NextResponse.json(
        { success: false, error: '썸네일과 스크린샷이 필요합니다.' },
        { status: 400 }
      );
    }

    // 고유 ID 생성
    const planetId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const datePath = new Date().toISOString().split('T')[0];

    // 1. 썸네일 업로드 (절차적 생성된 이미지)
    const thumbnailFileName = `planets/${datePath}/${planetId}_thumbnail.png`;
    const { data: thumbnailData, error: thumbnailError } = await supabase.storage
      .from('planets')
      .upload(thumbnailFileName, thumbnail, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    if (thumbnailError) {
      console.error('썸네일 업로드 오류:', thumbnailError);
      return NextResponse.json(
        { success: false, error: '썸네일 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 공개 URL 생성
    const { data: thumbnailUrlData } = supabase.storage
      .from('planets')
      .getPublicUrl(thumbnailFileName);
    
    const thumbnailUrl = thumbnailUrlData.publicUrl;

    // 2. 스크린샷 업로드
    const screenshotUrls: string[] = [];
    for (let i = 0; i < screenshots.length; i++) {
      const screenshot = screenshots[i];
      const screenshotFileName = `screenshots/planets/${datePath}/${planetId}_${i}.${screenshot.type.split('/')[1]}`;
      
      const { data: screenshotData, error: screenshotError } = await supabase.storage
        .from('screenshots')
        .upload(screenshotFileName, screenshot, {
          contentType: screenshot.type,
          cacheControl: '3600',
        });

      if (screenshotError) {
        console.error('스크린샷 업로드 오류:', screenshotError);
        return NextResponse.json(
          { success: false, error: '스크린샷 업로드에 실패했습니다.' },
          { status: 500 }
        );
      }

      // 공개 URL 생성
      const { data: screenshotUrlData } = supabase.storage
        .from('screenshots')
        .getPublicUrl(screenshotFileName);
      
      screenshotUrls.push(screenshotUrlData.publicUrl);
    }

    // 3. 데이터베이스에 행성 정보 저장 (planet_thumbnail_url 사용)
    const planetDataToInsert = {
      id: planetId,
      game_name: validatedData.gameName,
      description: validatedData.description,
      genre: validatedData.genre,
      tagline: validatedData.tagline,
      download_url: validatedData.downloadUrl,
      homepage_url: validatedData.homepageUrl || null,

      planet_thumbnail_url: thumbnailUrl, // 절차적 생성된 썸네일 URL
      screenshot_urls: screenshotUrls,
      status: 'pending',
      submitted_by: user.id,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { data: planetData, error: planetError } = await supabase
      .from('planets')
      .insert(planetDataToInsert)
      .select()
      .single();

    if (planetError) {
      console.error('행성 데이터 저장 오류:', planetError);
      return NextResponse.json(
        { success: false, error: '행성 정보 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      planetId: planetId,
      message: '행성 분양 신청이 완료되었습니다.',
    });

  } catch (error) {
    console.error('API 오류:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
