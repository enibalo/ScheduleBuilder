import "./Search.css";

function SearchBar() {
  return (
    <div className="w-full flex m-2 rounded-lg border-2 border-gray-700 *:transition-all *:duration-200">
      <div className="p-2 w-full rounded-l-lg hover:bg-gray-100 active:bg-gray-300 flex">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 mr-2 fill-gray-500"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" /></svg>
        {/*//! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
        <input type="text" placeholder="Search for classes" className="w-full outline-0" />
      </div>
      <button type="button" className="px-4 text-lg border-l-2 flex items-center border-l-gray-700 rounded-r-lg hover:bg-gray-100 active:bg-gray-300">
        Filters
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 ml-2 fill-black"><path d="M488 0H24C2.7 0-8 25.9 7.1 41L192 225.9V432c0 7.8 3.8 15.2 10.2 19.7l80 56C298 518.7 320 507.5 320 488V225.9l184.9-185C520 25.9 509.3 0 488 0z" /></svg>
        {/*//! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
      </button>
    </div>
  )
}

export default SearchBar
