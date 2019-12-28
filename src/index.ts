import { app } from "./config/server";
import { OpenSubtitles } from "./config/service";

app.get("/api/search", async (req, res) => {
  const service = await OpenSubtitles;

  const result = await service.searchMoviesOnIMDB(req.query.movieName);

  res.json(result);
});
