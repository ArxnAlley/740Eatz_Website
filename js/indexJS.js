/* ============================================================
   740EATZ — INDEX PAGE JAVASCRIPT
   indexJS.js

   Scope:
   - Header scroll state
   - Burger menu toggle
   - Menu dropdown (desktop + mobile)
   - Order builder (orderPage.html)
   - Stats counter animation
   - Viewport reveal animation
   - Copyright year (dynamic)

   V2 Architecture Hooks:
   [V2 PAYMENT HOOK]   — Stripe payment integration point
   [V2 DASHBOARD HOOK] — Order management system POST point
   [V2 EMAIL HOOK]     — Confirmation email trigger point
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

/*
    Single 740Eatz API endpoint (Google Apps Script Web App).
    All actions are selected via the ?action= query parameter:
        GET  ?action=public.settings
        POST ?action=orders.create
    SETTINGS_ENDPOINT (Public Settings section) reuses this value.
*/

const EATZ_API_ENDPOINT = "https://script.google.com/macros/s/AKfycbwy-rI7WNwFmBqVzJGpdqqKsswJdSCIyWhXb0_Ztua0As62BIEL7l_N2AHWwspd0LEF/exec";

let validPickupDayNumbers = [ 1, 2, 5 ];

/*
    [V2 PAYMENT HOOK]
    When payment is integrated:
    const STRIPE_PUBLIC_KEY = "pk_live_...";
    const PAYMENT_ENDPOINT  = "https://YOUR_ENDPOINT_HERE/create-payment-intent";
*/


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

    siteHeader.classList.add("navOpen");

    burgerBtn.setAttribute("aria-expanded", "true");

    burgerBtn.setAttribute("aria-label", "Close navigation menu");

    document.body.style.overflow = "hidden";

}

function closeNav ()
{

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

        if ( siteHeader.classList.contains("navOpen") )
        {
            closeNav();
        }

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

function normalizePhoneDigits ( value )
{

    let digits = value.replace(/\D/g, "");

    /* Strip a leading US country code (e.g. autofill's "17402068885") */

    if ( digits.length === 11 && digits.charAt(0) === "1" )
    {

        digits = digits.slice(1);

    }

    return digits;

}

function formatPhoneForDisplay ( value )
{

    const digits = normalizePhoneDigits( value ).slice(0, 10);

    if ( digits.length < 4 ) { return digits; }

    if ( digits.length < 7 ) { return "(" + digits.slice(0, 3) + ") " + digits.slice(3); }

    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);

}

function showOrderSuccessPanel ( el, referenceId )
{

    if ( !el ) { return; }

    el.className = "formFeedback";

    el.classList.add("feedbackSuccess");

    el.textContent = "";

    function addLine ( text, bold )
    {

        if ( bold )
        {
            const strong = document.createElement("strong");
            strong.textContent = text;
            el.appendChild(strong);
        }
        else
        {
            el.appendChild( document.createTextNode(text) );
        }

        el.appendChild( document.createElement("br") );

    }

    addLine( "Your order request has been received!", false );

    el.appendChild( document.createElement("br") );

    if ( referenceId )
    {

        addLine( "Reference #: " + referenceId, true );

        addLine( "Please save this number — you may need it if you contact us about your order.", false );

        el.appendChild( document.createElement("br") );

    }

    addLine( "What happens next?", true );

    addLine( "1. We'll review your request.", false );

    addLine( "2. We'll contact you to confirm availability.", false );

    addLine( "3. We'll confirm pickup details and payment.", false );

    addLine( "4. Once confirmed, we'll begin preparing your order.", false );

    if ( el.lastChild && el.lastChild.nodeName === "BR" )
    {
        el.removeChild( el.lastChild );
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });

}


/* ============================================================
   STATS COUNTER — HERO
============================================================ */

function animateCounter ( el, targetVal, formatter, duration )
{

    const startTime = performance.now();

    function tick ( now )
    {

        const elapsed  = now - startTime;

        const progress = Math.min( elapsed / duration, 1 );

        /* Ease out cubic */

        const eased   = 1 - Math.pow( 1 - progress, 3 );

        const current = Math.floor( eased * targetVal );

        el.textContent = formatter( current );

        if ( progress < 1 )
        {

            requestAnimationFrame(tick);

        }
        else
        {

            el.textContent = formatter(targetVal);

        }

    }

    requestAnimationFrame(tick);

}

const statRecommended = document.getElementById("statRecommended");

if ( statRecommended )
{

    animateCounter(

        statRecommended,

        100,

        function ( n ) { return n + "%"; },

        1200

    );

}


