-- public.CourseStatus
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coursestatus' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE "public".CourseStatus AS ENUM ('InReview', 'Published', 'Hidden');
END IF;

-- public.UserAccountStatus
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'useraccountstatus' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE "public".UserAccountStatus AS ENUM ('Unconfirmed', 'Confirmed', 'Banned');
END IF;

-- public.UserType
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usertype' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE "public".UserType AS ENUM ('Learner', 'Instructor', 'PendingInstructor');
END IF;

-- private.MaterialType
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'materialtype' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE "private".MaterialType AS ENUM ('Quiz', 'Document', 'Video');
END IF;

-- private.CouponDiscountType
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupondiscounttype' AND typnamespace = 'private'::regnamespace) THEN
    CREATE TYPE "private".CouponDiscountType AS ENUM ('ValueBased', 'PercentageBased');
END IF;

-- private.CouponStatus
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'couponstatus' AND typnamespace = 'private'::regnamespace) THEN
    CREATE TYPE "private".CouponStatus AS ENUM ('InUse', 'OutOfUse');
END IF;

-- private.CouponType
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupontype' AND typnamespace = 'private'::regnamespace) THEN
    CREATE TYPE "private".CouponType AS ENUM ('ParticularCourse', 'ParticularInstructor', 'Universal');
END IF;

-- private.QuizQuestionType
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quizquestiontype' AND typnamespace = 'private'::regnamespace) THEN
    CREATE TYPE "private".QuizQuestionType AS ENUM ('MultipleChoices', 'ConstructedResponse');
END IF;
