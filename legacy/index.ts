import { app } from "./config/server";
import { OpenSubtitles } from "./config/service";

const routes = async () => {
  const service = await OpenSubtitles;

  app.get("/api/search", async (req, res) => {
    if (!req.query.movieName) res.json([]);

    const result = await service.searchMoviesOnIMDB(req.query.movieName);

    res.json(result);
  });

  /* TODO: fix url consistency */
  app.get("/api/:imdbId/kind", async (req, res) => {
    const { imdbId } = req.params;

    const kind = await service.identifyKind(imdbId);

    res.json({ kind });
  });

  app.get("/api/seasons/:imdbId/", async (req, res) => {
    const { imdbId } = req.params;

    const result = await service.getAvailableSeasons(imdbId);

    res.json(result);
  });

  app.get("/test", async (req, res) => {
    // const { imdbId } = req.params;

    const result = await service.test();
    console.log(result);

    res.json(result);
  });
};

routes();
