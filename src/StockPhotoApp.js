import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
import "./photo.css";
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function StockPhotoApp() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const fetchImages = useCallback(async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos((old) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...old, ...data.results];
        } else {
          return [...old, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [page, query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    return setPage(1);
  };
  useEffect(() => {
    fetchImages();
  }, [page, fetchImages]);
  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      // If condition for infinite scroll
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, [loading]);

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="submit-btn" type="submit" onClick={handleSubmit}>
            {loading ? "Searching..." : <FaSearch />}
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((item, index) => {
            return <Photo key={index} {...item} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default StockPhotoApp;
