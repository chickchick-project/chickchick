-- CreateTable
CREATE TABLE "post_perfume_mappings" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_perfume_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_perfume_mappings_post_id_perfume_id_key" ON "post_perfume_mappings"("post_id", "perfume_id");

-- AddForeignKey
ALTER TABLE "post_perfume_mappings" ADD CONSTRAINT "post_perfume_mappings_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_perfume_mappings" ADD CONSTRAINT "post_perfume_mappings_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.brands ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.comments ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfume_accord_mappings ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfume_accords ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfume_bookmarks ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfume_note_mappings ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfume_notes ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfumes ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.perfumes_image ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.post_bookmarks ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.post_likes ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.posts ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.reviews ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.user_activities ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.user_collections ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT uuid_generate_v4();