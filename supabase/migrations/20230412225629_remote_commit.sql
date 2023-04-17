--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: check_starred_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."check_starred_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$-- desn't check for service role key
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM starred WHERE assignment_id = NEW.assignment_id
  ) AND NEW.user_id = auth.uid() THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Cannot insert into starred table';
  END IF;
END;
$$;


ALTER FUNCTION "public"."check_starred_insert"() OWNER TO "postgres";

--
-- Name: create_announcement("text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_announcement"("title" "text", "content" "text", "group_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  new_announcement_uuid uuid;
BEGIN
  IF title IS NULL OR content IS NULL OR author IS NULL OR groupid IS NULL THEN
    RAISE EXCEPTION 'Input parameters cannot be null.';
  END IF;

  IF auth.uid() = ANY (
    SELECT ug.user_id
    FROM users_groups AS ug
    WHERE ug.group_id = create_announcement.group_id
  ) THEN
    EXECUTE 'INSERT INTO announcements(title, content) VALUES ($1, $2) RETURNING id'
    INTO new_announcement_uuid
    USING title, content;

    EXECUTE 'INSERT INTO groups_announcements(group_id, announcement_id) VALUES ($1, $2)'
    USING group_id, new_announcement_uuid;

    RETURN TRUE;
  ELSE
    RAISE EXCEPTION 'User cannot add announcement or I messed up';
    RETURN FALSE;

  END IF;
END$_$;


ALTER FUNCTION "public"."create_announcement"("title" "text", "content" "text", "group_id" "uuid") OWNER TO "postgres";

--
-- Name: create_assignment("text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_assignment"("name" "text", "description" "text", "class_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $_$
DECLARE
  new_assignment_uuid uuid;
BEGIN
  IF name IS NULL OR description IS NULL OR class_id IS NULL THEN
    RAISE EXCEPTION 'Input parameters cannot be null.';
  END IF;
  
  -- Validate that class_id is a valid UUID
  --PERFORM uuid_nil(class_id);
  -- bs function, ty chatgpt

  IF auth.uid() = ANY (
    SELECT uc.user_id
    FROM users_classes AS uc
    WHERE uc.class_id = create_assignment.class_id AND uc.teacher
  ) THEN
    EXECUTE 'INSERT INTO assignments(name, description) VALUES ($1, $2) RETURNING id'
    INTO new_assignment_uuid
    USING name, description;

    EXECUTE 'INSERT INTO classes_assignments(class_id, assignment_id) VALUES ($1, $2)'
    USING class_id, new_assignment_uuid;
    
    RETURN TRUE;
  ELSE
     RAISE EXCEPTION 'User doesnt have access to add assignments to this class';
    RETURN FALSE;
    
  END IF;
END;
$_$;


ALTER FUNCTION "public"."create_assignment"("name" "text", "description" "text", "class_id" "uuid") OWNER TO "postgres";

--
-- Name: create_assignment("text", "text", "text", "json", smallint, "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "class_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $_$
DECLARE
  new_assignment_uuid uuid;
BEGIN
  IF name IS NULL OR description IS NULL OR class_id IS NULL THEN
    RAISE EXCEPTION 'Input parameters cannot be null.';
  END IF;
  
  -- Validate that class_id is a valid UUID
  --PERFORM uuid_nil(class_id);
  -- bs function, ty chatgpt

  IF auth.uid() = ANY (
    SELECT uc.user_id
    FROM users_classes AS uc
    WHERE uc.class_id = create_assignment.class_id AND uc.teacher
  ) THEN
    EXECUTE 'INSERT INTO assignments(name, description) VALUES ($1, $2) RETURNING id'
    INTO new_assignment_uuid
    USING name, description;

    EXECUTE 'INSERT INTO classes_assignments(class_id, assignment_id) VALUES ($1, $2)'
    USING class_id, new_assignment_uuid;
    
    RETURN TRUE;
  ELSE
     RAISE EXCEPTION 'User doesnt have access to add assignments to this class';
    RETURN FALSE;
    
  END IF;
END;
$_$;


ALTER FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "class_id" "uuid") OWNER TO "postgres";

--
-- Name: create_assignment("text", "text", "text", "json", smallint, timestamp with time zone, smallint, timestamp with time zone, "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "due_date" timestamp with time zone, "publish_type" smallint, "publish_date" timestamp with time zone, "class_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $_$
DECLARE
  new_assignment_uuid uuid;
BEGIN
  IF name IS NULL OR description IS NULL OR class_id IS NULL THEN
    RAISE EXCEPTION 'Input parameters cannot be null.';
  END IF;
  
  -- Validate that class_id is a valid UUID
  --PERFORM uuid_nil(class_id);
  -- bs function, ty chatgpt

  IF auth.uid() = ANY (
    SELECT uc.user_id
    FROM users_classes AS uc
    WHERE uc.class_id = create_assignment.class_id AND uc.teacher
  ) THEN
    EXECUTE 'INSERT INTO assignments(name, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id'
    INTO new_assignment_uuid
    USING name, description, submission_type, content, due_type, due_date, publish_type, publish_date;

    EXECUTE 'INSERT INTO classes_assignments(class_id, assignment_id) VALUES ($1, $2)'
    USING class_id, new_assignment_uuid;
    
    RETURN TRUE;
  ELSE
     RAISE EXCEPTION 'User doesnt have access to add assignments to this class';
    RETURN FALSE;
    
  END IF;
END;
$_$;


ALTER FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "due_date" timestamp with time zone, "publish_type" smallint, "publish_date" timestamp with time zone, "class_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."classes" (
    "name" "text" NOT NULL,
    "description" "text" DEFAULT 'Insert a description here'::"text" NOT NULL,
    "block" smallint NOT NULL,
    "schedule_type" smallint DEFAULT '1'::smallint NOT NULL,
    "color" "text" DEFAULT 'blue'::"text" NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_full" "text" DEFAULT 'text'::"text" NOT NULL,
    "room" "text",
    "full_description" "jsonb",
    "classpills" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL,
    "image" "text"
);


ALTER TABLE "public"."classes" OWNER TO "postgres";

--
-- Name: get_profile_classes("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_profile_classes"("id" "uuid") RETURNS SETOF "public"."classes"
    LANGUAGE "sql" SECURITY DEFINER
    AS $_$
  SELECT *
  FROM classes
  WHERE id IN (
    SELECT uc.class_id
    FROM users_classes uc
    JOIN school_users su ON uc.user_id = su.user_id
    WHERE uc.user_id = $1
    AND su.school_id = (
      SELECT school_id
      FROM school_users
      WHERE user_id = auth.uid() -- Replace this with a more secure method of getting the caller's user ID
    )
  );
$_$;


ALTER FUNCTION "public"."get_profile_classes"("id" "uuid") OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'email');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

--
-- Name: prevent_user_id_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."prevent_user_id_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Cannot update user_id column.';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_user_id_update"() OWNER TO "postgres";

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."achievements" (
    "name" "text" NOT NULL,
    "desc_short" "text",
    "desc_full" "text",
    "school" "uuid" NOT NULL,
    "icon" "text",
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."announcements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text",
    "content" "jsonb",
    "time" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'pst'::"text"),
    "author" "uuid" NOT NULL
);


ALTER TABLE "public"."announcements" OWNER TO "postgres";

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."assignments" (
    "name" "text" NOT NULL,
    "submission_type" "text",
    "description" "text" NOT NULL,
    "created_date" timestamp without time zone DEFAULT "now"(),
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "due_type" smallint,
    "due_date" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "publish_type" smallint,
    "publish_date" timestamp with time zone,
    "content" "jsonb",
    "submission_instructions" "text"
);


ALTER TABLE "public"."assignments" OWNER TO "postgres";

--
-- Name: classes_announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."classes_announcements" (
    "class_id" "uuid" NOT NULL,
    "announcement_id" "uuid" NOT NULL
);


ALTER TABLE "public"."classes_announcements" OWNER TO "postgres";

--
-- Name: classes_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."classes_assignments" (
    "class_id" "uuid" NOT NULL,
    "assignment_id" "uuid" NOT NULL
);


ALTER TABLE "public"."classes_assignments" OWNER TO "postgres";

--
-- Name: days_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."days_schedule" (
    "date" "date" NOT NULL,
    "template" bigint,
    "schedule_items" "jsonb"
);


ALTER TABLE "public"."days_schedule" OWNER TO "postgres";

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."groups" (
    "name" "text",
    "description" "text",
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "public" boolean,
    "featured" boolean,
    "tags" "text"[],
    "image" "text"
);


ALTER TABLE "public"."groups" OWNER TO "postgres";

--
-- Name: groups_announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."groups_announcements" (
    "group_id" "uuid" NOT NULL,
    "announcement_id" "uuid" NOT NULL
);


ALTER TABLE "public"."groups_announcements" OWNER TO "postgres";

--
-- Name: schedule_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."schedule_templates" (
    "id" bigint NOT NULL,
    "schedule_items" "jsonb",
    "name" "text"
);


ALTER TABLE "public"."schedule_templates" OWNER TO "postgres";

--
-- Name: schedule_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."schedule_templates" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."schedule_templates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: school_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."school_users" (
    "user_id" "uuid" NOT NULL,
    "school_id" "uuid" NOT NULL
);


ALTER TABLE "public"."school_users" OWNER TO "postgres";

--
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."schools" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "schedule" "json"[],
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);


ALTER TABLE "public"."schools" OWNER TO "postgres";

--
-- Name: starred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."starred" (
    "user_id" "uuid" NOT NULL,
    "assignment_id" "uuid" NOT NULL
);


ALTER TABLE "public"."starred" OWNER TO "postgres";

--
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."test" (
    "id" bigint NOT NULL,
    "name" "text"
);


ALTER TABLE "public"."test" OWNER TO "postgres";

--
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."test" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."test_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."users" (
    "id" "uuid" NOT NULL,
    "created" timestamp with time zone DEFAULT "now"(),
    "username" "text",
    "full_name" "text" NOT NULL,
    "avatar_url" "text" NOT NULL,
    "email" "text",
    "year" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."users" OWNER TO "postgres";

--
-- Name: users_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."users_achievements" (
    "user_id" "uuid" NOT NULL,
    "achivement_id" "uuid" NOT NULL,
    "date_earned" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."users_achievements" OWNER TO "postgres";

--
-- Name: users_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."users_classes" (
    "user_id" "uuid" NOT NULL,
    "teacher" boolean DEFAULT false NOT NULL,
    "class_id" "uuid" NOT NULL,
    "grade" integer DEFAULT 100 NOT NULL
);


ALTER TABLE "public"."users_classes" OWNER TO "postgres";

--
-- Name: users_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."users_groups" (
    "user_id" "uuid" NOT NULL,
    "group_id" "uuid" NOT NULL,
    "group_leader" boolean
);


ALTER TABLE "public"."users_groups" OWNER TO "postgres";

--
-- Name: achievements achievements_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_id_key" UNIQUE ("id");


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");


--
-- Name: assignments assignments_new_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_new_id_key" UNIQUE ("id");


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_pkey" PRIMARY KEY ("id");


--
-- Name: classes_announcements classes_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes_announcements"
    ADD CONSTRAINT "classes_announcements_pkey" PRIMARY KEY ("class_id", "announcement_id");


--
-- Name: classes_assignments classes_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes_assignments"
    ADD CONSTRAINT "classes_assignments_pkey" PRIMARY KEY ("class_id", "assignment_id");


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");


--
-- Name: days_schedule days_schedule_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."days_schedule"
    ADD CONSTRAINT "days_schedule_date_key" UNIQUE ("date");


--
-- Name: days_schedule days_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."days_schedule"
    ADD CONSTRAINT "days_schedule_pkey" PRIMARY KEY ("date");


--
-- Name: groups_announcements groups_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."groups_announcements"
    ADD CONSTRAINT "groups_announcements_pkey" PRIMARY KEY ("group_id", "announcement_id");


--
-- Name: groups groups_duplicate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_duplicate_pkey" PRIMARY KEY ("id");


--
-- Name: schedule_templates schedule_templates_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schedule_templates"
    ADD CONSTRAINT "schedule_templates_id_key" UNIQUE ("id");


--
-- Name: schedule_templates schedule_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schedule_templates"
    ADD CONSTRAINT "schedule_templates_pkey" PRIMARY KEY ("id");


--
-- Name: school_users school_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."school_users"
    ADD CONSTRAINT "school_users_pkey" PRIMARY KEY ("school_id", "user_id");


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id");


--
-- Name: starred starred_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."starred"
    ADD CONSTRAINT "starred_pkey" PRIMARY KEY ("user_id", "assignment_id");


--
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."test"
    ADD CONSTRAINT "test_pkey" PRIMARY KEY ("id");


--
-- Name: users_achievements users_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_achievements"
    ADD CONSTRAINT "users_achievements_pkey" PRIMARY KEY ("achivement_id", "user_id");


--
-- Name: users_classes users_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_classes"
    ADD CONSTRAINT "users_classes_pkey" PRIMARY KEY ("class_id", "user_id");


--
-- Name: users_groups users_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_groups"
    ADD CONSTRAINT "users_groups_pkey" PRIMARY KEY ("user_id", "group_id");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");


--
-- Name: starred prevent_user_id_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "prevent_user_id_update" BEFORE UPDATE ON "public"."starred" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_user_id_update"();


--
-- Name: starred starred_insert_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "starred_insert_trigger" BEFORE INSERT ON "public"."starred" FOR EACH ROW EXECUTE FUNCTION "public"."check_starred_insert"();


--
-- Name: achievements achievements_school_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_school_fkey" FOREIGN KEY ("school") REFERENCES "public"."schools"("id");


--
-- Name: announcements announcements_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."users"("id");


--
-- Name: classes_announcements classes_announcements_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes_announcements"
    ADD CONSTRAINT "classes_announcements_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id");


--
-- Name: classes_announcements classes_announcements_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes_announcements"
    ADD CONSTRAINT "classes_announcements_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");


