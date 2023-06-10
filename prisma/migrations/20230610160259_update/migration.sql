-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "encrypted_openai_api_key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "activation_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "expires_on" DATETIME NOT NULL,
    CONSTRAINT "activation_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "books_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "chapters_books_id_fkey" FOREIGN KEY ("books_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "books_url_idx" ON "books"("url");
