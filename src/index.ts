import { app } from "./config/server";
import { OpenSubtitles } from "./config/service";
import { Movie, Subtitles } from "./models";
import { fetchSeason } from "./services/season";
import { fetchEpisodes } from "./services/episodes";

const routes = async () => {
  const service = await OpenSubtitles;

  app.get("/", async (res) => {
    res.json({ health: "ok" });
  });

  app.get("/api/search", async (req, res) => {
    if (!req.query.movieName) res.json([]);

    req.log.info("something");

    const result = await service.searchMoviesOnIMDB(req.query.movieName);

    res.json(result);
  });

  app.get("/api/:imdbId/details", async (req, res) => {
    const { imdbId } = req.params;
    const movie = new Movie(imdbId);

    const details = await service.getMovieDetails(imdbId);
    movie.details = details;

    const seasons = await fetchSeason(imdbId);
    movie.seasons = seasons;

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
};

routes();
