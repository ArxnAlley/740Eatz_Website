/* ============================================================
   740EATZ — SHARED SITE JAVASCRIPT
   siteJS.js

   Scope (all inner pages):
   - Header scroll state
   - Burger menu toggle
   - Menu dropdown (desktop + mobile)
   - Gallery lightbox & filter
   - FAQ accordion
   - Contact form submission
   - Review funnel star rating
   - Copyright year (dynamic)
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

const CONTACT_ENDPOINT  = "https://YOUR_ENDPOINT_HERE/contact";

const FEEDBACK_ENDPOINT = "https://YOUR_ENDPOINT_HERE/feedback";


/* ============================================================
   COPYRIGHT YEAR — DYNAMIC
============================================================ */

const copyrightYearEl = document.getElementById("copyrightYear");

if ( copyrightYearEl )
{

    copyrightYearEl.textContent = new Date().getFullYear();

}


/* ============================================================
   DOM REFERENCES
============================================================ */

const siteHeader       = document.getElementById("siteHeader");

const burgerBtn        = document.getElementById("burgerBtn");

const siteNav          = document.getElementById("siteNav");

const menuDropdownBtn  = document.getElementById("menuDropdownBtn");

const menuDropdownItem = document.getElementById("menuDropdownItem");


/* ============================================================
   HEADER — SCROLL STATE
============================================================ */

