
-- ✅ 1. 향수 이름 검색 (가장 높은 우선순위)
CREATE OR REPLACE FUNCTION search_perfume_name(search_text TEXT)
RETURNS TABLE (perfume_id UUID, priority INTEGER)
LANGUAGE sql AS $$
SELECT p.id AS perfume_id, 100 AS priority
FROM perfumes p
WHERE LOWER(COALESCE(p.name_en, '')) ILIKE '%' || LOWER(search_text) || '%'
   OR LOWER(COALESCE(p.name_ko, '')) ILIKE '%' || LOWER(search_text) || '%';
$$;

-- ✅ 2. 브랜드 이름 검색 (브랜드에 포함된 향수)
CREATE OR REPLACE FUNCTION search_brand_name(search_text TEXT)
RETURNS TABLE (perfume_id UUID, priority INTEGER)
LANGUAGE sql AS $$
SELECT p.id AS perfume_id, 80 AS priority
FROM perfumes p
JOIN brands b ON p.brand_id = b.id
WHERE LOWER(COALESCE(b.name_en, '')) ILIKE '%' || LOWER(search_text) || '%'
   OR LOWER(COALESCE(b.name_ko, '')) ILIKE '%' || LOWER(search_text) || '%';
$$;

-- ✅ 3. 노트 검색 (해당 노트가 포함된 향수)
CREATE OR REPLACE FUNCTION search_notes(search_text TEXT)
RETURNS TABLE (perfume_id UUID, priority INTEGER)
LANGUAGE sql AS $$
SELECT pnm.perfume_id, 60 AS priority
FROM perfume_note_mappings pnm
JOIN perfume_notes pn ON pnm.note_id = pn.id
WHERE LOWER(COALESCE(pn.name_en, '')) ILIKE '%' || LOWER(search_text) || '%'
   OR LOWER(COALESCE(pn.name_ko, '')) ILIKE '%' || LOWER(search_text) || '%';
$$;

-- ✅ 4. 어코드 검색 (해당 어코드가 포함된 향수)
CREATE OR REPLACE FUNCTION search_accords(search_text TEXT)
RETURNS TABLE (perfume_id UUID, priority INTEGER)
LANGUAGE sql AS $$
SELECT pam.perfume_id, 50 AS priority
FROM perfume_accord_mappings pam
JOIN perfume_accords pa ON pam.accord_id = pa.id
WHERE LOWER(COALESCE(pa.name_en, '')) ILIKE '%' || LOWER(search_text) || '%'
   OR LOWER(COALESCE(pa.name_ko, '')) ILIKE '%' || LOWER(search_text) || '%';
$$;