/* ============================================================
   VIEWPORT REVEAL — INTERSECTION OBSERVER
============================================================ */

const revealEls = document.querySelectorAll(".revealOnScroll");

if ( revealEls.length > 0 && "IntersectionObserver" in window )
{

    const revealObserver = new IntersectionObserver(

        function ( entries )
        {

            entries.forEach(function ( entry )
            {

                if ( entry.isIntersecting )
                {

                    entry.target.classList.add("revealed");

                    revealObserver.unobserve( entry.target );

                }

            });

        },

        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }

    );

    revealEls.forEach(function ( el )
    {

        revealObserver.observe(el);

    });

}


/* ============================================================
   ORDER BUILDER — STATE
============================================================ */

const builderState =
{

    step:      1,

    product:   null,

    size:      null,

    flavor:    null,

    date:      null,

    firstName: "",

    lastName:  "",

    phone:     "",

    email:     "",

    notes:     "",

    customTrayDetails: ""

};

let autoAdvanceLocked = false;

function noFlavorProduct ()
{

    return builderState.product === "chocoStrawberries"      ||
           builderState.product === "cheesecakeStrawberries" ||
           builderState.product === "customTray";

}

function noSizeStepProduct ()
{

    return builderState.product === "chocoStrawberries" ||
           builderState.product === "cheesecakeStrawberries";

}

function getActiveSteps ()
{

    if ( noSizeStepProduct() ) { return [ 1, 4, 5, 6 ]; }

    return noFlavorProduct() ? [ 1, 2, 4, 5, 6 ] : [ 1, 2, 3, 4, 5, 6 ];

}


/* ============================================================
   ORDER BUILDER — PRICING
============================================================ */

function getPriceDisplay ( product, size )
{

    if ( product === "candyGrapes" )
    {

        if ( size === "small" )       { return "$25"; }

        if ( size === "large" )       { return "$40"; }

        if ( size === "threeFlavor" ) { return "$45"; }

    }

    if ( product === "chocoStrawberries" )        { return "$25 per dozen"; }

    if ( product === "cheesecakeStrawberries" )   { return "$27"; }

    if ( product === "customTray" )               { return "Custom Quote"; }

    return "TBD";

}


/* ============================================================
   ORDER BUILDER — INITIALIZATION
============================================================ */

const builderWrap      = document.getElementById("productBuilder");

const progressFill     = document.getElementById("builderProgressFill");

const stepLabel        = document.getElementById("builderStepLabel");

const backBtn          = document.getElementById("builderBackBtn");

const nextBtn          = document.getElementById("builderNextBtn");

const builderSubmitBtn = document.getElementById("builderSubmitBtn");

const builderFeedback  = document.getElementById("builderFeedback");

function updateProgress ()
{

    if ( !progressFill || !stepLabel ) { return; }

    const active   = getActiveSteps();
    const idx      = active.indexOf( builderState.step );

    if ( idx === -1 ) { return; }

    const dispStep = idx + 1;
    const total    = active.length;
    const pct      = ( ( dispStep - 1 ) / ( total - 1 ) ) * 100;

    progressFill.style.width = pct + "%";

    const stepNames =
    [
        "",
        "Choose Product",
        builderState.product === "customTray" ? "Tray Details" : "Choose Size",
        "Choose Flavor",
        "Pick Pickup Date",
        "Your Info",
        "Review Order"
    ];

    stepLabel.textContent = "Step " + dispStep + " of " + total + " — " + stepNames[ builderState.step ];

}

function showPanel ( step )
{

    for ( let i = 1; i <= 6; i++ )
    {

        const panel = document.getElementById("builderPanel" + i);

        if ( panel )
        {

            if ( i === step )
            {
                panel.classList.remove("builderPanelHidden");
            }
            else
            {
                panel.classList.add("builderPanelHidden");
            }

        }

    }

    if ( backBtn )
    {

        backBtn.style.visibility = step === 1 ? "hidden" : "visible";

    }

    const navRow = document.getElementById("builderNavRow");

    if ( navRow )
    {

        navRow.style.display = step === 6 ? "none" : "flex";

    }

    updateProgress();

    /* Auto-advance step 3 for products that don't require a flavor selection */

    if ( step === 3 &&
         !autoAdvanceLocked &&
         builderState.product &&
         ( builderState.product === "chocoStrawberries"      ||
           builderState.product === "cheesecakeStrawberries" ||
           builderState.product === "customTray" ) )
    {

        setTimeout(function ()
        {

            if ( builderState.step === 3 )
            {

                builderState.step++;

                showPanel( builderState.step );

                updateNextBtn();

            }

        }, 320);

    }

}

