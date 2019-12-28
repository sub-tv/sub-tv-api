import { app } from "./config/server";
import { OpenSubtitles } from "./config/service";
import { Movie, Subtitles } from "./models";
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

  app.get("/api/:imdbId/:season/:ep", async (req, res) => {
    const { imdbId, season, ep } = req.params;

    const result = await service.searchSubtitle(imdbId, season, ep);
    const normalizedData = Subtitles.fromApi(result);

    res.json(normalizedData);
  });

  // app.get("/test", async (req, res) => {
  //   const result = await service.searchSubtitle();
  // const data = Subtitles.fromApi(result);

  //   // const byLanguage = groupBy(result, "SubLanguageID");

  //   return res.json(data);
  // });
};

routes();
