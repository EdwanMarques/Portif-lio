CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"long_description" text,
	"image" text NOT NULL,
	"demo_url" text,
	"repo_url" text,
	"category" text NOT NULL,
	"technologies" text[] NOT NULL,
	"features" text[],
	"screenshots" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"featured_order" text,
	"meta" jsonb,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
