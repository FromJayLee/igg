import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdoptionFormSchema } from '@/types/adoption';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 텍스트 필드 추출 및 검증
    const payload = {
      gameName: String(formData.get('gameName') || ''),
      description: String(formData.get('description') || ''),
      genre: String(formData.get('genre') || ''),
      tagline: String(formData.get('tagline') || ''),
      downloadUrl: String(formData.get('downloadUrl') || ''),
      homepageUrl: String(formData.get('homepageUrl') || ''),
      planetType: String(formData.get('planetType') || ''),
    };

    // Zod 스키마로 검증
    const validatedData = AdoptionFormSchema.parse(payload);

    // 파일 추출
    const thumbnail = formData.get('thumbnail') as File | null;
    const screenshots: File[] = [];
    
    // 스크린샷 파일들 추출
    for (let i = 0; i < 4; i++) {
      const screenshot = formData.get(`screenshot_${i}`) as File | null;
      if (screenshot) {
        screenshots.push(screenshot);
      }
    }

    // 파일 검증
    if (!thumbnail) {
      return NextResponse.json(
        { success: false, error: '썸네일 이미지가 필요합니다.' },
        { status: 400 }
      );
    }

    if (screenshots.length === 0) {
      return NextResponse.json(
        { success: false, error: '스크린샷을 최소 1개 이상 업로드해야 합니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 및 크기 검증
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    // 썸네일 검증
    if (!allowedImageTypes.includes(thumbnail.type)) {
      return NextResponse.json(
        { success: false, error: '썸네일은 PNG 또는 JPEG 형식이어야 합니다.' },
        { status: 400 }
      );
    }

    if (thumbnail.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: '썸네일 파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 스크린샷 검증
    for (const screenshot of screenshots) {
      if (!allowedImageTypes.includes(screenshot.type)) {
        return NextResponse.json(
          { success: false, error: '스크린샷은 PNG, JPEG, 또는 GIF 형식이어야 합니다.' },
          { status: 400 }
        );
      }

      if (screenshot.size > maxFileSize) {
        return NextResponse.json(
          { success: false, error: '스크린샷 파일 크기는 5MB 이하여야 합니다.' },
          { status: 400 }
        );
      }
    }

    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // 고유 ID 생성
    const planetId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const datePath = timestamp.slice(0, 7).replace('-', '/'); // YYYY/MM 형식

    try {
      // 1. 썸네일 이미지 처리 및 업로드
      let thumbnailUrl = '';
      if (thumbnail) {
        // 썸네일을 64x64로 리사이즈 (nearest neighbor 보간법으로 픽셀아트 스타일 유지)
        const thumbnailBuffer = await sharp(await thumbnail.arrayBuffer())
          .resize(64, 64, { kernel: sharp.kernel.nearest })
          .png()
          .toBuffer();

        const thumbnailFileName = `thumbnails/planets/${datePath}/${planetId}.png`;
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailBuffer, {
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
          .from('thumbnails')
          .getPublicUrl(thumbnailFileName);
        
        thumbnailUrl = thumbnailUrlData.publicUrl;
      }

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

      // 3. 데이터베이스에 행성 정보 저장
      const { data: planetData, error: planetError } = await supabase
        .from('planets')
        .insert({
          id: planetId,
          game_name: validatedData.gameName,
          description: validatedData.description,
          genre: validatedData.genre,
          tagline: validatedData.tagline,
          download_url: validatedData.downloadUrl,
          homepage_url: validatedData.homepageUrl || null,
          planet_type: validatedData.planetType,
          thumbnail_url: thumbnailUrl,
          screenshot_urls: screenshotUrls,
          status: 'pending',
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select()
        .single();

      if (planetError) {
        console.error('행성 데이터 저장 오류:', planetError);
        return NextResponse.json(
          { success: false, error: '행성 정보 저장에 실패했습니다.' },
          { status: 500 }
        );
      }

      // 4. 성공 응답
      return NextResponse.json(
        { 
          success: true, 
          planetId: planetId,
          message: '행성 분양 신청이 성공적으로 제출되었습니다.' 
        },
        { status: 201 }
      );

    } catch (error) {
      console.error('Supabase 작업 오류:', error);
      return NextResponse.json(
        { success: false, error: '서버 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

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
