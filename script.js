// Function to handle all DOM-related events on page load.
document.addEventListener('DOMContentLoaded', function() {
    // --- Navbar & Mobile Menu Logic ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBars = menuButton.querySelectorAll('span');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollTop = 0;

    // Toggles the mobile menu and animates the hamburger icon.
    menuButton.addEventListener('click', () => {
        const isMenuHidden = mobileMenu.classList.contains('opacity-0');
        if (isMenuHidden) {
            mobileMenu.classList.remove('opacity-0', 'max-h-0');
            mobileMenu.classList.add('opacity-100', 'max-h-[calc(100vh-64px)]');

            menuBars[0].style.transform = "rotate(45deg) translate(5px,5px)";
            menuBars[1].style.opacity = "0";
            menuBars[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
        } else {
            mobileMenu.classList.remove('opacity-100', 'max-h-[calc(100vh-64px)]');
            mobileMenu.classList.add('opacity-0', 'max-h-0');

            menuBars[0].style.transform = "rotate(0) translate(0,0)";
            menuBars[1].style.opacity = "1";
            menuBars[2].style.transform = "rotate(0) translate(0,0)";
        }
    });

    // Handles the hide-on-scroll functionality and active link highlighting.
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = "translateY(-100%)";
            navbar.style.opacity = "0";
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.style.opacity = "1";
        }
        lastScrollTop = Math.max(0, scrollTop);

        // Highlight active link
        highlightMenu();
    });

    // Highlights the navigation link corresponding to the current section in view.
    function highlightMenu() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 80; // Offset for navbar height
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Closes the mobile menu when a link is clicked.
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('opacity-100')) {
                mobileMenu.classList.remove('opacity-100', 'max-h-[calc(100vh-64px)]');
                mobileMenu.classList.add('opacity-0', 'max-h-0');
                menuBars.forEach(bar => bar.style.transform = "none");
                menuBars[1].style.opacity = "1";
            }
        });
    });

    // Initialize highlight on page load
    highlightMenu();

    // --- Hero Carousel (Swiper JS) Logic ---
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800
    });

    // --- Portfolio Section (Google Sheets Fetch) Logic ---
    const sheetURL = "https://docs.google.com/spreadsheets/d/1HAZ5AjeVIygJwMQbIjmoqcY421aPqwOu0JlW_shdRI4/gviz/tq?tqx=out:json";

    // Converts GitHub blob URL to raw content URL.
    function toRawGithub(url) {
        return url?.includes("github.com") && url?.includes("/blob/") ? url.replace("/blob/", "/raw/") + "?raw=true" : url;
    }

    // Formats a Google Sheets date cell into a readable string.
    function formatDate(cell) {
        if (!cell || !cell.v) return "";
        if (cell.f) return cell.f;
        if (cell.v instanceof Date) return cell.v.toLocaleDateString("id-ID");
        const match = cell.v?.match(/^Date\((\d+),(\d+),(\d+)\)/);
        if (match) {
            const date = new Date(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
            return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
        }
        return cell.v;
    }

    // Function to render films with consistent button logic
    function renderFilms(films) {
        const filmGrid = document.getElementById("film-grid");
        filmGrid.innerHTML = "";

        if (films.length === 0) {
            filmGrid.innerHTML = `<p class="text-center col-span-full text-gray-400">Tidak ada film yang ditemukan.</p>`;
            return;
        }

        films.forEach(film => {
            const hasTrailer = film.trailer && film.trailer !== "#";
            const hasWatch = film.watch && film.watch !== "#";
            const noLinks = !hasTrailer && !hasWatch; // dua-duanya kosong

            let trailerBtnHTML = "";
            let watchBtnHTML = "";

            if (noLinks) {
                trailerBtnHTML = `<button class="mt-2 px-6 py-2 bg-gray-600 cursor-not-allowed rounded-full font-semibold text-white" disabled>
                                    Watch Trailer
                                  </button>`;
                watchBtnHTML = `<button class="mt-4 px-6 py-2 bg-gray-600 cursor-not-allowed rounded-full font-semibold text-white" disabled>
                                  Coming Soon
                                </button>`;
            } else {
                // tombol trailer
                if (hasTrailer) {
                    trailerBtnHTML = `<a href="${film.trailer}" target="_blank">
                                        <button class="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold text-white">
                                          Watch Trailer
                                        </button>
                                      </a>`;
                } else {
                    trailerBtnHTML = `<button class="mt-2 px-6 py-2 bg-gray-600 cursor-not-allowed rounded-full font-semibold text-white" disabled>
                                        Watch Trailer
                                      </button>`;
                }

                // tombol watch
                if (hasWatch && film.status === "released") {
                    watchBtnHTML = `<a href="${film.watch}" target="_blank">
                                      <button class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-semibold text-white">
                                        Watch Now
                                      </button>
                                    </a>`;
                } else {
                    watchBtnHTML = `<button class="mt-4 px-6 py-2 bg-gray-600 cursor-not-allowed rounded-full font-semibold text-white" disabled>
                                      Coming Soon
                                    </button>`;
                }
            }

            const cardHTML = `
                <div class="relative group overflow-hidden rounded-2xl shadow-lg aspect-[4/5]">
                    <img src="${film.poster}" alt="${film.title}" 
                         class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                         onerror="this.src='https://via.placeholder.com/300x400?text=Poster+Tidak+Tersedia'" />
                    <div class="absolute inset-0 bg-black/70 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-500 text-center px-4">
                        <h3 class="text-2xl font-bold mb-2">${film.title}</h3>
                        <p class="text-sm mb-2">${film.desc}</p>
                        <p class="text-xs text-gray-300">Release Date: ${film.releaseDateStr}</p>
                        ${trailerBtnHTML}
                        ${watchBtnHTML}
                    </div>
                </div>`;
            filmGrid.innerHTML += cardHTML;
        });
    }

    fetch(sheetURL)
        .then(res => res.text())
        .then(data => {
            const json = JSON.parse(data.substr(47).slice(0, -2));
            const rows = json.table.rows;
            const films = rows.map(row => {
                const [titleCell, posterCell, trailerCell, watchCell, statusCell, descCell, releaseDateCell] = row.c;
                const releaseDateObj = releaseDateCell?.v?.match(/^Date\((\d+),(\d+),(\d+)\)/) ? 
                    new Date(parseInt(releaseDateCell.v.match(/\d+/g)[0]), parseInt(releaseDateCell.v.match(/\d+/g)[1]), parseInt(releaseDateCell.v.match(/\d+/g)[2])) : 
                    new Date();

                return {
                    title: titleCell?.v || "",
                    poster: toRawGithub(posterCell?.v),
                    trailer: trailerCell?.v || "#",
                    watch: watchCell?.v || "#",
                    status: (statusCell?.v || "").toLowerCase(),
                    desc: descCell?.v || "",
                    releaseDateStr: formatDate(releaseDateCell),
                    releaseDateObj
                };
            }).sort((a, b) => b.releaseDateObj - a.releaseDateObj);

            // Show only the 3 latest films on the main page
            renderFilms(films.slice(0, 3));
        })
        .catch(err => {
            console.error("Error fetching sheet:", err);
            const filmGrid = document.getElementById("film-grid");
            filmGrid.innerHTML = `<p class="text-center col-span-full text-red-400">Gagal memuat data film. Silakan refresh halaman.</p>`;
        });
});

  // Loading Screen Functionality
  const loadingScreen = document.getElementById('loading-screen');

  function hideLoadingScreen() {
    loadingScreen.classList.add('fade-out');
    // Remove from DOM after animation
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }

  // Show loading screen initially
  document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after page is fully loaded
    window.addEventListener('load', function() {
      // Add a small delay for better UX
      setTimeout(hideLoadingScreen, 1000);
    });

    // Fallback: hide loading screen after 3 seconds max
    setTimeout(hideLoadingScreen, 3000);
  });
