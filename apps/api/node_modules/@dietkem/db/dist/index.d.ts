import * as drizzle_orm_postgres_js from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

declare const userRoleEnum: drizzle_orm_pg_core.PgEnum<["dietitian", "client"]>;
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
        password_hash: drizzle_orm_pg_core.PgColumn<{
            name: "password_hash";
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
        role: drizzle_orm_pg_core.PgColumn<{
            name: "role";
            tableName: "users";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "dietitian" | "client";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["dietitian", "client"];
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
        user_id: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "clients";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
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
        weight_kg: drizzle_orm_pg_core.PgColumn<{
            name: "weight_kg";
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
        goal: drizzle_orm_pg_core.PgColumn<{
            name: "goal";
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
        date: drizzle_orm_pg_core.PgColumn<{
            name: "date";
            tableName: "measurements";
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

declare const schema_clients: typeof clients;
declare const schema_foods: typeof foods;
declare const schema_mealTypeEnum: typeof mealTypeEnum;
declare const schema_meal_plan_days: typeof meal_plan_days;
declare const schema_meal_plans: typeof meal_plans;
declare const schema_meals: typeof meals;
declare const schema_measurements: typeof measurements;
declare const schema_userRoleEnum: typeof userRoleEnum;
declare const schema_users: typeof users;
declare const schema_water_logs: typeof water_logs;
declare const schema_weight_logs: typeof weight_logs;
declare namespace schema {
  export { schema_clients as clients, schema_foods as foods, schema_mealTypeEnum as mealTypeEnum, schema_meal_plan_days as meal_plan_days, schema_meal_plans as meal_plans, schema_meals as meals, schema_measurements as measurements, schema_userRoleEnum as userRoleEnum, schema_users as users, schema_water_logs as water_logs, schema_weight_logs as weight_logs };
}

declare const queryClient: postgres.Sql<{}>;
declare const db: drizzle_orm_postgres_js.PostgresJsDatabase<typeof schema>;

export { clients, db, foods, mealTypeEnum, meal_plan_days, meal_plans, meals, measurements, queryClient, userRoleEnum, users, water_logs, weight_logs };
