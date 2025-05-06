-- DropIndex
DROP INDEX "messages_room_id_idx";

-- CreateIndex
CREATE INDEX "messages_room_id_author_id_idx" ON "messages"("room_id", "author_id");