function validateStep ( step )
{

    if ( step === 1 ) { return builderState.product !== null; }

    if ( step === 2 )
    {

        if ( builderState.product === "customTray" )
        {
            return builderState.customTrayDetails.trim().length > 0;
        }

        return builderState.size !== null;

    }

    if ( step === 3 )
    {

        if ( builderState.product === "chocoStrawberries"      ||
             builderState.product === "customTray"              ||
             builderState.product === "cheesecakeStrawberries" )
        {
            return true;
        }

        return builderState.flavor !== null;

    }

    if ( step === 4 )
    {

        const dateEl = document.getElementById("builderPickupDate");

        if ( !dateEl || !dateEl.value ) { return false; }

        const selected = new Date( dateEl.value + "T00:00:00" );

        const day = selected.getDay();

        return validPickupDayNumbers.includes( day );

    }

    if ( step === 5 )
    {

        const firstName  = getVal("bFirstName");

        const lastName   = getVal("bLastName");

        const phone      = getVal("bPhone");

        const email      = getVal("bEmail");

        const phoneClean = phone.replace(/\D/g, "");

        const emailValid = email.includes("@") && email.includes(".");

        return firstName && lastName && phoneClean.length >= 10 && emailValid;

    }

    return true;

}

function updateNextBtn ()
{

    if ( !nextBtn ) { return; }

    nextBtn.disabled = !validateStep( builderState.step );

}


/* ============================================================
   ORDER BUILDER — INTERACTIONS
============================================================ */