--
-- Name: classes_assignments classes_assignments_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes_assignments"
    ADD CONSTRAINT "classes_assignments_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id");


--
-- Name: classes_assignments classes_assignments_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."classes_assignments"
    ADD CONSTRAINT "classes_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");


--
-- Name: days_schedule days_schedule_template_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."days_schedule"
    ADD CONSTRAINT "days_schedule_template_fkey" FOREIGN KEY ("template") REFERENCES "public"."schedule_templates"("id");


--
-- Name: groups_announcements groups_announcements_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."groups_announcements"
    ADD CONSTRAINT "groups_announcements_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id");


--
-- Name: groups_announcements groups_announcements_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."groups_announcements"
    ADD CONSTRAINT "groups_announcements_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");


--
-- Name: school_users school_users_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."school_users"
    ADD CONSTRAINT "school_users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id");


--
-- Name: school_users school_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."school_users"
    ADD CONSTRAINT "school_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- Name: starred starred_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."starred"
    ADD CONSTRAINT "starred_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id");


--
-- Name: starred starred_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."starred"
    ADD CONSTRAINT "starred_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- Name: users_achievements users_achievements_achivement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_achievements"
    ADD CONSTRAINT "users_achievements_achivement_id_fkey" FOREIGN KEY ("achivement_id") REFERENCES "public"."achievements"("id");