function onScroll ()
{

    if ( !siteHeader ) { return; }

    if ( window.scrollY > 20 )
    {

        siteHeader.classList.add("scrolled");

    }
    else
    {

        siteHeader.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", onScroll, { passive: true });

onScroll();


/* ============================================================
   BURGER MENU — TOGGLE
============================================================ */

function openNav ()
{

    if ( !siteHeader || !burgerBtn ) { return; }

    siteHeader.classList.add("navOpen");

    burgerBtn.setAttribute("aria-expanded", "true");

    burgerBtn.setAttribute("aria-label", "Close navigation menu");

    document.body.style.overflow = "hidden";

}

function closeNav ()
{

    if ( !siteHeader || !burgerBtn ) { return; }

    siteHeader.classList.remove("navOpen");

    burgerBtn.setAttribute("aria-expanded", "false");

    burgerBtn.setAttribute("aria-label", "Open navigation menu");

    document.body.style.overflow = "";

}

if ( burgerBtn )
{

    burgerBtn.addEventListener("click", function ()
    {

        const isOpen = siteHeader.classList.contains("navOpen");

        if ( isOpen )
        {
            closeNav();
        }
        else
        {
            openNav();
        }

    });

}

document.querySelectorAll(".navLink:not(.navLinkHasDropdown)").forEach(function ( link )
{

    link.addEventListener("click", function ()
    {

        closeNav();

    });

});

if ( siteNav )
{

    siteNav.addEventListener("click", function ( event )
    {

        if ( event.target === siteNav )
        {

            closeNav();

        }

    });

}

document.addEventListener("keydown", function ( event )
{

    if ( event.key === "Escape" )
    {

        closeNav();

        closeMenuDropdown();

    }

});


/* ============================================================
   MENU DROPDOWN
============================================================ */

function openMenuDropdown ()
{

    if ( !menuDropdownItem || !menuDropdownBtn ) { return; }

    menuDropdownItem.classList.add("dropdownOpen");

    menuDropdownBtn.setAttribute("aria-expanded", "true");

}

function closeMenuDropdown ()
{

    if ( !menuDropdownItem || !menuDropdownBtn ) { return; }

    menuDropdownItem.classList.remove("dropdownOpen");

    menuDropdownBtn.setAttribute("aria-expanded", "false");

}

function toggleMenuDropdown ()
{

    if ( !menuDropdownItem ) { return; }

    const isOpen = menuDropdownItem.classList.contains("dropdownOpen");

    if ( isOpen )
    {
        closeMenuDropdown();
    }
    else
    {
        openMenuDropdown();
    }

}

if ( menuDropdownBtn )
{

    menuDropdownBtn.addEventListener("click", function ( event )
    {

        event.stopPropagation();

        toggleMenuDropdown();

    });

}

document.addEventListener("click", function ( event )
{

    if ( !menuDropdownItem ) { return; }

    if ( !menuDropdownItem.contains(event.target) )
    {

        closeMenuDropdown();

    }

});

document.querySelectorAll(".navSubLink").forEach(function ( link )
{

    link.addEventListener("click", function ()
    {

        closeMenuDropdown();

        closeNav();

    });

});


/* ============================================================
   HELPERS — FORM UTILITIES
============================================================ */

function getVal ( id )
{

    const el = document.getElementById(id);

    return el ? el.value.trim() : "";

}

function showFeedback ( el, type, message )
{

    if ( !el ) { return; }

    el.className = "formFeedback";

    el.classList.add( type === "success" ? "feedbackSuccess" : "feedbackError" );

    el.textContent = message;

    el.scrollIntoView({ behavior: "smooth", block: "nearest" });

}

function clearFeedback ( el )
{

    if ( !el ) { return; }

    el.className = "formFeedback";

    el.textContent = "";

}


/* ============================================================
   GALLERY — LIGHTBOX
============================================================ */

const lightbox    = document.getElementById("galleryLightbox");

const lightboxImg = document.getElementById("lightboxImg");

const lightboxClose = document.getElementById("lightboxClose");

const lightboxPrev  = document.getElementById("lightboxPrev");

const lightboxNext  = document.getElementById("lightboxNext");

let galleryItems    = [];

let lightboxIndex   = 0;

function buildGalleryItems ()
{

    galleryItems = Array.from(

        document.querySelectorAll(".galleryMasonryItem:not(.galleryHidden) .galleryMasonryImg")

    );

}

function openLightbox ( index )
{

    buildGalleryItems();

    if ( !lightbox || galleryItems.length === 0 ) { return; }

    lightboxIndex = index;

    const img = galleryItems[ lightboxIndex ];

    lightboxImg.src = img.src;

    lightboxImg.alt = img.alt;

    lightbox.classList.add("lightboxOpen");

    document.body.style.overflow = "hidden";

}

function closeLightbox ()
{

    if ( !lightbox ) { return; }

    lightbox.classList.remove("lightboxOpen");

    document.body.style.overflow = "";

    lightboxImg.src = "";

}

function lightboxNavigate ( direction )
{

    lightboxIndex = ( lightboxIndex + direction + galleryItems.length ) % galleryItems.length;

    const img = galleryItems[ lightboxIndex ];

    lightboxImg.src = img.src;

    lightboxImg.alt = img.alt;

}

if ( lightbox )
{

    document.querySelectorAll(".galleryMasonryItem").forEach(function ( item, index )
    {

        item.addEventListener("click", function ()
        {

            buildGalleryItems();

            const visibleItems = Array.from(

                document.querySelectorAll(".galleryMasonryItem:not(.galleryHidden) .galleryMasonryImg")

            );

            const clickedImg = item.querySelector(".galleryMasonryImg");

            const visibleIndex = visibleItems.indexOf( clickedImg );

            if ( visibleIndex !== -1 )
            {

                openLightbox( visibleIndex );

            }

        });

    });

    if ( lightboxClose )
    {

        lightboxClose.addEventListener("click", closeLightbox);

    }

    if ( lightboxPrev )
    {

        lightboxPrev.addEventListener("click", function () { lightboxNavigate(-1); });

    }

    if ( lightboxNext )
    {

        lightboxNext.addEventListener("click", function () { lightboxNavigate(1); });

    }

    lightbox.addEventListener("click", function ( event )
    {

        if ( event.target === lightbox )
        {

            closeLightbox();

        }

    });

    document.addEventListener("keydown", function ( event )
    {

        if ( !lightbox.classList.contains("lightboxOpen") ) { return; }

        if ( event.key === "ArrowLeft" )  { lightboxNavigate(-1); }

        if ( event.key === "ArrowRight" ) { lightboxNavigate(1); }

        if ( event.key === "Escape" )     { closeLightbox(); }

    });

}


/* ============================================================
   GALLERY — FILTER
============================================================ */

const filterBtns = document.querySelectorAll(".galleryFilterBtn");

if ( filterBtns.length > 0 )
{

    filterBtns.forEach(function ( btn )
    {

        btn.addEventListener("click", function ()
        {

            filterBtns.forEach(function ( b ) { b.classList.remove("filterActive"); });

            btn.classList.add("filterActive");

            const filter = btn.getAttribute("data-filter");

            document.querySelectorAll(".galleryMasonryItem").forEach(function ( item )
            {

                const category = item.getAttribute("data-category");

                if ( filter === "all" || category === filter )
                {

                    item.classList.remove("galleryHidden");

                }
                else
                {

                    item.classList.add("galleryHidden");

                }

            });

        });

    });

}


/* ============================================================
   FAQ — ACCORDION
============================================================ */

const faqItems = document.querySelectorAll(".faqItem");

if ( faqItems.length > 0 )
{

    faqItems.forEach(function ( item )
    {

        const question = item.querySelector(".faqQuestion");

        if ( !question ) { return; }

        question.addEventListener("click", function ()
        {

            const isOpen = item.classList.contains("faqOpen");

            /* Close all items */

            faqItems.forEach(function ( i ) { i.classList.remove("faqOpen"); });

            document.querySelectorAll(".faqQuestion").forEach(function ( q )
            {

                q.setAttribute("aria-expanded", "false");

            });

            /* Open clicked item (unless it was already open) */

            if ( !isOpen )
            {

                item.classList.add("faqOpen");

                question.setAttribute("aria-expanded", "true");

            }

        });

    });

}


/* ============================================================
   CONTACT FORM — SUBMISSION
============================================================ */

const contactForm       = document.getElementById("contactForm");

const contactFeedback   = document.getElementById("contactFeedback");

const contactSubmitBtn  = document.getElementById("contactSubmitBtn");

if ( contactForm )
{

    contactForm.addEventListener("submit", async function ( event )
    {

        event.preventDefault();

        clearFeedback( contactFeedback );

        const firstName = getVal("contactFirstName");

        const message   = getVal("contactMessage");

        if ( !firstName || !message )
        {

            showFeedback( contactFeedback, "error", "Please fill in your name and message." );

            return;

        }

        if ( contactSubmitBtn )
        {

            contactSubmitBtn.disabled    = true;

            contactSubmitBtn.textContent = "Sending…";

        }

        const payload =
        {

            action:      "contactInquiry",

            source:      "740Eatz Website V2",

            firstName:   firstName,

            lastName:    getVal("contactLastName"),

            phone:       getVal("contactPhone"),

            email:       getVal("contactEmail"),

            subject:     getVal("contactSubject"),

            message:     message,

            submittedAt: new Date().toISOString()

        };

        try
        {

            const response = await fetch( CONTACT_ENDPOINT,
            {

                method:  "POST",

                headers: { "Content-Type": "application/json" },

                body:    JSON.stringify( payload )

            });

            if ( response.ok )
            {

                showFeedback(
                    contactFeedback,
                    "success",
                    "Message sent! 740Eatz will get back to you as soon as possible."
                );

                contactForm.reset();

                if ( contactSubmitBtn )
                {
                    contactSubmitBtn.textContent = "Message Sent!";
                }

            }
            else
            {

                throw new Error("Server error");

            }

        }
        catch ( err )
        {

            showFeedback(
                contactFeedback,
                "error",
                "Something went wrong. Please try calling (220) 240-8435 or messaging on Facebook."
            );

            if ( contactSubmitBtn )
            {

                contactSubmitBtn.disabled    = false;

                contactSubmitBtn.textContent = "Send Message";

            }

        }

    });

}


/* ============================================================
   REVIEW FUNNEL — STAR RATING
============================================================ */

const starBtns      = document.querySelectorAll(".starBtn");

const step1         = document.getElementById("funnelStep1");

const step2Positive = document.getElementById("funnelStep2Positive");

const step2Negative = document.getElementById("funnelStep2Negative");

const step3         = document.getElementById("funnelStep3");

let selectedRating  = 0;

function highlightStars ( count )
{

    starBtns.forEach(function ( btn, idx )
    {

        if ( idx < count )
        {
            btn.classList.add("starFilled");
        }
        else
        {
            btn.classList.remove("starFilled");
        }

    });

}

if ( starBtns.length > 0 )
{

    starBtns.forEach(function ( btn )
    {

        btn.addEventListener("mouseenter", function ()
        {

            highlightStars( parseInt( btn.getAttribute("data-value"), 10 ) );

        });

        btn.addEventListener("mouseleave", function ()
        {

            highlightStars( selectedRating );

        });

        btn.addEventListener("click", function ()
        {

            selectedRating = parseInt( btn.getAttribute("data-value"), 10 );

            highlightStars( selectedRating );

            /* Short delay before transitioning */

            setTimeout(function ()
            {

                if ( step1 ) { step1.classList.add("funnelStepHidden"); }

                if ( selectedRating >= 4 )
                {

                    if ( step2Positive ) { step2Positive.classList.remove("funnelStepHidden"); }

                }
                else
                {

                    if ( step2Negative ) { step2Negative.classList.remove("funnelStepHidden"); }

                }

            }, 400);

        });

    });

}


/* ── Feedback Form Submission ── */

const funnelFeedbackForm  = document.getElementById("funnelFeedbackForm");

const funnelFormFeedback  = document.getElementById("funnelFormFeedback");

const funnelSubmitBtn     = document.getElementById("funnelSubmitBtn");

if ( funnelFeedbackForm )
{

    funnelFeedbackForm.addEventListener("submit", async function ( event )
    {

        event.preventDefault();

        clearFeedback( funnelFormFeedback );

        const feedback = getVal("funnelFeedback");

        if ( !feedback )
        {

            showFeedback( funnelFormFeedback, "error", "Please describe what went wrong." );

            return;

        }

        if ( funnelSubmitBtn )
        {

            funnelSubmitBtn.disabled    = true;

            funnelSubmitBtn.textContent = "Sending…";

        }

        const payload =
        {

            action:      "customerFeedback",

            source:      "740Eatz Review Funnel",

            rating:      selectedRating,

            name:        getVal("funnelName"),

            contact:     getVal("funnelPhone"),

            feedback:    feedback,

            submittedAt: new Date().toISOString()

        };

        try
        {

            const response = await fetch( FEEDBACK_ENDPOINT,
            {

                method:  "POST",

                headers: { "Content-Type": "application/json" },

                body:    JSON.stringify( payload )

            });

            if ( response.ok )
            {

                if ( step2Negative ) { step2Negative.classList.add("funnelStepHidden"); }

                if ( step3 ) { step3.classList.remove("funnelStepHidden"); }

            }
            else
            {

                throw new Error("Server error");

            }

        }
        catch ( err )
        {

            showFeedback(
                funnelFormFeedback,
                "error",
                "Something went wrong. Please contact us directly at (220) 240-8435."
            );

            if ( funnelSubmitBtn )
            {

                funnelSubmitBtn.disabled    = false;

                funnelSubmitBtn.textContent = "Send Feedback";

            }

        }

    });

}