if ( builderWrap )
{

    /* ── Product Choices ── */

    document.querySelectorAll(".builderChoice").forEach(function ( btn )
    {

        btn.addEventListener("click", function ()
        {

            document.querySelectorAll(".builderChoice").forEach(function ( b ) { b.classList.remove("isSelected"); });

            btn.classList.add("isSelected");

            builderState.product = btn.getAttribute("data-product");

            builderState.size    = null;

            builderState.flavor  = null;

            populateSizeGrid();

            updateNextBtn();

            /* Auto-advance to size step */

            if ( !autoAdvanceLocked )
            {

                setTimeout(function ()
                {

                    if ( validateStep(1) && builderState.step === 1 )
                    {

                        const fwdActive = getActiveSteps();
                        const fwdIdx    = fwdActive.indexOf(1);
                        builderState.step = ( fwdIdx !== -1 && fwdIdx < fwdActive.length - 1 )
                            ? fwdActive[ fwdIdx + 1 ]
                            : builderState.step + 1;

                        showPanel( builderState.step );

                        updateNextBtn();

                    }

                }, 350);

            }

        });

    });


    /* ── Size Grid Population ── */

    function populateSizeGrid ()
    {

        const grid = document.getElementById("sizeChoices");

        if ( !grid ) { return; }

        grid.innerHTML = "";

        if ( builderState.product === "candyGrapes" )
        {

            const sizes =
            [
                { value: "small",       label: "Small Tray",  price: "$25" },
                { value: "large",       label: "Large Tray",  price: "$40" },
                { value: "threeFlavor", label: "Trio Tray",   price: "$45" }
            ];

            sizes.forEach(function ( s )
            {

                const opt = document.createElement("button");

                opt.type         = "button";

                opt.className    = "sizeOption";

                opt.dataset.size = s.value;

                opt.innerHTML    = "<span class='sizeOptionName'>" + s.label + "</span><span class='sizeOptionPrice'>" + s.price + "</span>";

                opt.addEventListener("click", function ()
                {

                    grid.querySelectorAll(".sizeOption").forEach(function ( b ) { b.classList.remove("isSelected"); });

                    opt.classList.add("isSelected");

                    builderState.size = s.value;

                    updateNextBtn();

                    /* Auto-advance to flavor step */

                    if ( !autoAdvanceLocked )
                    {

                        setTimeout(function ()
                        {

                            if ( validateStep(2) && builderState.step === 2 )
                            {

                                builderState.step++;

                                showPanel( builderState.step );

                                updateNextBtn();

                            }

                        }, 350);

                    }

                });

                grid.appendChild(opt);

            });

        }
        else if ( builderState.product === "chocoStrawberries" )
        {

            const opt = document.createElement("button");

            opt.type         = "button";

            opt.className    = "sizeOption isSelected";

            opt.dataset.size = "dozen";

            opt.innerHTML    = "<span class='sizeOptionName'>Dozen</span><span class='sizeOptionPrice'>$25</span>";

            opt.addEventListener("click", function () {});

            grid.appendChild(opt);

            builderState.size = "dozen";

            updateNextBtn();

        }
        else if ( builderState.product === "cheesecakeStrawberries" )
        {

            const opt = document.createElement("button");

            opt.type         = "button";

            opt.className    = "sizeOption isSelected";

            opt.dataset.size = "perOrder";

            opt.innerHTML    = "<span class='sizeOptionName'>Dozen</span><span class='sizeOptionPrice'>$27</span>";

            opt.addEventListener("click", function () {});

            grid.appendChild(opt);

            builderState.size = "perOrder";

            updateNextBtn();

        }
        else if ( builderState.product === "customTray" )
        {

            builderState.size = "custom";

            const wrap = document.createElement("div");

            wrap.className = "formGroup customTrayDetailsGroup";

            const label = document.createElement("label");

            label.className = "formLabel";

            label.setAttribute("for", "customTrayDetails");

            label.textContent = "What would you like included in your custom tray?";

            const textarea = document.createElement("textarea");

            textarea.className   = "formTextarea";

            textarea.id          = "customTrayDetails";

            textarea.name        = "customTrayDetails";

            textarea.rows        = 4;

            textarea.placeholder = "Tell us what you'd like…";

            textarea.value       = builderState.customTrayDetails;

            textarea.addEventListener("input", function ()
            {

                builderState.customTrayDetails = textarea.value;

                updateNextBtn();

            });

            const helper = document.createElement("p");

            helper.className = "builderDateNote";

            helper.textContent = "Let us know what to include — candy, fruit, chocolate, theme, colors, and any special requests.";

            wrap.appendChild(label);

            wrap.appendChild(textarea);

            wrap.appendChild(helper);

            grid.appendChild(wrap);

            updateNextBtn();

        }

    }


    /* ── Flavor Chips ── */

    document.querySelectorAll(".flavorChip").forEach(function ( chip )
    {

        chip.addEventListener("click", function ()
        {

            document.querySelectorAll(".flavorChip").forEach(function ( c ) { c.classList.remove("isSelected"); });

            chip.classList.add("isSelected");

            builderState.flavor = chip.getAttribute("data-flavor");

            updateNextBtn();

        });

    });


    /* ── Pickup Date Validation ── */

    const dateInput = document.getElementById("builderPickupDate");

    if ( dateInput )
    {

        const tomorrow = new Date();

        tomorrow.setDate( tomorrow.getDate() + 1 );

        dateInput.min = tomorrow.toISOString().split("T")[0];

        /* Open the native picker immediately on tap/click — no manual typing */

        if ( typeof dateInput.showPicker === "function" )
        {

            dateInput.addEventListener("click", function ()
            {

                try { dateInput.showPicker(); } catch ( err ) {}

            });

        }

        dateInput.addEventListener("change", function ()
        {

            const errorEl = document.getElementById("builderDateError");

            const selected = new Date( dateInput.value + "T00:00:00" );

            const day = selected.getDay();

            const validDays = validPickupDayNumbers;

            if ( !validDays.includes(day) )
            {

                builderState.date = null;

                if ( errorEl )
                {
                    const allNames    = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
                    const available   = validDays.map(function ( n ) { return allNames[ n ]; });
                    errorEl.textContent = 'Please select a ' + formatDaysList( available, 'or' ) + '.';
                }

            }
            else
            {

                builderState.date = dateInput.value;

                if ( errorEl )
                {
                    errorEl.textContent = "";
                }

            }

            updateNextBtn();

        });

    }


    /* ── Customer Info Fields ── */

    ["bFirstName", "bLastName", "bPhone", "bEmail"].forEach(function ( id )
    {

        const el = document.getElementById(id);

        if ( el )
        {

            el.addEventListener("input", updateNextBtn);

        }

    });

    const phoneInput = document.getElementById("bPhone");

    if ( phoneInput )
    {

        phoneInput.addEventListener("blur", function ()
        {

            phoneInput.value = formatPhoneForDisplay( phoneInput.value );

        });

    }


    /* ── Clickable Summary Row Navigation ── */

    function initSummaryNavigation ()
    {

        document.querySelectorAll(".summaryRowClickable").forEach(function ( row )
        {

            row.addEventListener("click", function ()
            {

                const targetStep = parseInt( row.getAttribute("data-step"), 10 );

                if ( targetStep && targetStep >= 1 && targetStep < 6 && getActiveSteps().includes(targetStep) )
                {

                    builderState.step = targetStep;

                    showPanel( targetStep );

                    updateNextBtn();

                    builderWrap.scrollIntoView({ behavior: "smooth", block: "start" });

                }

            });

        });

    }


    /* ── Next Button ── */

    if ( nextBtn )
    {

        nextBtn.addEventListener("click", function ()
        {

            if ( !validateStep( builderState.step ) ) { return; }

            if ( builderState.step === 5 )
            {

                builderState.firstName = getVal("bFirstName");

                builderState.lastName  = getVal("bLastName");

                builderState.phone     = normalizePhoneDigits( getVal("bPhone") );

                builderState.email     = getVal("bEmail");

                builderState.notes     = getVal("bNotes");

                populateSummary();

            }

            const fwdActive = getActiveSteps();
            const fwdIdx    = fwdActive.indexOf( builderState.step );
            builderState.step = ( fwdIdx !== -1 && fwdIdx < fwdActive.length - 1 )
                ? fwdActive[ fwdIdx + 1 ]
                : builderState.step + 1;

            showPanel( builderState.step );

            updateNextBtn();

        });

    }


    /* ── Back Button ── */

    if ( backBtn )
    {

        backBtn.addEventListener("click", function ()
        {

            const bckActive = getActiveSteps();
            const bckIdx    = bckActive.indexOf( builderState.step );

            if ( bckIdx > 0 )
            {

                builderState.step = bckActive[ bckIdx - 1 ];

                showPanel( builderState.step );

                updateNextBtn();

            }

        });

    }


    /* ── Label Helpers ── */

    function getProductLabel ( product )
    {

        const labels =
        {
            candyGrapes:            "Candied Fruit",
            chocoStrawberries:      "Chocolate Covered Strawberries",
            cheesecakeStrawberries: "Cheesecake Stuffed Strawberries",
            customTray:             "Custom Candy Tray"
        };

        return labels[ product ] || product;

    }

    function getSizeLabel ( product, size )
    {

        if ( product === "candyGrapes" )
        {

            const labels =
            {
                small:       "Small Tray",
                large:       "Large Tray",
                threeFlavor: "Trio Tray"
            };

            return labels[ size ] || size;

        }

        if ( product === "chocoStrawberries" )        { return "Dozen"; }

        if ( product === "cheesecakeStrawberries" )   { return "Dozen"; }

        return "Custom";

    }

    function getFlavorLabel ( flavor )
    {

        const labels =
        {
            blueRaspberry: "Blue Raspberry",
            watermelon:    "Watermelon",
            greenApple:    "Green Apple",
            cottonCandy:   "Cotton Candy",
            strawberry:    "Strawberry",
            pineapple:     "Pineapple",
            mixedFlavor:   "Mixed Flavor",
            milk:          "Milk Chocolate",
            white:         "White Chocolate",
            dark:          "Dark Chocolate"
        };

        return labels[ flavor ] || flavor || "N/A";

    }

    function buildOrderNotes ()
    {

        if ( builderState.product === "customTray" && builderState.customTrayDetails.trim() )
        {

            const details = "Custom Tray Details: " + builderState.customTrayDetails.trim();

            return builderState.notes
                ? details + " | Additional notes: " + builderState.notes
                : details;

        }

        return builderState.notes;

    }

    function formatPickupDateDisplay ( isoDate )
    {

        if ( !isoDate ) { return ""; }

        const parsed = new Date( isoDate + "T00:00:00" );

        if ( isNaN( parsed.getTime() ) ) { return ""; }

        return parsed.toLocaleDateString( "en-US",
        {
            weekday: "long",
            year:    "numeric",
            month:   "long",
            day:     "numeric"
        });

    }


    /* ── Populate Summary ── */

    function populateSummary ()
    {

        const setVal = function ( id, value )
        {

            const el = document.getElementById(id);

            if ( el ) { el.textContent = value; }

        };

        setVal( "sumProduct", getProductLabel( builderState.product ) );

        if ( builderState.product === "customTray" )
        {

            const details = builderState.customTrayDetails.trim();

            setVal( "sumSize", details
                ? ( details.length > 60 ? details.slice(0, 60) + "…" : details )
                : "Not provided" );

        }
        else
        {

            setVal( "sumSize", getSizeLabel( builderState.product, builderState.size ) );

        }

        setVal( "sumFlavor",  getFlavorLabel( builderState.flavor ) );

        setVal( "sumDate",    formatPickupDateDisplay( builderState.date ) || "Not selected" );

        setVal( "sumPrice",   getPriceDisplay( builderState.product, builderState.size ) );

        /* Tray details already have their own row above — avoid repeating them here */

        setVal( "sumNotes",   builderState.notes || "None" );

        const flavorRow = document.querySelector( '.summaryRow[data-step="3"]' );
        if ( flavorRow ) { flavorRow.style.display = noFlavorProduct() ? "none" : ""; }

        const sizeRow = document.querySelector( '.summaryRow[data-step="2"]' );

        if ( sizeRow )
        {

            const sizeLabel = sizeRow.querySelector(".summaryLabel");

            const isCustomTray = builderState.product === "customTray";

            const isFixedSize  = noSizeStepProduct();

            if ( sizeLabel ) { sizeLabel.textContent = isCustomTray ? "Tray Details" : "Size"; }

            if ( isFixedSize )
            {

                /* Only one size exists for this product — nothing to go back and change */

                sizeRow.classList.remove("summaryRowClickable");

                sizeRow.removeAttribute("title");

            }
            else
            {

                sizeRow.classList.add("summaryRowClickable");

                sizeRow.title = isCustomTray ? "Click to change tray details" : "Click to change size";

            }

        }

        initSummaryNavigation();

    }


    /* ── URL Deep-Link Initialization ── */

    function initFromUrlParams ()
    {

        const params       = new URLSearchParams( window.location.search );

        const productParam = params.get("product");

        const sizeParam    = params.get("size");

        if ( !productParam ) { return; }

        const productBtn = document.querySelector('[data-product="' + productParam + '"]');

        if ( !productBtn ) { return; }

        autoAdvanceLocked = true;

        /* Select product without auto-advance */

        document.querySelectorAll(".builderChoice").forEach(function ( b ) { b.classList.remove("isSelected"); });

        productBtn.classList.add("isSelected");

        builderState.product = productParam;

        builderState.size    = null;

        builderState.flavor  = null;

        populateSizeGrid();

        if ( noSizeStepProduct() )
        {

            /* Fixed-size products always skip straight to the pickup date step */

            const dlActive    = getActiveSteps();
            builderState.step = dlActive[ dlActive.indexOf(1) + 1 ];

            showPanel( builderState.step );

            updateNextBtn();

            autoAdvanceLocked = false;

            return;

        }

        if ( sizeParam )
        {

            /* Allow DOM to paint size grid before selecting */

            setTimeout(function ()
            {

                const sizeBtn = document.querySelector('[data-size="' + sizeParam + '"]');

                if ( sizeBtn )
                {

                    document.querySelectorAll(".sizeOption").forEach(function ( b ) { b.classList.remove("isSelected"); });

                    sizeBtn.classList.add("isSelected");

                    builderState.size = sizeParam;

                }

                /* Jump past size step; for no-flavor products skip directly to panel 4 */

                if ( sizeParam && builderState.size )
                {

                    const dlActive    = getActiveSteps();
                    const afterSize   = dlActive[ dlActive.indexOf(2) + 1 ] || 3;
                    builderState.step = afterSize;

                }
                else
                {

                    builderState.step = 2;

                }

                showPanel( builderState.step );

                updateNextBtn();

                autoAdvanceLocked = false;

            }, 60);

        }
        else
        {

            builderState.step = 2;

            showPanel( builderState.step );

            updateNextBtn();

            autoAdvanceLocked = false;

        }

    }


    /* ── Submit Order Request ── */

    if ( builderSubmitBtn )
    {

        builderSubmitBtn.addEventListener("click", async function ()
        {

            if ( builderFeedback )
            {
                clearFeedback( builderFeedback );
            }

            builderSubmitBtn.disabled    = true;

            builderSubmitBtn.textContent = "Sending…";

            /*
                submittedAt is stamped by the API server-side.
                The API assigns the order id, status (NEW_REQUEST),
                and paymentStatus (unpaid) — the website never sets workflow state.

                [V2 PAYMENT HOOK]
                Stripe payment integration point.

                [V2 EMAIL HOOK]
                Trigger confirmation email to customer and owner.
            */

            const payload =
            {

                source:     "740Eatz Website V2",

                product:    getProductLabel( builderState.product ),

                size:       getSizeLabel( builderState.product, builderState.size ),

                flavor:     noFlavorProduct() ? "" : getFlavorLabel( builderState.flavor ),

                pickupDate: builderState.date,

                firstName:  builderState.firstName,

                lastName:   builderState.lastName,

                phone:      builderState.phone,

                email:      builderState.email,

                notes:      buildOrderNotes(),

                price:      getPriceDisplay( builderState.product, builderState.size )

            };

            try
            {

                /*
                    Content-Type is text/plain to avoid a CORS preflight —
                    Apps Script Web Apps do not answer OPTIONS requests.
                    The body is still JSON and is parsed by the API's doPost().
                */

                const response = await fetch( EATZ_API_ENDPOINT + "?action=orders.create",
                {

                    method:  "POST",

                    headers: { "Content-Type": "text/plain;charset=utf-8" },

                    body:    JSON.stringify( payload )

                });

                if ( !response.ok )
                {

                    throw new Error("Server error");

                }

                /* Apps Script returns HTTP 200 even on logical errors — check json.success */

                const json = await response.json();

                if ( json.success )
                {

                    const referenceId = json.data && json.data.id ? json.data.id : "";

                    showOrderSuccessPanel( builderFeedback, referenceId );

                    builderSubmitBtn.textContent = "✓ Order Request Submitted";

                }
                else
                {

                    const apiMessage = json.error && json.error.message
                        ? json.error.message
                        : "Something went wrong. Please try again or contact us at (220) 240-8435.";

                    showFeedback( builderFeedback, "error", apiMessage );

                    builderSubmitBtn.disabled    = false;

                    builderSubmitBtn.textContent = "Send Order Request";

                }

            }
            catch ( err )
            {

                showFeedback(
                    builderFeedback,
                    "error",
                    "Something went wrong. Please try again or contact us at (220) 240-8435."
                );

                builderSubmitBtn.disabled    = false;

                builderSubmitBtn.textContent = "Send Order Request";

            }

        });

    }


    /* ── Initialize Builder ── */

    showPanel(1);

    updateNextBtn();

    initFromUrlParams();

}