--
-- Name: users_achievements users_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_achievements"
    ADD CONSTRAINT "users_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- Name: users_classes users_classes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_classes"
    ADD CONSTRAINT "users_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");


--
-- Name: users_classes users_classes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_classes"
    ADD CONSTRAINT "users_classes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- Name: users_groups users_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_groups"
    ADD CONSTRAINT "users_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");


--
-- Name: users_groups users_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users_groups"
    ADD CONSTRAINT "users_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");


--
-- Name: groups_announcements Anyone can look at this merge table (change later) ; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can look at this merge table (change later) " ON "public"."groups_announcements" FOR SELECT USING (true);


--
-- Name: classes_assignments Anyone can view foreign key relationships; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view foreign key relationships" ON "public"."classes_assignments" FOR SELECT TO "authenticated" USING (true);


--
-- Name: school_users Anyone can view foreign key relationships; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view foreign key relationships" ON "public"."school_users" FOR SELECT TO "authenticated" USING (true);


--
-- Name: users_achievements Anyone can view foreign key relationships; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view foreign key relationships" ON "public"."users_achievements" FOR SELECT TO "authenticated" USING (true);


--
-- Name: users_classes Anyone can view foreign key relationships; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view foreign key relationships" ON "public"."users_classes" FOR SELECT TO "authenticated" USING (true);


