import { app } from "./config/server";
import { OpenSubtitles } from "./config/service";
import { Movie } from "./models/Movie";
import { fetchSeason } from "./services/season";
import { fetchEpisodes } from "./services/episodes";

const routes = async () => {
  const service = await OpenSubtitles;

  app.get("/api/search", async (req, res) => {
    if (!req.query.movieName) res.json([]);

    const result = await service.searchMoviesOnIMDB(req.query.movieName);

    res.json(result);
  });

  app.get("/api/:imdbId/details", async (req, res) => {
    const { imdbId } = req.params;
    const movie = new Movie(imdbId);

    /* 1. pegar detalhes */
    const details = await service.getMovieDetails(movie.id);
    movie.details = details;

    const seasons = await fetchSeason(movie.id);
    movie.seasons = seasons;

    // const episodes = await fetchEpisodes(movie.seasons["1"]);

    res.json(movie.apiResponse);
  });

  app.get("/api/:imdbId/:season/episodes", async (req, res) => {
    const { imdbId, season } = req.params;

    const episodes = await fetchEpisodes(imdbId, season);

    res.json(episodes);
  });

  /* TODO: fix url consistency */
  // app.get("/api/:imdbId/kind", async (req, res) => {
  //   const { imdbId } = req.params;

  //   const kind = await service.identifyKind(imdbId);

  //   res.json({ kind });
  // });

  // app.get("/api/seasons/:imdbId/", async (req, res) => {
  //   const { imdbId } = req.params;

  //   const result = await service.getAvailableSeasons(imdbId);

  //   res.json(result);
  // });

  // app.get("/test", async (req, res) => {
  //   // const { imdbId } = req.params;

  //   const result = await service.test();
  //   console.log(result);

  //   res.json(result);
  // });
};

routes();
