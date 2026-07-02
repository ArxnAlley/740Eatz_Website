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

const TOTAL_STEPS = 6;

let autoAdvanceLocked = false;


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

    const pct = ( ( builderState.step - 1 ) / ( TOTAL_STEPS - 1 ) ) * 100;

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

    stepLabel.textContent = "Step " + builderState.step + " of " + TOTAL_STEPS + " — " + stepNames[ builderState.step ];

}

function showPanel ( step )
{

    for ( let i = 1; i <= TOTAL_STEPS; i++ )
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

        navRow.style.display = step === TOTAL_STEPS ? "none" : "flex";

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

        return day === 1 || day === 2 || day === 5;

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

            const validDays = [1, 2, 5];

            if ( !validDays.includes(day) )
            {

                builderState.date = null;

                if ( errorEl )
                {
                    errorEl.textContent = "Please select a Monday, Tuesday, or Friday.";
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

                if ( targetStep && targetStep >= 1 && targetStep < TOTAL_STEPS )
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

            builderState.step++;

            showPanel( builderState.step );

        });

    }


    /* ── Back Button ── */

    if ( backBtn )
    {

        backBtn.addEventListener("click", function ()
        {

            if ( builderState.step > 1 )
            {

                builderState.step--;

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

                /* Jump to flavor step if size was selected, else size step */

                builderState.step = ( sizeParam && builderState.size ) ? 3 : 2;

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