/* ============================================================
   PUBLIC SETTINGS
============================================================ */

/* Same Apps Script Web App as order submission — defined once in CONFIGURATION */

const SETTINGS_ENDPOINT = EATZ_API_ENDPOINT;


/* ── Data Helpers ── */

function normalizeDays ( raw )
{

    if ( !raw ) { return []; }

    if ( Array.isArray(raw) ) { return raw.map(String); }

    try
    {

        const parsed = JSON.parse(raw);

        if ( Array.isArray(parsed) ) { return parsed.map(String); }

    }
    catch (e) {}

    return String(raw).split(',').map(function ( s ) { return s.trim(); }).filter(Boolean);

}


function dayNameToNumber ( name )
{

    const map =
    {
        Sunday: 0, Monday: 1, Tuesday: 2,
        Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6
    };

    return map[ name ] !== undefined ? map[ name ] : -1;

}


function parsePickupConfig ( raw )
{

    if ( !raw ) { return null; }

    if ( typeof raw === 'object' ) { return raw; }

    try { return JSON.parse(raw); }
    catch (e) { return null; }

}


function formatDaysList ( days, conjunction )
{

    if ( !days || days.length === 0 ) { return ''; }

    if ( days.length === 1 ) { return days[0]; }

    if ( days.length === 2 ) { return days[0] + ' ' + ( conjunction || 'and' ) + ' ' + days[1]; }

    return days.slice(0, -1).join(', ') + ', ' + ( conjunction || 'and' ) + ' ' + days[ days.length - 1 ];

}


