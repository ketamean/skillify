DO $$
BEGIN
    -- public.MaterialType
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'materialtype' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE "public".MaterialType AS ENUM ('Quiz', 'Document', 'Video');
    END IF;

    -- public.CourseStatus
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coursestatus' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE "public".CourseStatus AS ENUM ('InReview', 'Published', 'Hidden');
    END IF;

    -- private.CouponDiscountType
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupondiscounttype' AND typnamespace = 'private'::regnamespace) THEN
        CREATE TYPE "private".CouponDiscountType AS ENUM ('ValueBased', 'PercentageBased');
    END IF;

    -- private.UserType
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usertype' AND typnamespace = 'private'::regnamespace) THEN
        CREATE TYPE "private".UserType AS ENUM ('Learner', 'Instructor', 'Admin');
    END IF;

    -- private.QuizQuestionType
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quizquestiontype' AND typnamespace = 'private'::regnamespace) THEN
        CREATE TYPE "private".QuizQuestionType AS ENUM ('MultipleChoices', 'ConstructedResponse');
    END IF;

    -- private.UserAccountStatus
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'useraccountstatus' AND typnamespace = 'private'::regnamespace) THEN
        CREATE TYPE "private".UserAccountStatus AS ENUM ('Unconfirmed', 'Confirmed', 'Banned');
    END IF;

END$$;