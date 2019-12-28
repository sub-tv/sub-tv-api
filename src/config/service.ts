import OS from "opensubtitles-api";
import { seasonExtractor } from "../extractors/season";

class OpenSubtitleService {
  constructor(private token: string, private openSubtitlesInstance: OS) {}

  async searchMoviesOnIMDB(movieName: string) {
    const result = await this.openSubtitlesInstance.api.SearchMoviesOnIMDB(
      this.token,
      movieName
    );

    return result.data || [];
  }

  async getAvailableSeasons(imdbId: string) {
    const result = await seasonExtractor.fetch(imdbId);

    return result || [];
  }

  async identifyKind(imdbId: string) {
    const result = await this.openSubtitlesInstance.api.GetIMDBMovieDetails(
      this.token,
      imdbId
    );

    return result.data.kind;
  }

  async test() {
    const result = await this.openSubtitlesInstance.api.SearchSubtitles(
      this.token,
      [{ sublanguageid: "all", imdbid: "2891574", season: "2" }]
    );

    // const result = await imdb.get({ id: "2891574" }, { apiKey: this.token });

    // console.log(result);

    // return result || [];
    // console.log(result);
    console.log(result);
    return result.data;
  }

  static async create() {
    const OpenSubtitles = new OS({
      useragent: process.env.OPEN_SUB_USER_AGENT,
      username: process.env.OPEN_SUB_USERNAME,
      password: process.env.OPEN_SUB_PASSWORD,
      ssl: true
    });

    const { token } = await OpenSubtitles.login();

    return new OpenSubtitleService(token, OpenSubtitles);
  }
}

const OpenSubtitles = OpenSubtitleService.create();

export { OpenSubtitles };