/* ── Fetch ── */

async function loadPublicSettings ()
{

    try
    {

        const response = await fetch( SETTINGS_ENDPOINT + '?action=public.settings' );

        if ( !response.ok ) { return; }

        const json = await response.json();

        if ( !json.success || !json.data ) { return; }

        applyPublicSettings( json.data );

    }
    catch ( err )
    {

        /* Network error — dynamic sections suppressed, static content remains */

    }

}


/* ── Apply All Settings ── */

function applyPublicSettings ( settings )
{

    applyOrderAvailability( settings.orderAvailability );

    applyPickupSchedule( settings.pickupDays, settings.pickupConfiguration, settings.updatedAt );

    applyBusinessName( settings.businessName );

}


/* ── Order Availability Banner ── */

function applyOrderAvailability ( value )
{

    if ( value !== 'closed' ) { return; }

    const banner = document.getElementById('siteBanner');

    if ( !banner ) { return; }

    const bannerHeight = banner.offsetHeight;

    document.documentElement.style.setProperty( '--bannerH', bannerHeight + 'px' );

    banner.classList.add('isVisible');

    banner.removeAttribute('aria-hidden');

}


/* ── Pickup Schedule ── */

function applyPickupSchedule ( pickupDays, pickupConfiguration, updatedAt )
{

    const days   = normalizeDays( pickupDays );
    const config = parsePickupConfig( pickupConfiguration );

    if ( days.length === 0 ) { return; }

    renderPickupDayCards( days );

    renderPickupHours( config ? config.windows : null );

    renderPickupMessage( config ? config.message : null );

    renderLastUpdated( updatedAt );

    applyContactPickupDays( days );

    applyPickupDaysInlineLists( days );

    validPickupDayNumbers = days.map(dayNameToNumber).filter(function ( n ) { return n !== -1; });

    const section = document.getElementById('pickupSchedule');

    if ( section ) { section.hidden = false; }

}


