const readTime = (post, title, req) => {
  const postLen =
    post
      .replace(/<\/*[a-zA-Z0-9]+>/g, " ")
      .replace(/^\s|\s$/g, "")
      .split(/\s+/).length + title.split(" ").length;

  /**
   * average silent reading adult 238WPM
   * average aloud reading adult 183WPM
   * reading_spead = (words read / time(in seconds))* 60
   * 238wpm = (words/time)
   */
  const reading_time = postLen / 238;
  let minute;
  if (reading_time < 1) {
    return (req.body.reading_time = `${(reading_time * 60).toFixed()} seconds`);
  } else {
    if (postLen % 238 == 0) {
      minute = postLen > 1 ? "minutes" : "minute";
      return (req.body.reading_time = reading_time + minute);
    } else {
      const readTimeInsecs = Number((reading_time * 60).toFixed());
      const seconds = readTimeInsecs % 60;
      const minutes = (readTimeInsecs - (readTimeInsecs % 60)) / 60;
      minute = minutes > 1 ? "minutes" : "minute";
      return (req.body.reading_time = `${minutes} ${minute}, ${seconds} seconds`);
    }
  }
};

module.exports = readTime;
