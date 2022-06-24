-- CreateTable
CREATE TABLE "Trailer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameTitle" VARCHAR(255) NOT NULL,
    "gameUrl" VARCHAR(255) NOT NULL,
    "releaseDate" DATE NOT NULL,
    "youtubeId" VARCHAR(255) NOT NULL,
    "trailerTitle" VARCHAR(255) NOT NULL,
    "trailerUrl" VARCHAR(255) NOT NULL,
    "trailerPublishedAt" TIMESTAMP(3) NOT NULL,
    "trailerChannelTitle" VARCHAR(255) NOT NULL,

    CONSTRAINT "Trailer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trailerId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "likeCount" INTEGER NOT NULL,
    "commentCount" INTEGER NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("createdAt","trailerId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToTrailer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Trailer_gameTitle_key" ON "Trailer"("gameTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTrailer_AB_unique" ON "_CategoryToTrailer"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTrailer_B_index" ON "_CategoryToTrailer"("B");

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_trailerId_fkey" FOREIGN KEY ("trailerId") REFERENCES "Trailer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTrailer" ADD CONSTRAINT "_CategoryToTrailer_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTrailer" ADD CONSTRAINT "_CategoryToTrailer_B_fkey" FOREIGN KEY ("B") REFERENCES "Trailer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