function renderPickupDayCards ( days )
{

    const grid = document.getElementById('pickupDaysGrid');

    if ( !grid ) { return; }

    grid.innerHTML = '';

    if ( !days || days.length === 0 ) { return; }

    days.forEach(function ( day )
    {

        const abbr = day.substring(0, 3).toUpperCase();

        const card = document.createElement('div');

        card.className = 'pickupDayCard';

        card.innerHTML =
            '<span class="pickupDayAbbr" aria-hidden="true">' + abbr + '</span>' +
            '<span class="pickupDayFull">' + day + '</span>';

        grid.appendChild(card);

    });

}


function renderPickupHours ( windows )
{

    const wrap = document.getElementById('pickupHoursWrap');

    if ( !wrap ) { return; }

    if ( !windows || !Array.isArray(windows) )
    {

        wrap.hidden = true;

        return;

    }

    const valid = windows.filter(function ( w )
    {

        return w.days && w.days.length > 0 && w.start && w.end;

    });

    if ( valid.length === 0 )
    {

        wrap.hidden = true;

        return;

    }

    const grid = wrap.querySelector('.pickupHoursGrid');

    if ( !grid ) { return; }

    grid.innerHTML = '';

    valid.forEach(function ( w )
    {

        const dayNames = Array.isArray(w.days) ? w.days.join(' & ') : String(w.days);

        const block = document.createElement('div');

        block.className = 'pickupWindowBlock';

        block.innerHTML =
            '<p class="pickupWindowDays">' + dayNames + '</p>' +
            '<p class="pickupWindowTimes">' + w.start + ' – ' + w.end + '</p>';

        grid.appendChild(block);

    });

    wrap.hidden = false;

}