--
-- Name: users_groups Anyone can view foreign key relationships; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view foreign key relationships" ON "public"."users_groups" FOR SELECT USING (true);


--
-- Name: users_groups CHANGE THIS LATER PLEASE IT LETS ANYONE JOIN ANY GROUP; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CHANGE THIS LATER PLEASE IT LETS ANYONE JOIN ANY GROUP" ON "public"."users_groups" FOR INSERT TO "authenticated" WITH CHECK (true);


--
-- Name: classes Students & Teachers can view their own classes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Students & Teachers can view their own classes" ON "public"."classes" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "uc"."user_id"
   FROM "public"."users_classes" "uc"
  WHERE ("uc"."class_id" = "classes"."id"))));


--
-- Name: achievements Students + Faculty can view their peers achievements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Students + Faculty can view their peers achievements" ON "public"."achievements" FOR SELECT TO "authenticated" USING (("school" IN ( SELECT "su"."school_id"
   FROM "public"."school_users" "su"
  WHERE ("su"."user_id" = "auth"."uid"()))));


--
-- Name: users Students can view the profiles of their peers and teachers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Students can view the profiles of their peers and teachers" ON "public"."users" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "su"."user_id"
   FROM "public"."school_users" "su"
  WHERE (("su"."school_id" = ( SELECT "sutwo"."school_id"
           FROM "public"."school_users" "sutwo"
          WHERE ("auth"."uid"() = "sutwo"."user_id"))) OR ("su"."user_id" = "auth"."uid"())))));


