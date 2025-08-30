-- 관리자 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RLS 정책 설정
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 관리자만 admin_users 테이블을 읽을 수 있도록 정책 설정
CREATE POLICY "관리자만 admin_users 읽기" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.role IN ('admin', 'super_admin')
        )
    );

-- 서비스 롤만 admin_users를 수정할 수 있도록 정책 설정
CREATE POLICY "서비스 롤만 admin_users 수정" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- 기본 관리자 계정 생성 (실제 운영 시에는 수동으로 생성)
-- INSERT INTO admin_users (user_id, role) VALUES ('YOUR_ADMIN_USER_ID', 'admin');