function renderPickupMessage ( message )
{

    const wrap = document.getElementById('pickupMessageWrap');

    if ( !wrap ) { return; }

    if ( !message || !String(message).trim() )
    {

        wrap.hidden = true;

        return;

    }

    const textEl = wrap.querySelector('.pickupMessageText');

    if ( textEl ) { textEl.textContent = message; }

    wrap.hidden = false;

}


function renderLastUpdated ( updatedAt )
{

    const el = document.getElementById('pickupLastUpdated');

    if ( !el ) { return; }

    const parsed = updatedAt ? new Date(updatedAt) : null;

    if ( !parsed || isNaN( parsed.getTime() ) )
    {

        /* Never show a raw/invalid value (e.g. a broken sheet formula) — hide instead */

        el.hidden = true;

        return;

    }

    const formatted = parsed.toLocaleDateString( 'en-US',
    {
        month: 'long',
        day:   'numeric',
        year:  'numeric'
    });

    el.textContent = '';

    el.appendChild( document.createTextNode('Last updated: ') );

    const valueSpan = document.createElement('span');

    valueSpan.className = 'pickupLastUpdatedValue';

    valueSpan.textContent = formatted;

    el.appendChild(valueSpan);

    el.hidden = false;

}


/* ── Contact Strip & Footer Pickup Days ── */

function applyContactPickupDays ( days )
{

    if ( !days || days.length === 0 ) { return; }

    const contactDays = document.getElementById('homeContactDays');

    if ( contactDays )
    {

        contactDays.innerHTML = '';

        days.forEach(function ( day )
        {

            const span = document.createElement('span');

            span.className = 'homeContactDay';

            span.textContent = day;

            contactDays.appendChild(span);

        });

    }

    const footerList = document.getElementById('footerPickupDays');

    if ( footerList )
    {

        footerList.innerHTML = '';

        days.forEach(function ( day )
        {

            const li = document.createElement('li');

            li.textContent = day;

            footerList.appendChild(li);

        });

    }

}


function applyPickupDaysInlineLists ( days )
{

    if ( !days || days.length === 0 ) { return; }

    const prose   = formatDaysList( days, 'and' );
    const proseOr = formatDaysList( days, 'or' );

    document.querySelectorAll('.pickupDaysListAnd').forEach(function ( el )
    {

        el.textContent = prose;

    });

    document.querySelectorAll('.pickupDaysListOr').forEach(function ( el )
    {

        el.textContent = proseOr;

    });

}


/* ── Business Name ── */

function applyBusinessName ( name )
{

    if ( !name ) { return; }

    document.querySelectorAll('.businessName').forEach(function ( el )
    {

        el.textContent = name;

    });

}


loadPublicSettings();