--
-- Name: assignments Students in a given class can view their assignments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Students in a given class can view their assignments" ON "public"."assignments" FOR SELECT TO "authenticated" USING ((( SELECT "ca"."class_id"
   FROM "public"."classes_assignments" "ca"
  WHERE ("ca"."assignment_id" = "assignments"."id")) IN ( SELECT "classes"."id"
   FROM "public"."classes")));


--
-- Name: classes Teachers can update classes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Teachers can update classes" ON "public"."classes" FOR UPDATE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "uc"."user_id"
   FROM "public"."users_classes" "uc"
  WHERE (("uc"."class_id" = "classes"."id") AND ("uc"."teacher" = true))))) WITH CHECK (("auth"."uid"() IN ( SELECT "uc"."user_id"
   FROM "public"."users_classes" "uc"
  WHERE (("uc"."class_id" = "classes"."id") AND ("uc"."teacher" = true)))));


--
-- Name: starred Users can delete their own starred things; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own starred things" ON "public"."starred" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));


--
-- Name: starred Users can insert new starred rows; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert new starred rows" ON "public"."starred" FOR INSERT TO "authenticated" WITH CHECK (true);


--
-- Name: users Users can insert their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile." ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: starred Users can only see their own starred assignments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can only see their own starred assignments" ON "public"."starred" FOR SELECT USING (("auth"."uid"() = "user_id"));


--
-- Name: users Users can update own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile." ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));


--
-- Name: starred Users can update their own starred items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own starred items" ON "public"."starred" FOR UPDATE WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: schools Users can view their own schools; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own schools" ON "public"."schools" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "su"."user_id"
   FROM "public"."school_users" "su"
  WHERE ("su"."school_id" = "schools"."id"))));


--
-- Name: achievements; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;

