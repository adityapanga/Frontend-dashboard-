// lib/schema.ts - Example schema for Drizzle ORM
import { pgTable, serial, varchar, decimal, timestamp, boolean, integer } from 'drizzle-orm/pg-core'

export const tblClient = pgTable('tbl_client', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  panNumber: varchar('pan_number', { length: 10 }),
  primaryPersonId: integer('primary_person_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const tblLoan = pgTable('tbl_loan', {
  id: serial('id').primaryKey(),
  loanNumber: varchar('loan_number', { length: 50 }).notNull(),
  clientId: integer('client_id').references(() => tblClient.id),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('active'),
  isActive: boolean('is_active').default(true),
  creationTime: timestamp('creation_time').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const tblPersonMobile = pgTable('tbl_person_mobile', {
  id: serial('id').primaryKey(),
  personId: integer('person_id'),
  mobileId: integer('mobile_id').references(() => tblMobile.id),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const tblMobile = pgTable('tbl_mobile', {
  id: serial('id').primaryKey(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Alternative Prisma Schema (schema.prisma)
/*
model Client {
  id              Int      @id @default(autoincrement())
  name            String
  panNumber       String?  @map("pan_number")
  primaryPersonId Int?     @map("primary_person_id")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  loans           Loan[]
  
  @@map("tbl_client")
}

model Loan {
  id           Int      @id @default(autoincrement())
  loanNumber   String   @map("loan_number")
  clientId     Int      @map("client_id")
  amount       Decimal  @db.Decimal(15, 2)
  startDate    DateTime @map("start_date")
  interestRate Decimal  @db.Decimal(5, 2) @map("interest_rate")
  status       String   @default("active")
  isActive     Boolean  @default(true) @map("is_active")
  creationTime DateTime @default(now()) @map("creation_time")
  updatedAt    DateTime @updatedAt @map("updated_at")
  
  client       Client   @relation(fields: [clientId], references: [id])
  
  @@map("tbl_loan")
}

model PersonMobile {
  id        Int      @id @default(autoincrement())
  personId  Int      @map("person_id")
  mobileId  Int      @map("mobile_id")
  isPrimary Boolean  @default(false) @map("is_primary")
  createdAt DateTime @default(now()) @map("created_at")
  
  mobile    Mobile   @relation(fields: [mobileId], references: [id])
  
  @@map("tbl_person_mobile")
}

model Mobile {
  id          Int      @id @default(autoincrement())
  phoneNumber String   @map("phone_number")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  personMobiles PersonMobile[]
  
  @@map("tbl_mobile")
}
*/