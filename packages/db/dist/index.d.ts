import * as drizzle_orm_postgres_js from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

declare const userRoleEnum: drizzle_orm_pg_core.PgEnum<["subscriber_basic", "subscriber_pro", "clinic_admin", "dietitian_team_member", "admin", "superadmin"]>;
declare const mealTypeEnum: drizzle_orm_pg_core.PgEnum<["breakfast", "lunch", "dinner", "snack"]>;
declare const users: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "users";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "users";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        clerk_id: drizzle_orm_pg_core.PgColumn<{
            name: "clerk_id";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        password: drizzle_orm_pg_core.PgColumn<{
            name: "password";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        role: drizzle_orm_pg_core.PgColumn<{
            name: "role";
            tableName: "users";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "subscriber_basic" | "subscriber_pro" | "clinic_admin" | "dietitian_team_member" | "admin" | "superadmin";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: ["subscriber_basic", "subscriber_pro", "clinic_admin", "dietitian_team_member", "admin", "superadmin"];
            baseColumn: never;
        }, {}, {}>;
        created_at: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updated_at: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        first_name: drizzle_orm_pg_core.PgColumn<{
            name: "first_name";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        last_name: drizzle_orm_pg_core.PgColumn<{
            name: "last_name";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        username: drizzle_orm_pg_core.PgColumn<{
            name: "username";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        avatar_url: drizzle_orm_pg_core.PgColumn<{
            name: "avatar_url";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        trial_started_at: drizzle_orm_pg_core.PgColumn<{
            name: "trial_started_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        trial_used: drizzle_orm_pg_core.PgColumn<{
            name: "trial_used";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        first_subscription_started_at: drizzle_orm_pg_core.PgColumn<{
            name: "first_subscription_started_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const emailVerificationCodes: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "email_verification_codes";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "email_verification_codes";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "email_verification_codes";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        code: drizzle_orm_pg_core.PgColumn<{
            name: "code";
            tableName: "email_verification_codes";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        expires_at: drizzle_orm_pg_core.PgColumn<{
            name: "expires_at";
            tableName: "email_verification_codes";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        used: drizzle_orm_pg_core.PgColumn<{
            name: "used";
            tableName: "email_verification_codes";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        created_at: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "email_verification_codes";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const sessions: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "sessions";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "sessions";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        sessionToken: drizzle_orm_pg_core.PgColumn<{
            name: "session_token";
            tableName: "sessions";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "sessions";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        expires: drizzle_orm_pg_core.PgColumn<{
            name: "expires";
            tableName: "sessions";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const accounts: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "accounts";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        provider: drizzle_orm_pg_core.PgColumn<{
            name: "provider";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        providerAccountId: drizzle_orm_pg_core.PgColumn<{
            name: "provider_account_id";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        refresh_token: drizzle_orm_pg_core.PgColumn<{
            name: "refresh_token";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        access_token: drizzle_orm_pg_core.PgColumn<{
            name: "access_token";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        expires_at: drizzle_orm_pg_core.PgColumn<{
            name: "expires_at";
            tableName: "accounts";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        token_type: drizzle_orm_pg_core.PgColumn<{
            name: "token_type";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        scope: drizzle_orm_pg_core.PgColumn<{
            name: "scope";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        id_token: drizzle_orm_pg_core.PgColumn<{
            name: "id_token";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        session_state: drizzle_orm_pg_core.PgColumn<{
            name: "session_state";
            tableName: "accounts";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const verificationTokens: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "verification_tokens";
    schema: undefined;
    columns: {
        identifier: drizzle_orm_pg_core.PgColumn<{
            name: "identifier";
            tableName: "verification_tokens";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        token: drizzle_orm_pg_core.PgColumn<{
            name: "token";
            tableName: "verification_tokens";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        expires: drizzle_orm_pg_core.PgColumn<{
            name: "expires";
            tableName: "verification_tokens";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const clients: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "clients";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "clients";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "clients";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        gender: drizzle_orm_pg_core.PgColumn<{
            name: "gender";
            tableName: "clients";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        birth_date: drizzle_orm_pg_core.PgColumn<{
            name: "birth_date";
            tableName: "clients";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        height_cm: drizzle_orm_pg_core.PgColumn<{
            name: "height_cm";
            tableName: "clients";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "clients";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        phone: drizzle_orm_pg_core.PgColumn<{
            name: "phone";
            tableName: "clients";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        notes: drizzle_orm_pg_core.PgColumn<{
            name: "notes";
            tableName: "clients";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        diseases: drizzle_orm_pg_core.PgColumn<{
            name: "diseases";
            tableName: "clients";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        allergies: drizzle_orm_pg_core.PgColumn<{
            name: "allergies";
            tableName: "clients";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        medications: drizzle_orm_pg_core.PgColumn<{
            name: "medications";
            tableName: "clients";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        has_active_plan: drizzle_orm_pg_core.PgColumn<{
            name: "has_active_plan";
            tableName: "clients";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        status: drizzle_orm_pg_core.PgColumn<{
            name: "status";
            tableName: "clients";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        created_at: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "clients";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        activity_level: drizzle_orm_pg_core.PgColumn<{
            name: "activity_level";
            tableName: "clients";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const measurements: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "measurements";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "measurements";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        client_id: drizzle_orm_pg_core.PgColumn<{
            name: "client_id";
            tableName: "measurements";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        measured_at: drizzle_orm_pg_core.PgColumn<{
            name: "measured_at";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        weight_kg: drizzle_orm_pg_core.PgColumn<{
            name: "weight_kg";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        waist_cm: drizzle_orm_pg_core.PgColumn<{
            name: "waist_cm";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        hip_cm: drizzle_orm_pg_core.PgColumn<{
            name: "hip_cm";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        neck_cm: drizzle_orm_pg_core.PgColumn<{
            name: "neck_cm";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        chest_cm: drizzle_orm_pg_core.PgColumn<{
            name: "chest_cm";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        arm_cm: drizzle_orm_pg_core.PgColumn<{
            name: "arm_cm";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        thigh_cm: drizzle_orm_pg_core.PgColumn<{
            name: "thigh_cm";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        body_fat_percent: drizzle_orm_pg_core.PgColumn<{
            name: "body_fat_percent";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        note: drizzle_orm_pg_core.PgColumn<{
            name: "note";
            tableName: "measurements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        created_at: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "measurements";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const meal_plans: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "meal_plans";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "meal_plans";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        client_id: drizzle_orm_pg_core.PgColumn<{
            name: "client_id";
            tableName: "meal_plans";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        start_date: drizzle_orm_pg_core.PgColumn<{
            name: "start_date";
            tableName: "meal_plans";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        end_date: drizzle_orm_pg_core.PgColumn<{
            name: "end_date";
            tableName: "meal_plans";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        total_calories: drizzle_orm_pg_core.PgColumn<{
            name: "total_calories";
            tableName: "meal_plans";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        notes: drizzle_orm_pg_core.PgColumn<{
            name: "notes";
            tableName: "meal_plans";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        created_by: drizzle_orm_pg_core.PgColumn<{
            name: "created_by";
            tableName: "meal_plans";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const meal_plan_days: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "meal_plan_days";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "meal_plan_days";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        meal_plan_id: drizzle_orm_pg_core.PgColumn<{
            name: "meal_plan_id";
            tableName: "meal_plan_days";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        date: drizzle_orm_pg_core.PgColumn<{
            name: "date";
            tableName: "meal_plan_days";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        notes: drizzle_orm_pg_core.PgColumn<{
            name: "notes";
            tableName: "meal_plan_days";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const meals: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "meals";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "meals";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        meal_plan_day_id: drizzle_orm_pg_core.PgColumn<{
            name: "meal_plan_day_id";
            tableName: "meals";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        meal_type: drizzle_orm_pg_core.PgColumn<{
            name: "meal_type";
            tableName: "meals";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "breakfast" | "lunch" | "dinner" | "snack";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["breakfast", "lunch", "dinner", "snack"];
            baseColumn: never;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "meals";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        calories: drizzle_orm_pg_core.PgColumn<{
            name: "calories";
            tableName: "meals";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        protein_g: drizzle_orm_pg_core.PgColumn<{
            name: "protein_g";
            tableName: "meals";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        carbs_g: drizzle_orm_pg_core.PgColumn<{
            name: "carbs_g";
            tableName: "meals";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        fat_g: drizzle_orm_pg_core.PgColumn<{
            name: "fat_g";
            tableName: "meals";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "meals";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const foods: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "foods";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "foods";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "foods";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "foods";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        calories_per_100g: drizzle_orm_pg_core.PgColumn<{
            name: "calories_per_100g";
            tableName: "foods";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        protein_per_100g: drizzle_orm_pg_core.PgColumn<{
            name: "protein_per_100g";
            tableName: "foods";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        carbs_per_100g: drizzle_orm_pg_core.PgColumn<{
            name: "carbs_per_100g";
            tableName: "foods";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        fat_per_100g: drizzle_orm_pg_core.PgColumn<{
            name: "fat_per_100g";
            tableName: "foods";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        locale: drizzle_orm_pg_core.PgColumn<{
            name: "locale";
            tableName: "foods";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const water_logs: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "water_logs";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "water_logs";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        client_id: drizzle_orm_pg_core.PgColumn<{
            name: "client_id";
            tableName: "water_logs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        date: drizzle_orm_pg_core.PgColumn<{
            name: "date";
            tableName: "water_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        value_liters: drizzle_orm_pg_core.PgColumn<{
            name: "value_liters";
            tableName: "water_logs";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const weight_logs: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "weight_logs";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "weight_logs";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        client_id: drizzle_orm_pg_core.PgColumn<{
            name: "client_id";
            tableName: "weight_logs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        date: drizzle_orm_pg_core.PgColumn<{
            name: "date";
            tableName: "weight_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        weight_kg: drizzle_orm_pg_core.PgColumn<{
            name: "weight_kg";
            tableName: "weight_logs";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const schema_accounts: typeof accounts;
declare const schema_clients: typeof clients;
declare const schema_emailVerificationCodes: typeof emailVerificationCodes;
declare const schema_foods: typeof foods;
declare const schema_mealTypeEnum: typeof mealTypeEnum;
declare const schema_meal_plan_days: typeof meal_plan_days;
declare const schema_meal_plans: typeof meal_plans;
declare const schema_meals: typeof meals;
declare const schema_measurements: typeof measurements;
declare const schema_sessions: typeof sessions;
declare const schema_userRoleEnum: typeof userRoleEnum;
declare const schema_users: typeof users;
declare const schema_verificationTokens: typeof verificationTokens;
declare const schema_water_logs: typeof water_logs;
declare const schema_weight_logs: typeof weight_logs;
declare namespace schema {
  export { schema_accounts as accounts, schema_clients as clients, schema_emailVerificationCodes as emailVerificationCodes, schema_foods as foods, schema_mealTypeEnum as mealTypeEnum, schema_meal_plan_days as meal_plan_days, schema_meal_plans as meal_plans, schema_meals as meals, schema_measurements as measurements, schema_sessions as sessions, schema_userRoleEnum as userRoleEnum, schema_users as users, schema_verificationTokens as verificationTokens, schema_water_logs as water_logs, schema_weight_logs as weight_logs };
}

declare const queryClient: postgres.Sql<{}>;
declare const db: drizzle_orm_postgres_js.PostgresJsDatabase<typeof schema>;

export { accounts, clients, db, emailVerificationCodes, foods, mealTypeEnum, meal_plan_days, meal_plans, meals, measurements, queryClient, sessions, userRoleEnum, users, verificationTokens, water_logs, weight_logs };