--
-- Name: classes_announcements anyone can view merge table ; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "anyone can view merge table " ON "public"."classes_announcements" FOR SELECT TO "authenticated" USING (true);


--
-- Name: assignments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."assignments" ENABLE ROW LEVEL SECURITY;

--
-- Name: classes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."classes" ENABLE ROW LEVEL SECURITY;

--
-- Name: classes_assignments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."classes_assignments" ENABLE ROW LEVEL SECURITY;

--
-- Name: groups group members and leaders can see their own groups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "group members and leaders can see their own groups" ON "public"."groups" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "ug"."user_id"
   FROM "public"."users_groups" "ug"
  WHERE ("ug"."group_id" = "groups"."id"))));


--
-- Name: school_users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."school_users" ENABLE ROW LEVEL SECURITY;

--
-- Name: schools; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."schools" ENABLE ROW LEVEL SECURITY;

--
-- Name: starred; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."starred" ENABLE ROW LEVEL SECURITY;

--
-- Name: test; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."test" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: users_achievements; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."users_achievements" ENABLE ROW LEVEL SECURITY;

--
-- Name: users_classes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."users_classes" ENABLE ROW LEVEL SECURITY;

--
-- Name: users_groups; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."users_groups" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "net"; Type: ACL; Schema: -; Owner: supabase_admin
--

-- GRANT USAGE ON SCHEMA "net" TO "supabase_functions_admin";
-- GRANT USAGE ON SCHEMA "net" TO "anon";
-- GRANT USAGE ON SCHEMA "net" TO "authenticated";
-- GRANT USAGE ON SCHEMA "net" TO "service_role";


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."armor"("bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."crypt"("text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."dearmor"("text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."digest"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."digest"("text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_random_uuid"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text", integer) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."url_decode"("data" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v4"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_nil"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_dns"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_oid"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_url"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_x500"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "comment_directive"("comment_" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "service_role";


--
-- Name: FUNCTION "exception"("message" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "service_role";


--
-- Name: FUNCTION "get_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "service_role";


--
-- Name: FUNCTION "increment_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "service_role";


--
-- Name: FUNCTION "graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb"); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";


--
-- Name: FUNCTION "http_collect_response"("request_id" bigint, "async" boolean); Type: ACL; Schema: net; Owner: supabase_admin
--

-- REVOKE ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) FROM PUBLIC;
-- GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "supabase_functions_admin";
-- GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "postgres";
-- GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "anon";
-- GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "authenticated";
-- GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "service_role";


--
-- Name: FUNCTION "http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer); Type: ACL; Schema: net; Owner: supabase_admin
--

-- REVOKE ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) FROM PUBLIC;
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "supabase_functions_admin";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "postgres";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "anon";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "authenticated";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "service_role";


--
-- Name: FUNCTION "http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer); Type: ACL; Schema: net; Owner: supabase_admin
--

-- REVOKE ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) FROM PUBLIC;
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "supabase_functions_admin";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "postgres";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "anon";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "authenticated";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "service_role";


--
-- Name: SEQUENCE "key_key_id_seq"; Type: ACL; Schema: pgsodium; Owner: postgres
--

-- GRANT ALL ON SEQUENCE "pgsodium"."key_key_id_seq" TO "pgsodium_keyiduser";


--
-- Name: FUNCTION "check_starred_insert"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."check_starred_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_starred_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_starred_insert"() TO "service_role";


