import OS from "opensubtitles-api";

class OpenSubtitleService {
  constructor(private token: string, private openSubtitlesInstance: OS) {}

  search(...args) {
    return this.openSubtitlesInstance.search(...args);
  }

  async searchMoviesOnIMDB(movieName: string) {
    const result = await this.openSubtitlesInstance.api.SearchMoviesOnIMDB(
      this.token,
      movieName
    );

    return result.data || [];
  }

  async searchSubtitle(imdbid, season, episode) {
    const result = await this.openSubtitlesInstance.api.SearchSubtitles(
      this.token,
      [
        {
          imdbid,
          season,
          episode
        }
      ]
    );

    return result.data || [];
  }

  async getMovieDetails(imdbId: string) {
    const result = await this.openSubtitlesInstance.api.GetIMDBMovieDetails(
      this.token,
      imdbId
    );

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
