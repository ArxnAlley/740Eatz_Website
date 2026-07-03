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

const ORDER_ENDPOINT = "https://YOUR_ENDPOINT_HERE/order-request";

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

    notes:     ""

};

let autoAdvanceLocked = false;

function noFlavorProduct ()
{

    return builderState.product === "chocoStrawberries"      ||
           builderState.product === "cheesecakeStrawberries" ||
           builderState.product === "customTray";

}

function getActiveSteps ()
{

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
        "Choose Size",
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

            }

        }, 320);

    }

}

function validateStep ( step )
{

    if ( step === 1 ) { return builderState.product !== null; }

    if ( step === 2 ) { return builderState.size !== null; }

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

                        builderState.step++;

                        showPanel( builderState.step );

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

            opt.innerHTML    = "<span class='sizeOptionName'>Per Dozen</span><span class='sizeOptionPrice'>$27</span>";

            opt.addEventListener("click", function () {});

            grid.appendChild(opt);

            builderState.size = "perOrder";

            updateNextBtn();

        }
        else if ( builderState.product === "customTray" )
        {

            const opt = document.createElement("button");

            opt.type         = "button";

            opt.className    = "sizeOption isSelected";

            opt.dataset.size = "custom";

            opt.innerHTML    = "<span class='sizeOptionName'>Custom</span><span class='sizeOptionPrice'>Quote Required</span>";

            opt.addEventListener("click", function () {});

            grid.appendChild(opt);

            builderState.size = "custom";

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


    /* ── Clickable Summary Row Navigation ── */

    function initSummaryNavigation ()
    {

        document.querySelectorAll(".summaryRowClickable").forEach(function ( row )
        {

            row.addEventListener("click", function ()
            {

                const targetStep = parseInt( row.getAttribute("data-step"), 10 );

                if ( targetStep && targetStep >= 1 && targetStep < 6 )
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

                builderState.phone     = getVal("bPhone");

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

        if ( product === "cheesecakeStrawberries" )   { return "Per Dozen"; }

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


    /* ── Populate Summary ── */

    function populateSummary ()
    {

        const setVal = function ( id, value )
        {

            const el = document.getElementById(id);

            if ( el ) { el.textContent = value; }

        };

        setVal( "sumProduct", getProductLabel( builderState.product ) );

        setVal( "sumSize",    getSizeLabel( builderState.product, builderState.size ) );

        setVal( "sumFlavor",  getFlavorLabel( builderState.flavor ) );

        setVal( "sumDate",    builderState.date || "Not selected" );

        setVal( "sumPrice",   getPriceDisplay( builderState.product, builderState.size ) );

        setVal( "sumNotes",   builderState.notes || "None" );

        const flavorRow = document.querySelector( '.summaryRow[data-step="3"]' );
        if ( flavorRow ) { flavorRow.style.display = noFlavorProduct() ? "none" : ""; }

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

            const payload =
            {

                action:      "orderRequest",

                source:      "740Eatz Website V2",

                product:     getProductLabel( builderState.product ),

                size:        getSizeLabel( builderState.product, builderState.size ),

                flavor:      getFlavorLabel( builderState.flavor ),

                pickupDate:  builderState.date,

                firstName:   builderState.firstName,

                lastName:    builderState.lastName,

                phone:       builderState.phone,

                email:       builderState.email,

                notes:       builderState.notes,

                price:       getPriceDisplay( builderState.product, builderState.size ),

                submittedAt: new Date().toISOString()

                /*
                    [V2 PAYMENT HOOK]
                    Add: paymentStatus: "pending"

                    [V2 DASHBOARD HOOK]
                    POST this payload to the order management system.

                    [V2 EMAIL HOOK]
                    Trigger confirmation email to customer and owner.
                */

            };

            try
            {

                const response = await fetch( ORDER_ENDPOINT,
                {

                    method:  "POST",

                    headers: { "Content-Type": "application/json" },

                    body:    JSON.stringify( payload )

                });

                if ( response.ok )
                {

                    showFeedback(
                        builderFeedback,
                        "success",
                        "Your order request has been sent! We will contact you to confirm your order and pickup details."
                    );

                    builderSubmitBtn.textContent = "Request Sent!";

                }
                else
                {

                    throw new Error("Server error");

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

const SETTINGS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwy-rI7WNwFmBqVzJGpdqqKsswJdSCIyWhXb0_Ztua0As62BIEL7l_N2AHWwspd0LEF/exec';


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

    if ( days.length === 2 ) { return days[0] + ' & ' + days[1]; }

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

    renderPickupDayCards( days );

    renderPickupHours( config ? config.windows : null );

    renderPickupMessage( config ? config.message : null );

    renderLastUpdated( updatedAt );

    applyContactPickupDays( days );

    applyPickupDaysInlineLists( days );

    if ( days.length > 0 )
    {

        validPickupDayNumbers = days.map(dayNameToNumber).filter(function ( n ) { return n !== -1; });

    }

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

    if ( !updatedAt )
    {

        el.hidden = true;

        return;

    }

    el.innerHTML = 'Last updated: <span class="pickupLastUpdatedValue">' + updatedAt + '</span>';

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
