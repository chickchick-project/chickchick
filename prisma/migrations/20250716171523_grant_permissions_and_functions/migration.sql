

-- =================================================================
-- 2. 기본 스키마 사용 권한 (가장 먼저 실행되어야 함)
-- 모든 역할이 'public' 스키마에 들어올 수 있는 기본 입장 권한 부여
-- =================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;


-- =================================================================
-- 3. 익명 사용자 (anon) 권한 설정 - '읽기 전용'
-- 로그인하지 않은 사용자는 데이터를 보기만 할 수 있어야 합니다.
-- =================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role, postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role, postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role, postgres;

-- 공개적으로 조회 가능한 모든 테이블에 대해 SELECT 권한만 부여
GRANT SELECT ON TABLE public.perfumes TO anon;
GRANT SELECT ON TABLE public.brands TO anon;
GRANT SELECT ON TABLE public.perfume_notes TO anon;
GRANT SELECT ON TABLE public.perfume_accords TO anon;
GRANT SELECT ON TABLE public.perfume_note_mappings TO anon;
GRANT SELECT ON TABLE public.perfume_accord_mappings TO anon;
GRANT SELECT ON TABLE public.posts TO anon;
GRANT SELECT ON TABLE public.comments TO anon;
-- 'users' 테이블은 개인정보이므로 anon에게 SELECT 권한을 주지 않습니다.


-- =================================================================
-- 4. 로그인한 사용자 (authenticated) 권한 설정
-- 로그인한 사용자는 자신의 데이터를 생성/수정/삭제할 수 있습니다.
-- =================================================================
-- anon이 가진 모든 SELECT 권한을 기본적으로 가집니다.
GRANT SELECT ON TABLE public.perfumes TO authenticated;
GRANT SELECT ON TABLE public.brands TO authenticated;
GRANT SELECT ON TABLE public.perfume_notes TO authenticated;
GRANT SELECT ON TABLE public.perfume_accords TO authenticated;
GRANT SELECT ON TABLE public.perfume_note_mappings TO authenticated;
GRANT SELECT ON TABLE public.perfume_accord_mappings TO authenticated;
GRANT SELECT ON TABLE public.posts TO authenticated;
GRANT SELECT ON TABLE public.comments TO authenticated;
GRANT SELECT ON TABLE public.users TO authenticated; -- 자신의 정보는 볼 수 있어야 함 (RLS로 제어)

-- 생성, 수정, 삭제가 필요한 테이블에 대한 권한 부여
GRANT INSERT, UPDATE, DELETE ON TABLE public.posts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.comments TO authenticated;
GRANT UPDATE ON TABLE public.users TO authenticated; -- 자신의 정보는 수정할 수 있어야 함 (RLS로 제어)
-- (PostLike, PostBookmark, Review 등 다른 사용자 생성 콘텐츠 테이블도 여기에 추가)


-- =================================================================
-- 5. 서버 역할 (service_role) 권한 설정
-- 서버 코드(예: Next.js API 라우트)에서 사용하는 역할로, 모든 데이터에 접근 가능해야 합니다.
-- RLS(Row Level Security) 정책을 우회할 수 있는 강력한 역할입니다.
-- =================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role, postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role, postgres;


-- =================================================================
-- 6. Row Level Security (RLS) 설정 - 보안의 핵심
-- 위에서 부여한 권한을 바탕으로, '어떤 행(row)'에 접근할 수 있는지 세부적으로 제어합니다.
-- =================================================================
-- RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (스크립트를 여러 번 실행해도 안전하도록)
DROP POLICY IF EXISTS "Public posts are viewable by everyone." ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts." ON public.posts;
DROP POLICY IF EXISTS "Users can update or delete their own posts." ON public.posts;
DROP POLICY IF EXISTS "Public comments are viewable by everyone." ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments." ON public.comments;
DROP POLICY IF EXISTS "Users can update or delete their own comments." ON public.comments;

-- 모든 사용자가 모든 댓글을 볼 수 있도록 허용하는 정책 생성
CREATE POLICY "Public comments are viewable by everyone." 
ON public.comments 
FOR SELECT 
USING (true);