--
-- Name: FUNCTION "create_announcement"("title" "text", "content" "text", "group_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_announcement"("title" "text", "content" "text", "group_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_announcement"("title" "text", "content" "text", "group_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_announcement"("title" "text", "content" "text", "group_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "create_assignment"("name" "text", "description" "text", "class_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "class_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "class_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "class_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "class_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "class_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "class_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "class_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "due_date" timestamp with time zone, "publish_type" smallint, "publish_date" timestamp with time zone, "class_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "due_date" timestamp with time zone, "publish_type" smallint, "publish_date" timestamp with time zone, "class_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "due_date" timestamp with time zone, "publish_type" smallint, "publish_date" timestamp with time zone, "class_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_assignment"("name" "text", "description" "text", "submission_type" "text", "content" "json", "due_type" smallint, "due_date" timestamp with time zone, "publish_type" smallint, "publish_date" timestamp with time zone, "class_id" "uuid") TO "service_role";


--
-- Name: TABLE "classes"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";


--
-- Name: FUNCTION "get_profile_classes"("id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_profile_classes"("id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profile_classes"("id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profile_classes"("id" "uuid") TO "service_role";


--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


--
-- Name: FUNCTION "prevent_user_id_update"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."prevent_user_id_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_user_id_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_user_id_update"() TO "service_role";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON TABLE "extensions"."pg_stat_statements" FROM "postgres";
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON TABLE "extensions"."pg_stat_statements_info" FROM "postgres";
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: SEQUENCE "seq_schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";


--
-- Name: TABLE "valid_key"; Type: ACL; Schema: pgsodium; Owner: postgres
--

-- GRANT ALL ON TABLE "pgsodium"."valid_key" TO "pgsodium_keyiduser";


--
-- Name: TABLE "achievements"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";


--
-- Name: TABLE "announcements"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."announcements" TO "anon";
GRANT ALL ON TABLE "public"."announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."announcements" TO "service_role";


--
-- Name: TABLE "assignments"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."assignments" TO "anon";
GRANT ALL ON TABLE "public"."assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."assignments" TO "service_role";


--
-- Name: TABLE "classes_announcements"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."classes_announcements" TO "anon";
GRANT ALL ON TABLE "public"."classes_announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."classes_announcements" TO "service_role";


--
-- Name: TABLE "classes_assignments"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."classes_assignments" TO "anon";
GRANT ALL ON TABLE "public"."classes_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."classes_assignments" TO "service_role";


--
-- Name: TABLE "days_schedule"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."days_schedule" TO "anon";
GRANT ALL ON TABLE "public"."days_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."days_schedule" TO "service_role";


--
-- Name: TABLE "groups"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";


--
-- Name: TABLE "groups_announcements"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."groups_announcements" TO "anon";
GRANT ALL ON TABLE "public"."groups_announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."groups_announcements" TO "service_role";


--
-- Name: TABLE "schedule_templates"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."schedule_templates" TO "anon";
GRANT ALL ON TABLE "public"."schedule_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_templates" TO "service_role";


--
-- Name: SEQUENCE "schedule_templates_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."schedule_templates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_templates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_templates_id_seq" TO "service_role";


--
-- Name: TABLE "school_users"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."school_users" TO "anon";
GRANT ALL ON TABLE "public"."school_users" TO "authenticated";
GRANT ALL ON TABLE "public"."school_users" TO "service_role";


--
-- Name: TABLE "schools"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."schools" TO "anon";
GRANT ALL ON TABLE "public"."schools" TO "authenticated";
GRANT ALL ON TABLE "public"."schools" TO "service_role";


--
-- Name: TABLE "starred"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."starred" TO "anon";
GRANT ALL ON TABLE "public"."starred" TO "authenticated";
GRANT ALL ON TABLE "public"."starred" TO "service_role";


--
-- Name: TABLE "test"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."test" TO "anon";
GRANT ALL ON TABLE "public"."test" TO "authenticated";
GRANT ALL ON TABLE "public"."test" TO "service_role";


--
-- Name: SEQUENCE "test_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."test_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."test_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."test_id_seq" TO "service_role";


--
-- Name: TABLE "users"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";


--
-- Name: TABLE "users_achievements"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."users_achievements" TO "anon";
GRANT ALL ON TABLE "public"."users_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."users_achievements" TO "service_role";


--
-- Name: TABLE "users_classes"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."users_classes" TO "anon";
GRANT ALL ON TABLE "public"."users_classes" TO "authenticated";
GRANT ALL ON TABLE "public"."users_classes" TO "service_role";


--
-- Name: TABLE "users_groups"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."users_groups" TO "anon";
GRANT ALL ON TABLE "public"."users_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."users_groups" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
