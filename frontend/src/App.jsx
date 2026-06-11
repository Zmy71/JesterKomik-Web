import { useEffect, useState } from "react";
import {
  getMangaList,
  getChapters,
  getCover,
  getPages,
} from "./services/github";

function App() {
  const [manga, setManga] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [pageCounts, setPageCounts] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const list = await getMangaList();

      const withCover = await Promise.all(
        list.map(async (item) => ({
          ...item,
          cover: await getCover(item.slug),
        }))
      );

      setManga(withCover);
    }

    load();
  }, []);

async function openManga(name) {
  setSelected(name);

  const data = await getChapters(name);

  setChapters(data);

  const counts = {};

  for (const chapter of data) {
    try {
      const pages = await getPages(name, chapter.name);
      counts[chapter.name] = pages.length;
    } catch {
      counts[chapter.name] = 0;
    }
  }

  setPageCounts(counts);
}
  const filtered = manga.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>JesterKomik</h1>

      {!selected && (
        <>
          <input
            type="text"
            placeholder="Cari Manga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(180px,1fr))",
              gap: "20px",
            }}
          >
            {filtered.map((item) => (
              <div
                key={item.slug}
                onClick={() => openManga(item.slug)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #333",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "260px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "260px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Cover
                  </div>
                )}

                <div style={{ padding: "10px" }}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <>
          <button onClick={() => setSelected(null)}>
            ← Kembali
          </button>

          <h2>{selected}</h2>

          <p>
  Total Chapter: {chapters.length}
</p>

{chapters.map((chapter) => (
  <div
    key={chapter.name}
    style={{
      padding: "10px",
      borderBottom: "1px solid #333",
    }}
  >
    {chapter.name}
    {" "}
    (
    {pageCounts[chapter.name] ?? "..."}
    {" "}halaman)
  </div>
))}
        </>
      )}
    </div>
  );
}

export default App;