-- ✅ 5. 통합 검색 함수 (업데이트된 버전)
CREATE OR REPLACE FUNCTION search_perfumes(
  search_text TEXT DEFAULT NULL,
  brand_filter UUID[] DEFAULT NULL,
  notes_filter UUID[] DEFAULT NULL,     
  accords_filter UUID[] DEFAULT NULL,   
  last_seen_id UUID DEFAULT NULL,
  result_limit INT DEFAULT 15 
)
RETURNS TABLE (
  perfume_id UUID,      
  perfume_name_ko TEXT,   
  perfume_name_en TEXT,   
  brand_id UUID,        
  brand_name_ko TEXT,     
  brand_name_en TEXT,     
  image_url TEXT,
  priority INTEGER
)
LANGUAGE sql AS $$
WITH search_results AS (
    -- 검색어가 없는 경우 모든 향수 반환
    (SELECT p.id AS perfume_id, 0 AS priority  
     FROM perfumes p
     WHERE search_text IS NULL OR search_text = '' OR TRIM(search_text) = '')

    UNION ALL

    -- 검색어가 있는 경우 각 카테고리별 검색
    (SELECT * FROM search_perfume_name(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
    UNION ALL
    (SELECT * FROM search_brand_name(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
    UNION ALL
    (SELECT * FROM search_notes(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
    UNION ALL
    (SELECT * FROM search_accords(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
),
ranked_results AS (
    SELECT perfume_id, MAX(priority) AS priority
    FROM search_results
    GROUP BY perfume_id
),
perfume_data AS (
    SELECT 
        p.id AS perfume_id,       
        p.name_ko AS perfume_name_ko,   
        p.name_en AS perfume_name_en,   
        b.id AS brand_id,         
        b.name_ko AS brand_name_ko,     
        b.name_en AS brand_name_en,     
        pi.image_url AS image_url,
        r.priority
    FROM ranked_results r
    LEFT JOIN perfumes p ON r.perfume_id = p.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN perfumes_image pi ON p.id = pi.perfume_id
    WHERE 
        (brand_filter IS NULL OR cardinality(brand_filter) = 0 OR p.brand_id = ANY(brand_filter))
),
filtered_results AS (
    SELECT pd.*
    FROM perfume_data pd
    WHERE 
        -- 노트 필터링 (모든 지정된 노트를 포함하는 향수만)
        (notes_filter IS NULL OR cardinality(notes_filter) = 0 OR pd.perfume_id IN (
            SELECT pnm.perfume_id
            FROM perfume_note_mappings pnm
            WHERE pnm.note_id = ANY(notes_filter)
            GROUP BY pnm.perfume_id
            HAVING COUNT(DISTINCT pnm.note_id) = cardinality(notes_filter)
        ))
        AND 
        -- 어코드 필터링 (모든 지정된 어코드를 포함하는 향수만)
        (accords_filter IS NULL OR cardinality(accords_filter) = 0 OR pd.perfume_id IN (  
            SELECT pam.perfume_id
            FROM perfume_accord_mappings pam
            WHERE pam.accord_id = ANY(accords_filter)
            GROUP BY pam.perfume_id
            HAVING COUNT(DISTINCT pam.accord_id) = cardinality(accords_filter)
        ))
)
SELECT perfume_id, perfume_name_ko, perfume_name_en, brand_id, brand_name_ko, brand_name_en, image_url, priority 
FROM filtered_results
WHERE (last_seen_id IS NULL OR perfume_id > last_seen_id)
ORDER BY priority DESC, perfume_id ASC
LIMIT result_limit;
$$;

-- ✅ 6. 검색 결과 총 개수 함수 (업데이트된 버전)
CREATE OR REPLACE FUNCTION search_perfumes_total(
  search_text TEXT DEFAULT NULL,
  brand_filter UUID[] DEFAULT NULL,
  notes_filter UUID[] DEFAULT NULL,     
  accords_filter UUID[] DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE sql AS $$
WITH search_results AS (
    -- 검색어가 없는 경우 모든 향수 반환
    (SELECT p.id AS perfume_id, 0 AS priority  
     FROM perfumes p
     WHERE search_text IS NULL OR search_text = '' OR TRIM(search_text) = '')

    UNION ALL

    -- 검색어가 있는 경우 각 카테고리별 검색
    (SELECT * FROM search_perfume_name(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
    UNION ALL
    (SELECT * FROM search_brand_name(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
    UNION ALL
    (SELECT * FROM search_notes(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
    UNION ALL
    (SELECT * FROM search_accords(search_text) WHERE search_text IS NOT NULL AND TRIM(search_text) != '')
),
ranked_results AS (
    SELECT perfume_id, MAX(priority) AS priority
    FROM search_results
    GROUP BY perfume_id
),
perfume_data AS (
    SELECT 
        p.id AS perfume_id,
        b.id AS brand_id
    FROM ranked_results r
    LEFT JOIN perfumes p ON r.perfume_id = p.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE 
        (brand_filter IS NULL OR cardinality(brand_filter) = 0 OR p.brand_id = ANY(brand_filter))
),
filtered_results AS (
    SELECT pd.*
    FROM perfume_data pd
    WHERE 
        (notes_filter IS NULL OR cardinality(notes_filter) = 0 OR pd.perfume_id IN (
            SELECT pnm.perfume_id
            FROM perfume_note_mappings pnm
            WHERE pnm.note_id = ANY(notes_filter)
            GROUP BY pnm.perfume_id
            HAVING COUNT(DISTINCT pnm.note_id) = cardinality(notes_filter)
        ))
        AND 
        (accords_filter IS NULL OR cardinality(accords_filter) = 0 OR pd.perfume_id IN (  
            SELECT pam.perfume_id
            FROM perfume_accord_mappings pam
            WHERE pam.accord_id = ANY(accords_filter)
            GROUP BY pam.perfume_id
            HAVING COUNT(DISTINCT pam.accord_id) = cardinality(accords_filter)
        ))
)
SELECT COUNT(*)::INTEGER FROM filtered_results;
$$;

ALTER TABLE public.perfumes_image ALTER COLUMN id SET DEFAULT uuid_generate_v4();

CREATE OR REPLACE FUNCTION get_perfumes_without_image()
RETURNS TABLE (
  id uuid,
  name_en text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name_en
  FROM
    perfumes AS p
  LEFT JOIN
    perfumes_image AS pi ON p.id = pi.perfume_id
  WHERE
    pi.id IS NULL; -- 연결된 이미지가 없는 향수만 선택
END;
$$ LANGUAGE plpgsql;