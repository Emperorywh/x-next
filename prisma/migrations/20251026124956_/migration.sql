-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_parentId_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "conversationId" TEXT,
ADD COLUMN     "quotesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "replyDepth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "replySettings" TEXT NOT NULL DEFAULT 'everyone',
ADD COLUMN     "replyToUserId" TEXT,
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "posts_replyToUserId_idx" ON "posts"("replyToUserId");

-- CreateIndex
CREATE INDEX "posts_conversationId_idx" ON "posts"("conversationId");

-- CreateIndex
CREATE INDEX "posts_replySettings_idx" ON "posts"("replySettings");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_replyToUserId_fkey" FOREIGN KEY ("replyToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
