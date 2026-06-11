import axios from "axios";

const API =
  "https://api.github.com/repos/Zmy71/JesterKomik/contents/JesterKomik";

export async function getMangaList() {
  const { data } = await axios.get(API);

  return data
    .filter((item) => item.type === "dir")
    .map((item) => ({
      name: item.name,
      slug: item.name,
    }));
}

export async function getChapters(manga) {
  const { data } = await axios.get(
    `https://api.github.com/repos/Zmy71/JesterKomik/contents/JesterKomik/${manga}`
  );

  return data
    .filter((item) => item.type === "dir")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export async function getCover(manga) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/Zmy71/JesterKomik/contents/JesterKomik/${manga}`
    );

    const cover = data.find(
      (item) =>
        item.type === "file" &&
        /^cover\.(jpg|jpeg|png|webp)$/i.test(item.name)
    );

    return cover?.download_url || null;
  } catch {
    return null;
  }
}

export async function getPages(manga, chapter) {
  const { data } = await axios.get(
    `https://api.github.com/repos/Zmy71/JesterKomik/contents/JesterKomik/${manga}/${chapter}`
  );

  return data
    .filter(
      (item) =>
        item.type === "file" &&
        /\.(jpg|jpeg|png|webp)$/i.test(item.name)
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
      })
    );
}
